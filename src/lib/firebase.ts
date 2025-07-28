import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config object - replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if we're using empty values
const isUsingEmptyValues = !firebaseConfig.projectId || 
                          !firebaseConfig.apiKey ||
                          firebaseConfig.projectId === "" || 
                          firebaseConfig.apiKey === "";

if (isUsingEmptyValues) {
  console.error('⚠️ Firebase Configuration Error:');
  console.error('Firebase configuration is missing. Please set up your Firebase credentials.');
  console.error('Either:');
  console.error('1. Create a .env file with your Firebase config, or');
  console.error('2. Add environment variables to your Vercel deployment');
  console.error('');
  console.error('Your .env file should contain:');
  console.error('VITE_FIREBASE_API_KEY=your-actual-api-key');
  console.error('VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
  console.error('VITE_FIREBASE_PROJECT_ID=your-project-id');
  console.error('VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
  console.error('VITE_FIREBASE_MESSAGING_SENDER_ID=123456789');
  console.error('VITE_FIREBASE_APP_ID=your-app-id');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage (for winner photos)
export const storage = getStorage(app);

export default app; 