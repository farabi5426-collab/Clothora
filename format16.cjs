const fs = require('fs');
let code = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');
code = code.replace(/    return \(\) => \{\n      unsubscribeChat\(\);\n      unsubscribeMessages\(\);\n    \}\);\n  \}, \[isOpen, chatId\]\);/g, '    return () => {\n      unsubscribeChat();\n      unsubscribeMessages();\n    };\n  }, [isOpen, chatId]);');
fs.writeFileSync('src/components/store/ChatWidget.tsx', code);
