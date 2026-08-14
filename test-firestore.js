import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = initializeApp({
  projectId: 'some-non-existent-project-12345'
});
const db = getFirestore(app);

console.log("Calling getDoc...");
getDoc(doc(db, 'users', '123'))
  .then(() => console.log("Success"))
  .catch(e => console.log("Caught:", e.message));

setTimeout(() => {
  console.log("5 seconds passed, did it resolve?");
  process.exit(0);
}, 5000);
