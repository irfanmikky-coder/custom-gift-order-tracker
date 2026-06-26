import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_q5YRp4N46i6qUbU6xmdZI5eOReQD4xM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "customer-gift-order-tracker.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "customer-gift-order-tracker",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "customer-gift-order-tracker.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "388099545366",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:388099545366:web:34921beb2c061052de5837"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
