const fs = require('fs');
function fix1(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/    \}\);\n    \n    const handleReaction = async/g, '    };\n    \n    const handleReaction = async');
  fs.writeFileSync(file, code);
}
fix1('src/pages/admin/MessagesManagement.tsx');

function fix2(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/    \}\);\n    \n  const handleReaction = async/g, '    };\n    \n  const handleReaction = async');
  fs.writeFileSync(file, code);
}
fix2('src/components/store/ChatWidget.tsx');

