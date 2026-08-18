const fs = require('fs');
let code = fs.readFileSync('src/lib/printInvoice.ts', 'utf8');

code = code.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/lib/printInvoice.ts', code);
console.log("Print fixed");
