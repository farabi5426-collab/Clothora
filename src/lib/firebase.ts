import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDgGPhYbqdDeIEigXx7YP_n19F8XX0eNMw",
  authDomain: "gen-lang-client-0228474543.firebaseapp.com",
  projectId: "gen-lang-client-0228474543",
  storageBucket: "gen-lang-client-0228474543.firebasestorage.app",
  messagingSenderId: "662231425255",
  appId: "1:662231425255:web:67dd1ac6e4b025ac7a0242"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Suppress Firestore offline warnings which can spam the console in constrained environments
setLogLevel('error');

