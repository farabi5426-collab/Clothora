const fs = require('fs');
function fix1(file) {
  let code = fs.readFileSync(file, 'utf8');
  // I need to find `return parts.map((part, i) => { ... };` and fix it to `});`
  code = code.replace(/    \};\n  \};\n\};\nconst formatTime/g, '    }\n    return <span key={i}>{part}</span>;\n  });\n};\nconst formatTime');
  fs.writeFileSync(file, code);
}
fix1('src/pages/admin/MessagesManagement.tsx');
fix1('src/components/store/ChatWidget.tsx');
