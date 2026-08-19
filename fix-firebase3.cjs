const fs = require('fs');

const path = 'src/lib/firebase.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /\{ experimentalForceLongPolling: true \}/g,
  "{}"
);

fs.writeFileSync(path, code);
