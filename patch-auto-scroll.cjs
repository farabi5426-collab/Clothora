const fs = require('fs');

// --- 1. Patch ChatWidget.tsx ---
let chatCode = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

const widgetScrollSnippet = `  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };`;

const widgetNewScrollSnippet = `  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isTypingAdmin) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isTypingAdmin]);`;

chatCode = chatCode.replace(widgetScrollSnippet, widgetNewScrollSnippet);
fs.writeFileSync('src/components/store/ChatWidget.tsx', chatCode);


// --- 2. Patch MessagesManagement.tsx ---
let adminCode = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

const adminScrollSnippet = `  const selectedChat = chats.find(c => c.id === selectedChatId) || null;`;

const adminNewScrollSnippet = `  const selectedChat = chats.find(c => c.id === selectedChatId) || null;

  useEffect(() => {
    if (selectedChat?.isTypingCustomer) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [selectedChat?.isTypingCustomer]);`;

adminCode = adminCode.replace(adminScrollSnippet, adminNewScrollSnippet);
fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', adminCode);

