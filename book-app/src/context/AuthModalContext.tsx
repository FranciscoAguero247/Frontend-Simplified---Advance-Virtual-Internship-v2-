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

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout exception error caught:", err);
    }
  };

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