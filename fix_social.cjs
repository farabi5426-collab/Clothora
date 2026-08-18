const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/SocialLinksManagement.tsx', 'utf8');

code = code.replace(/\\`/g, '`');
fs.writeFileSync('src/pages/admin/SocialLinksManagement.tsx', code);
console.log('Fixed');
