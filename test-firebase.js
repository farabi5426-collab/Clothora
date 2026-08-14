import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({
  apiKey: undefined,
  projectId: undefined,
});
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "test@test.com", "password")
  .then(() => console.log("Success"))
  .catch(e => console.log("Caught:", e.message));
