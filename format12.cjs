const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');
code = code.replace(/toast\.error\('Failed to update chat metadata'\);\n      \};/g, 'toast.error(\'Failed to update chat metadata\');\n      });');
code = code.replace(/toast\.error\('Failed to send message'\);\n    \};/g, 'toast.error(\'Failed to send message\');\n    });');
fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', code);

let code2 = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');
code2 = code2.replace(/toast\.error\('Failed to update chat metadata'\);\n      \};/g, 'toast.error(\'Failed to update chat metadata\');\n      });');
code2 = code2.replace(/toast\.error\('Failed to send message'\);\n    \};/g, 'toast.error(\'Failed to send message\');\n    });');
fs.writeFileSync('src/components/store/ChatWidget.tsx', code2);
