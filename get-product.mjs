import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDgGPhYbqdDeIEigXx7YP_n19F8XX0eNMw",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0228474543.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0228474543",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0228474543.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "662231425255",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:662231425255:web:67dd1ac6e4b025ac7a0242"
};

const appInstance = initializeApp(firebaseConfig);
const db = getFirestore(appInstance, "ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1");

async function run() {
  const q = collection(db, 'products');
  const snap = await getDocs(q);
  const products = [];
  snap.forEach(d => products.push({id: d.id, ...d.data()}));
  if (products.length > 0) {
      console.log("ID:", products[0].id);
      console.log("Image URL:", products[0].imageUrl);
      console.log("Image URLs:", products[0].imageUrls);
  } else {
      console.log("No products found.");
  }
}
run().catch(console.error);
