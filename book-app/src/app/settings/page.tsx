"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore"; 
import { auth, db } from "@/firebase/firebase";
import { useAuthModal } from "@/context/AuthModalContext";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import AuthModal from "@/components/AuthModal";
import { SettingsSkeleton } from "@/components/Skeletons";

type SubscriptionPlan = "basic" | "premium" | "premium-plus";

export default function SettingsPage() {
  const router = useRouter();
  const { openModal, closeModal } = useAuthModal();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>("basic");

  useEffect(() => {
    let unsubscribeFromSubscriptions: (() => void) | null = null;

    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        closeModal();

        const subscriptionsRef = collection(db, "customers", user.uid, "subscriptions");
        const q = query(subscriptionsRef, where("status", "in", ["active", "trialing"]));

        unsubscribeFromSubscriptions = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            const role = docData.role; 
            const priceId = docData.items?.[0]?.price?.id;
            const STRIPE_PREMIUM_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID; 
            const STRIPE_PREMIUM_PLUS_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLUS_PRICE_ID;

            if (role === "premium-plus" || priceId === STRIPE_PREMIUM_PLUS_PRICE_ID) {
              setSubscriptionPlan("premium-plus");
            } else if (role === "premium" || priceId === STRIPE_PREMIUM_PRICE_ID) {
              setSubscriptionPlan("premium");
            } else {
              setSubscriptionPlan("premium");
            }
          } else {
            setSubscriptionPlan("basic");
          }
          setLoading(false);
        }, (error) => {
          console.error("Error watching subscription collection:", error);
          setSubscriptionPlan("basic");
          setLoading(false);
        });

      } else {
        setUserEmail(null);
        setSubscriptionPlan("basic");
        setLoading(false);
        
        if (unsubscribeFromSubscriptions) {
          unsubscribeFromSubscriptions();
          unsubscribeFromSubscriptions = null;
        }
      }
    });

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromSubscriptions) unsubscribeFromSubscriptions();
    };
  }, [closeModal]);

  const handleUpgradeRedirect = () => {
    router.push("/choose-plan");
  };

  const getPlanDisplayName = (plan: SubscriptionPlan) => {
    if (plan === "premium-plus") return "Premium-Plus";
    if (plan === "premium") return "Premium";
    return "Basic";
  };

  return (
  <div className="wrapper">
    <SearchBar />
    <Sidebar isMobileMenuOpen={false} onToggleMobileMenu={() => {}} />

    <div className="container">
      <div className="row">
        <div className="section__title page__title">Settings</div>
        
        {loading ? (
          <SettingsSkeleton />
        ) : userEmail ? (
          <>
            <div className="setting__content">
              <div className="settings__sub--title">Your Subscription plan</div>
              <div className="settings__text">
                {getPlanDisplayName(subscriptionPlan)}
              </div>
              
              {subscriptionPlan === "basic" && (
                <button 
                  className="btn settings__upgrade--btn" 
                  onClick={handleUpgradeRedirect}
                >
                  Upgrade to Premium
                </button>
              )}
            </div>

            <div className="setting__content">
              <div className="settings__sub--title">Email</div>
              <div className="settings__text">{userEmail}</div>
            </div>
          </>
        ) : (
          <div className="settings__login--wrapper">
            <Image 
              src="/assets/login.png" 
              alt="login" 
              width={1033} 
              height={712} 
              priority
              style={{ color: "transparent" }}
            />
            <div className="settings__login--text">
              Log in to your account to see your details.
            </div>
            <button className="btn settings__login--btn" onClick={openModal}>
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