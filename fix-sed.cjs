const fs = require('fs');

function addMemoEnd(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/    \);\n  \};\nexport default/g, '    );\n  });\nexport default');
  
  if (code.includes('  };\nexport default')) {
    code = code.replace('  };\nexport default', '  });\nexport default');
  }
  
  fs.writeFileSync(file, code);
}
addMemoEnd('src/components/store/ChatWidget.tsx');
addMemoEnd('src/pages/admin/MessagesManagement.tsx');
