import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// In a real applet environment, we fetch this config from firebase-applet-config.json
// Note: AI Studio injects this file automatically when Firebase is set up
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Suppress Firestore offline warnings which can spam the console in constrained environments
setLogLevel('error');

