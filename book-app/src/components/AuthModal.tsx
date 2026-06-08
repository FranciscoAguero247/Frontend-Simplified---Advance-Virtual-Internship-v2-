"use client";

import { useState } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useRouter } from "next/navigation";
import { FaUser, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "@/firebase/firebase";

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModal();
  const router = useRouter();
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  if (!isOpen) return null;

const handleAuthError = (err: any) => {
    console.error(err.code);
    if (err.code === "auth/invalid-email") {
    setError("Invalid email address.");
    } else if (err.code === "auth/weak-password") {
    setError("Password is too short (Must be at least 6 characters).");
    } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
    setError("User not found or incorrect credentials.");
    } else if (err.code === "auth/wrong-password") {
    setError("Incorrect password.");
    } else if (err.code === "auth/email-already-in-use") {
    setError("This email address is already registered.");
    } else {
    setError("An unexpected error occurred. Please try again.");
    }
};

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      closeModal();
      router.refresh();
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
      closeModal();
      router.push("/for-you");
    } catch (err: any) {
      setError("Guest login account configuration missing in Firebase console.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please type your email address above first.");
      return;
    }
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link forwarded to your email inbox!");
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      closeModal();
      router.refresh();
    } catch (err: any) {
      console.error("Google Auth Exception:", err.code);
      setError("Google authentication was canceled or failed.");
    }
  };



  return (
    <div className="auth__wrapper" onClick={closeModal}>
      <div className="auth" onClick={(e) => e.stopPropagation()}>
        <div className="auth__content">
          
          <div className="auth__title">
            {isLoginView ? "Log in to Summarist" : "Sign up to Summarist"}
          </div>

          {error && <div className="auth__error-message" style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</div>}
          {message && <div className="auth__success-message" style={{ color: "green", textAlign: "center", marginBottom: "10px" }}>{message}</div>}

          
          <button className="btn guest__btn--wrapper" onClick={handleGuestLogin}>
            <figure className="google__icon--mask guest__icon--mask">
              <FaUser />
            </figure>
            <div>Login as a Guest</div>
          </button>

          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>

          <button className="btn google__btn--wrapper" onClick={handleGoogleLogin}>
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

        {isLoginView && (
          <div className="auth__forgot--password" onClick={handleForgotPassword} style={{ cursor: "pointer" }}>Forgot your password?</div>
        )}

        <button 
          className="auth__switch--btn" 
          onClick={() => { setIsLoginView(!isLoginView); setError(""); setMessage(""); }}
        >
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
        </button>

        <div className="auth__close--btn" onClick={closeModal}>
          <FaTimes />
        </div>
      </div>
    </div>
  );
}