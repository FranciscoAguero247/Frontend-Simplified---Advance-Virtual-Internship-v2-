"use client";

import { useState } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import { FaUser, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModal();
  const [isLoginView, setIsLoginView] = useState(true); // Toggles between Login and Register views
  
  // Input Form Trackers
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If the global state context is set to hidden, don't render anything on screen
  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      console.log("Submitting login credentials for:", email);
      // Firebase login connection will map right here next
    } else {
      console.log("Registering new user profile under:", email);
      // Firebase registration logic goes here
    }
  };

  const handleGuestLogin = () => {
    console.log("Triggering Guest Login sequence...");
    // Hardcoded credentials logic from internship specs goes here
  };

  return (
    <div className="auth__overlay">
      <div className="auth" onClick={(e) => e.stopPropagation()}>
        <div className="auth__content">
          
          <div className="auth__title">
            {isLoginView ? "Log in to Summarist" : "Sign up to Summarist"}
          </div>

          {/* 1. Guest Authentication Access Button */}
          <button className="btn guest__btn--wrapper" onClick={handleGuestLogin}>
            <figure className="google__icon--mask guest__icon--mask">
              <FaUser />
            </figure>
            <div>Login as a Guest</div>
          </button>

          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>

          {/* 2. Google Authentication Button */}
          <button className="btn google__btn--wrapper">
            <figure className="google__icon--mask">
              <Image 
                alt="google" 
                src="/assets/google.png" // Clean asset path reference
                width={20} 
                height={20} 
              />
            </figure>
            <div>Login with Google</div>
          </button>

          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>

          {/* 3. Main Form Context Area */}
          <form className="auth__main--form" onSubmit={handleAuthSubmit}>
            <input 
              className="auth__main--input" 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              className="auth__main--input" 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="btn" type="submit">
              <span>{isLoginView ? "Login" : "Sign Up"}</span>
            </button>
          </form>

        </div>

        {/* 4. Secondary Action Interactivity Elements */}
        {isLoginView && (
          <div className="auth__forgot--password">Forgot your password?</div>
        )}

        <button 
          className="auth__switch--btn" 
          onClick={() => setIsLoginView(!isLoginView)}
        >
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
        </button>

        {/* 5. Closing Modal Toggle Anchor Trigger */}
        <div className="auth__close--btn" onClick={closeModal}>
          <FaTimes />
        </div>

      </div>
    </div>
  );
}