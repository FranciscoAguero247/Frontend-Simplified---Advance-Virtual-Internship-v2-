"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useAuthModal } from "@/context/AuthModalContext";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import AuthModal from "@/components/AuthModal";

export default function SettingsPage() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useAuthModal();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setIsPremium(false); 
        closeModal();
      } else {
        setUserEmail(null);
        setIsPremium(false);
        openModal();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubscriptionAction = () => {
    if (!userEmail) {
      openModal();
      return;
    }

    if (isPremium) {
      console.log("Redirecting to customer billing portal...");
    } else {
      router.push("/choose-plan");
    }
  };

  if (loading) {
    return (
      <div className="wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="settings__text">Loading parameters...</div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <SearchBar />

      <Sidebar />

      <div className="container">
        <div className="row">
          <div className="section__title page__title">Settings</div>

          {userEmail ? (
            <>
              <div className="setting__content">
                <div className="settings__sub--title">Your Subscription plan</div>
                <div className="settings__text">
                  {isPremium ? "Premium" : "Basic"}
                </div>
                <button 
                  className="btn settings__upgrade--btn" 
                  onClick={handleSubscriptionAction}
                >
                  {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
                </button>
              </div>

              <div className="setting__content">
                <div className="settings__sub--title">Email</div>
                <div className="settings__text">{userEmail}</div>
              </div>
            </>
          ) : (
            <div className="setting__content">
              <div className="settings__text" style={{ marginBottom: "1rem" }}>
                Log in to view and manage your account options.
              </div>
              <button 
                className="btn settings__upgrade--btn" 
                onClick={openModal}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

    <AuthModal />
    </div>
  );
}