import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoc6GE9OMks5KNQbK_fCorTjzPEj7TZYo",
  authDomain: "summarist-bc329.firebaseapp.com",
  projectId: "summarist-bc329",
  storageBucket: "summarist-bc329.firebasestorage.app",
  messagingSenderId: "1011770563688",
  appId: "1:1011770563688:web:740c0d266a85489b1eafdd"
};

// Initialize Firebase for Server-Side Rendering compatibility
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
};