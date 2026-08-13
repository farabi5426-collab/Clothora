import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0228474543",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:662231425255:web:67dd1ac6e4b025ac7a0242",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgGPhYbqdDeIEigXx7YP_n19F8XX0eNMw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0228474543.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0228474543.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "662231425255"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Suppress Firestore offline warnings which can spam the console in constrained environments
setLogLevel('error');

