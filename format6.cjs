const fs = require('fs');
function fix1(file) {
  let code = fs.readFileSync(file, 'utf8');
  // I ruined `return parts.map((part, i) => { ... });`
  code = code.replace(/    \};\n  \};\n/g, '    });\n  };\n');
  
  // also the main component has `handleTyping`
  code = code.replace(/    \}, 1500\);\n  \};\n/g, '    }, 1500);\n  };\n');
  
  fs.writeFileSync(file, code);
}
fix1('src/pages/admin/MessagesManagement.tsx');
fix1('src/components/store/ChatWidget.tsx');
