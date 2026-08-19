const fs = require('fs');

const path = 'src/lib/firebase.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /export const db = initializeFirestore\(app, \{ experimentalForceLongPolling: true \}, "ai-studio-clothora-[^"]+"\);/g,
  `
import { getFirestore } from 'firebase/firestore';
let dbInstance;
try {
  dbInstance = initializeFirestore(app, { experimentalForceLongPolling: true }, "ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1");
} catch (e) {
  dbInstance = getFirestore(app, "ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1");
}
export const db = dbInstance;
`
);

fs.writeFileSync(path, code);
