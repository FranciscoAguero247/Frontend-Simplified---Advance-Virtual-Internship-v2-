"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, signOut } from "@/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthModalContextType {
    isOpen: boolean;
    user: User | null;
    loading: boolean;
    openModal: () => void;
    closeModal: () => void;
    logoutUser: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Global Centralized Logout Action Method
  const logoutUser = async () => {
    try {
      await signOut(auth);
      // If they log out while inside protected app views, push them back to the landing homepage
      if (pathname !== "/") {
        router.push("/");
      }
    } catch (err) {
      console.error("Logout exception error caught:", err);
    }
  };

  // Real-time Firebase Authentication state structural observer loop
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, user, loading, openModal, closeModal, logoutUser }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal must be used within an AuthModalProvider");
    }
    return context;
};

export default AuthModalProvider;