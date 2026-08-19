const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  // It has a double `}}` at the end or something.
  // We need to fix the MessageBubble rendering properly and the end of the file.
  if (code.endsWith('}\n}\n')) {
    code = code.substring(0, code.length - 2);
  }
  fs.writeFileSync(file, code);
}
fix('src/pages/admin/MessagesManagement.tsx');
fix('src/components/store/ChatWidget.tsx');
