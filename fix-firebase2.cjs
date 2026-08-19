const fs = require('fs');

const path = 'src/lib/firebase.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace("import { getFirestore } from 'firebase/firestore';", "");
code = code.replace("import { initializeFirestore, setLogLevel } from 'firebase/firestore';", "import { getFirestore, initializeFirestore, setLogLevel } from 'firebase/firestore';");

fs.writeFileSync(path, code);
