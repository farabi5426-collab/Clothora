const fs = require('fs');

function restoreAdminFile() {
  const code = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');
  let fixedCode = code.replace(/    \};\n    return \(\) => unsubscribe\(\);\n  \}\, \[\]\);/g, '    });\n    return () => unsubscribe();\n  }, []);');
  fixedCode = fixedCode.replace(/      \};\n      \n    \};\n    return \(\) => unsubscribe\(\);\n  \}\, \[selectedChatId\]\);/g, '      });\n      \n    return () => unsubscribe();\n  }, [selectedChatId]);');
  fixedCode = fixedCode.replace(/      setMessages\(msgs\);\n      \n    \};\n    return \(\) => unsubscribe\(\);\n  \}\, \[selectedChatId\]\);/g, '      setMessages(msgs);\n    });\n    return () => unsubscribe();\n  }, [selectedChatId]);');
  fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', fixedCode);
}

function restoreChatFile() {
  const code = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');
  let fixedCode = code.replace(/      setMessages\(msgs\);\n    \};\n\n    return \(\) => \{/g, '      setMessages(msgs);\n    });\n\n    return () => {');
  fixedCode = fixedCode.replace(/      setIsTypingAdmin\(\!\!docSnap\.data\(\)\?\.isTypingAdmin\);\n    \};\n  \};\n/g, '      setIsTypingAdmin(!!docSnap.data()?.isTypingAdmin);\n    }\n  });\n');
  fs.writeFileSync('src/components/store/ChatWidget.tsx', fixedCode);
}
restoreAdminFile();
restoreChatFile();
