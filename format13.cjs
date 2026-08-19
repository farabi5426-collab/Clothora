const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');
code = code.replace(/createdAt: serverTimestamp\(\)\n    \}\);/g, 'createdAt: serverTimestamp()\n    };');
fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', code);

let code2 = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');
code2 = code2.replace(/createdAt: serverTimestamp\(\)\n    \}\);/g, 'createdAt: serverTimestamp()\n    };');
fs.writeFileSync('src/components/store/ChatWidget.tsx', code2);
