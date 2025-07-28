import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Check if Firebase is properly configured
const isConfigured = firebaseConfig.projectId && 
                    firebaseConfig.apiKey && 
                    firebaseConfig.projectId !== "" && 
                    firebaseConfig.apiKey !== "";

if (!isConfigured) {
  console.error('⚠️ Firebase Configuration Error:');
  console.error('Firebase configuration is missing. Please set up your Firebase credentials.');
  console.error('Create a .env file with your Firebase config or add environment variables to Vercel.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage (for winner photos)
export const storage = getStorage(app);

export default app; 