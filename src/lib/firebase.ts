import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';

const getEnv = (key: string, fallback: string) => {
  // Try to get from import.meta.env (Vite)
  // @ts-ignore
  const val = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env[key] : undefined;
  if (val && val !== 'undefined' && val !== 'null' && val !== '') {
    return val;
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', "AIzaSyDgGPhYbqdDeIEigXx7YP_n19F8XX0eNMw"),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', "gen-lang-client-0228474543.firebaseapp.com"),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', "gen-lang-client-0228474543"),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', "gen-lang-client-0228474543.firebasestorage.app"),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', "662231425255"),
  appId: getEnv('VITE_FIREBASE_APP_ID', "1:662231425255:web:67dd1ac6e4b025ac7a0242")
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, "ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1");
export const googleProvider = new GoogleAuthProvider();

// Suppress Firestore offline warnings which can spam the console in constrained environments
setLogLevel('silent');
