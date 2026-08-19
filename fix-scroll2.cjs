const fs = require('fs');

function modifyFile(path) {
  let code = fs.readFileSync(path, 'utf8');
  
  if (path.includes('ChatWidget.tsx')) {
    code = code.replace(/  useEffect\(\(\) => \{\n    if \(isTypingAdmin\) \{\n      setTimeout\(scrollToBottom, 100\);\n    \}\n  \}, \[isTypingAdmin\]\);/g, 
`  useEffect(() => {
    if (isTypingAdmin) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isTypingAdmin]);`);
  }

  if (path.includes('MessagesManagement.tsx')) {
    code = code.replace(/  useEffect\(\(\) => \{\n    if \(selectedChat\?\.isTypingCustomer\) \{\n      \n    \}\n  \}, \[selectedChat\?\.isTypingCustomer\]\);/g, 
`  useEffect(() => {
    if (selectedChat?.isTypingCustomer) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedChat?.isTypingCustomer]);`);
  }
  
  fs.writeFileSync(path, code);
}

modifyFile('src/pages/admin/MessagesManagement.tsx');
modifyFile('src/components/store/ChatWidget.tsx');
