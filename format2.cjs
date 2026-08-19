const fs = require('fs');

function addMemoEnd(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/  };\nexport default/g, '  });\nexport default');
  fs.writeFileSync(file, code);
}
addMemoEnd('src/components/store/ChatWidget.tsx');
addMemoEnd('src/pages/admin/MessagesManagement.tsx');
