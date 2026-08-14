import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({
  apiKey: "",
  projectId: "",
});
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "test@test.com", "password")
  .then(() => console.log("Success"))
  .catch(e => console.log("Caught:", e.message));

setTimeout(() => {
  console.log("5 seconds passed, did it resolve?");
  process.exit(0);
}, 5000);
