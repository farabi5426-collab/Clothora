const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: 'ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1',
  databaseURL: 'https://ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1.firebaseio.com'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data().title, "| Category:", doc.data().category);
  });
  process.exit(0);
}

run();
