const fs = require('fs');

function formatFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.endsWith('}\n}\n')) {
    code = code.substring(0, code.length - 2);
    fs.writeFileSync(file, code);
  }
}
formatFile('src/components/store/ChatWidget.tsx');
formatFile('src/pages/admin/MessagesManagement.tsx');
