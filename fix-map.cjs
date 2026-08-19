const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // The map in renderMessageWithLinks:
  //   return parts.map((part, i) => {
  //     if (part.match(urlRegex)) { ... }
  //     return <span key={i}>{part}</span>;
  //   });
  
  code = code.replace(/    \};\n  \};\n/g, '    });\n  };\n'); // Wait, earlier I did this but I replaced `});` with `};`!
  code = code.replace(/    \}\);\n  \};\n/g, '    });\n};\n'); 
  
  fs.writeFileSync(file, code);
}
fix('src/pages/admin/MessagesManagement.tsx');
fix('src/components/store/ChatWidget.tsx');
