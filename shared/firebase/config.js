import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoDummyKeyForInitialization123',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'portfolio-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'portfolio-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'portfolio-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456789'
};

// Initialize Firebase App as singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
  return (
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    !import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoDummy')
  );
};

export default app;
