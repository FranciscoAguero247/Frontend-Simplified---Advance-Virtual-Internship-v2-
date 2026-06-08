"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "@/firebase/firebase"; 
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";

interface LibraryContextType {
  savedBookIds: string[];
  finishedBookIds: string[];
  toggleSavedBook: (bookId: string) => Promise<void>;
  markAsFinished: (bookId: string) => Promise<void>;
  loading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [finishedBookIds, setFinishedBookIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setSavedBookIds([]);
        setFinishedBookIds([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedBookIds(data.savedBooks || []);
        setFinishedBookIds(data.finishedBooks || []);
      } else {
        setSavedBookIds([]);
        setFinishedBookIds([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error reading live snapshot sync data stream:", error);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  const toggleSavedBook = async (bookId: string) => {
    if (!user) {
      alert("Please log in to save books!");
      return;
    }
    
    const userDocRef = doc(db, "users", user.uid);
    const isAlreadySaved = savedBookIds.includes(bookId);

    try {
      await setDoc(userDocRef, {
        savedBooks: isAlreadySaved ? arrayRemove(bookId) : arrayUnion(bookId),
      }, { merge: true });
    } catch (error) {
      console.error("Failed to mutate database save array:", error);
    }
  };

  const markAsFinished = async (bookId: string) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);

    try {
      await setDoc(userDocRef, {
        finishedBooks: arrayUnion(bookId),
        savedBooks: arrayRemove(bookId) 
      }, { merge: true });
    } catch (error) {
      console.error("Failed to update database tracking index:", error);
    }
  };

  return (
    <LibraryContext.Provider value={{ savedBookIds, finishedBookIds, toggleSavedBook, markAsFinished, loading }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be nested inside a LibraryProvider layout engine");
  }
  return context;
}