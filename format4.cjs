const fs = require('fs');
function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/    \};\n\nexport default/g, '    });\n\nexport default');
  code = code.replace(/    \};\nexport default/g, '    });\nexport default');
  fs.writeFileSync(file, code);
}
fix('src/components/store/ChatWidget.tsx');
fix('src/pages/admin/MessagesManagement.tsx');
