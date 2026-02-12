
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// This function can be called from both client and server.
export function initializeFirebase() {
  if (!firebaseConfig.apiKey) {
    throw new Error(
      'Firebase API Key is missing. Please check your environment variables.'
    );
  }
  
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return getSdks(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // Rethrow the error to be caught by an Error Boundary
    throw new Error("Could not connect to Firebase services. Please check your configuration and network connection.");
  }
}

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}
