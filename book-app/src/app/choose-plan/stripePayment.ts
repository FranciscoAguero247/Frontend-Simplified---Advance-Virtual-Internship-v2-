import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot 
} from "firebase/firestore";

export async function getCheckoutUrl(firebaseApp: any, priceId: string): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication failure: User must be logged in to initialize a payment sequence.");
  }

  const checkoutSessionsRef = collection(db, "customers", user.uid, "checkout_sessions");

  const docRef = await addDoc(checkoutSessionsRef, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data();
      if (data?.error) {
        unsubscribe();
        reject(new Error(`Stripe Payment Session processing anomaly: ${data.error.message}`));
      }
      if (data?.url) {
        unsubscribe();
        resolve(data.url);
      }
    });
  });
}