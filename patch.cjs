const fs = require('fs');

function patchChatWidget() {
  let code = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

  // 1. Remove auto-scroll on every snapshot
  const originalSnapshot = `setMessages(msgs);
      setTimeout(scrollToBottom, 100);
    });`;
  if (code.includes(originalSnapshot)) {
    code = code.replace(originalSnapshot, `setMessages(msgs);\n    });`);
    console.log("ChatWidget: Patched snapshot scroll.");
  } else {
    console.log("ChatWidget: Snapshot scroll not found, trying regex...");
    code = code.replace(/setMessages\(msgs\);\s*setTimeout\(scrollToBottom,\s*100\);\s*}\);/g, 'setMessages(msgs);\n    });');
  }

  // Add scroll on messages.length change
  const depInsert = `const chatId = user ? user.uid : getChatId();`;
  if (code.includes(depInsert)) {
    code = code.replace(
      depInsert,
      `${depInsert}\n\n  useEffect(() => {\n    scrollToBottom();\n  }, [messages.length]);`
    );
    console.log("ChatWidget: Added messages.length effect.");
  }

  // 2. Extract MessageBubble
  const bubbleStart = code.indexOf('const MessageBubble = ({ msg }: { msg: ChatMessage }) => {');
  const bubbleEnd = code.indexOf('return (', bubbleStart);
  
  if (bubbleStart !== -1 && bubbleEnd !== -1) {
    let bubbleCode = code.substring(bubbleStart, bubbleEnd);
    code = code.substring(0, bubbleStart) + code.substring(bubbleEnd);
    
    bubbleCode = bubbleCode.replace(
      'const MessageBubble = ({ msg }: { msg: ChatMessage }) => {',
      'const MessageBubble = React.memo(({ msg, activeReactionMsg, setActiveReactionMsg, handleReaction, setReplyingTo }: any) => {'
    );
    
    code = code.replace('export default function ChatWidget() {', bubbleCode + '\nexport default function ChatWidget() {');
    
    code = code.replace(
      '{messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}',
      '{messages.map((msg) => <MessageBubble key={msg.id} msg={msg} activeReactionMsg={activeReactionMsg} setActiveReactionMsg={setActiveReactionMsg} handleReaction={handleReaction} setReplyingTo={setReplyingTo} />)}'
    );
    console.log("ChatWidget: Extracted MessageBubble.");
  }

  fs.writeFileSync('src/components/store/ChatWidget.tsx', code);
}

function patchMessagesManagement() {
  let code = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

  // 1. Remove auto-scroll on every snapshot
  if (code.includes('setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: \'smooth\' }), 100);')) {
    code = code.replace(
      /setTimeout\(\(\)\s*=>\s*messagesEndRef\.current\?\.scrollIntoView\(\{ behavior:\s*'smooth'\s*\}\),\s*100\);/g,
      ''
    );
    console.log("Admin: Patched snapshot scroll.");
  }

  // Add scroll on messages.length change
  const depInsert = `const selectedChat = chats.find(c => c.id === selectedChatId) || null;`;
  if (code.includes(depInsert)) {
    if (!code.includes('messagesEndRef.current?.scrollIntoView({ behavior: \'smooth\' });\n  }, [messages.length]);')) {
      code = code.replace(
        depInsert,
        `${depInsert}\n\n  useEffect(() => {\n    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });\n  }, [messages.length]);`
      );
      console.log("Admin: Added messages.length effect.");
    }
  }

  // 2. Extract MessageBubble
  const bubbleStart = code.indexOf('const MessageBubble = ({ msg }: { msg: ChatMessage }) => {');
  const bubbleEnd = code.indexOf('return (', bubbleStart);
  
  if (bubbleStart !== -1 && bubbleEnd !== -1) {
    let bubbleCode = code.substring(bubbleStart, bubbleEnd);
    code = code.substring(0, bubbleStart) + code.substring(bubbleEnd);
    
    bubbleCode = bubbleCode.replace(
      'const MessageBubble = ({ msg }: { msg: ChatMessage }) => {',
      'const MessageBubble = React.memo(({ msg, activeReactionMsg, setActiveReactionMsg, handleReaction, setReplyingTo, selectedChat }: any) => {'
    );
    
    code = code.replace('export default function MessagesManagement() {', bubbleCode + '\nexport default function MessagesManagement() {');
    
    code = code.replace(
      '{messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}',
      '{messages.map(msg => <MessageBubble key={msg.id} msg={msg} activeReactionMsg={activeReactionMsg} setActiveReactionMsg={setActiveReactionMsg} handleReaction={handleReaction} setReplyingTo={setReplyingTo} selectedChat={selectedChat} />)}'
    );
    console.log("Admin: Extracted MessageBubble.");
  }

  fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', code);
}

patchChatWidget();
patchMessagesManagement();
