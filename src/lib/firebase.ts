import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config object - replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Check if we're using placeholder values
const isUsingPlaceholders = firebaseConfig.projectId === "your-project-id" || 
                           firebaseConfig.apiKey === "your-api-key";

if (isUsingPlaceholders) {
  console.error('⚠️ Firebase Configuration Error:');
  console.error('You are using placeholder values. Please update your Firebase configuration.');
  console.error('Either:');
  console.error('1. Create a .env file with your Firebase config, or');
  console.error('2. Replace the placeholder values in src/lib/firebase.ts with your actual Firebase config');
  console.error('');
  console.error('Your Firebase config should look like this:');
  console.error('const firebaseConfig = {');
  console.error('  apiKey: "AIzaSyC...your-actual-api-key",');
  console.error('  authDomain: "your-project-name.firebaseapp.com",');
  console.error('  projectId: "your-project-name",');
  console.error('  storageBucket: "your-project-name.appspot.com",');
  console.error('  messagingSenderId: "123456789",');
  console.error('  appId: "1:123456789:web:abcdef123456"');
  console.error('};');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage (for winner photos)
export const storage = getStorage(app);

export default app; 