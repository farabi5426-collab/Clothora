const fs = require('fs');

// --- 1. CSS ANIMATIONS ---
let cssCode = fs.readFileSync('src/index.css', 'utf8');
if (!cssCode.includes('@keyframes pop-in')) {
  cssCode += `
@keyframes dance {
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  25% { transform: translateY(-4px) scale(1.1) rotate(-8deg); }
  50% { transform: translateY(0) scale(1) rotate(0deg); }
  75% { transform: translateY(-2px) scale(1.1) rotate(8deg); }
}
.animate-dance {
  animation: dance 1.5s infinite ease-in-out;
}
.animate-dance:nth-child(1) { animation-delay: 0s; }
.animate-dance:nth-child(2) { animation-delay: 0.1s; }
.animate-dance:nth-child(3) { animation-delay: 0.2s; }
.animate-dance:nth-child(4) { animation-delay: 0.3s; }
.animate-dance:nth-child(5) { animation-delay: 0.4s; }
.animate-dance:nth-child(6) { animation-delay: 0.5s; }

@keyframes pop-in {
  0% { transform: scale(0) translateY(15px) rotate(-15deg); opacity: 0; }
  60% { transform: scale(1.4) translateY(-5px) rotate(10deg); opacity: 1; }
  100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; }
}
.animate-pop-in {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
`;
  fs.writeFileSync('src/index.css', cssCode);
}

// --- 2. ChatWidget.tsx Patch ---
let chatCode = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

// Interface
chatCode = chatCode.replace(
  "reactions?: string[];",
  "reactions?: Record<string, string>;"
);

// handleReaction
const chatReactionOld = `  const handleReaction = async (msgId: string, emoji: string) => {
    try {
      const msgRef = doc(db, 'chats', chatId, 'messages', msgId);
      const msg = messages.find(m => m.id === msgId);
      if (!msg) return;
      const currentReactions = msg.reactions || [];
      const newReactions = currentReactions.includes(emoji) 
        ? currentReactions.filter(r => r !== emoji)
        : [...currentReactions, emoji];
      await updateDoc(msgRef, { reactions: newReactions });
      setActiveReactionMsg(null);
    } catch (error) {
      console.error(error);
    }
  };`;
const chatReactionNew = `  const handleReaction = async (msgId: string, emoji: string) => {
    try {
      const msgRef = doc(db, 'chats', chatId, 'messages', msgId);
      const msg = messages.find(m => m.id === msgId);
      if (!msg) return;
      const currentReactions = msg.reactions || {};
      const newReactions = { ...currentReactions };
      if (newReactions['customer'] === emoji) {
        delete newReactions['customer'];
      } else {
        newReactions['customer'] = emoji;
      }
      await updateDoc(msgRef, { reactions: newReactions });
      setActiveReactionMsg(null);
    } catch (error) {
      console.error(error);
    }
  };`;
chatCode = chatCode.replace(chatReactionOld, chatReactionNew);

// UI Picker
chatCode = chatCode.replace(
  `<button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-xl hover:scale-125 transition-transform">{emoji}</button>`,
  `<button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-[22px] hover:scale-125 transition-transform animate-dance inline-block origin-bottom">{emoji}</button>`
);

// UI Render
const chatRenderOld = `{msg.reactions && msg.reactions.length > 0 && (
            <div className={\`absolute -bottom-3 \${isMe ? 'left-0' : 'right-0'} bg-surface-container-low border border-outline-variant rounded-full px-1.5 py-0.5 text-xs flex gap-1 shadow-sm\`}>
              {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
            </div>
          )}`;
const chatRenderNew = `{msg.reactions && Object.keys(msg.reactions).length > 0 && (
            <div className={\`absolute -bottom-3 \${isMe ? 'left-0' : 'right-0'} bg-surface-container-low border border-outline-variant rounded-full px-1.5 py-0.5 text-[14px] flex gap-1 shadow-sm min-h-[24px] items-center\`}>
              {Object.values(msg.reactions).map((r, i) => <span key={r + i} className="animate-pop-in inline-block origin-bottom">{r}</span>)}
            </div>
          )}`;
chatCode = chatCode.replace(chatRenderOld, chatRenderNew);

fs.writeFileSync('src/components/store/ChatWidget.tsx', chatCode);


// --- 3. MessagesManagement.tsx Patch ---
let adminCode = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

// Interface
adminCode = adminCode.replace(
  "reactions?: string[];",
  "reactions?: Record<string, string>;"
);

// handleReaction
const adminReactionOld = `  const handleReaction = async (msgId: string, emoji: string) => {
    try {
      if (!selectedChatId) return;
      const msgRef = doc(db, 'chats', selectedChatId, 'messages', msgId);
      const msg = messages.find(m => m.id === msgId);
      if (!msg) return;
      const currentReactions = msg.reactions || [];
      const newReactions = currentReactions.includes(emoji) 
        ? currentReactions.filter(r => r !== emoji)
        : [...currentReactions, emoji];
      await updateDoc(msgRef, { reactions: newReactions });
      setActiveReactionMsg(null);
    } catch (error) {
      console.error(error);
    }
  };`;
const adminReactionNew = `  const handleReaction = async (msgId: string, emoji: string) => {
    try {
      if (!selectedChatId) return;
      const msgRef = doc(db, 'chats', selectedChatId, 'messages', msgId);
      const msg = messages.find(m => m.id === msgId);
      if (!msg) return;
      const currentReactions = msg.reactions || {};
      const newReactions = { ...currentReactions };
      if (newReactions['admin'] === emoji) {
        delete newReactions['admin'];
      } else {
        newReactions['admin'] = emoji;
      }
      await updateDoc(msgRef, { reactions: newReactions });
      setActiveReactionMsg(null);
    } catch (error) {
      console.error(error);
    }
  };`;
adminCode = adminCode.replace(adminReactionOld, adminReactionNew);

// UI Picker
adminCode = adminCode.replace(
  `<button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-xl hover:scale-125 transition-transform">{emoji}</button>`,
  `<button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-[22px] hover:scale-125 transition-transform animate-dance inline-block origin-bottom">{emoji}</button>`
);

// UI Render
const adminRenderOld = `{msg.reactions && msg.reactions.length > 0 && (
            <div className={\`absolute -bottom-3 \${isAdmin ? 'left-0' : 'right-0'} bg-surface border border-outline-variant rounded-full px-1.5 py-0.5 text-xs flex gap-1 shadow-sm\`}>
              {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
            </div>
          )}`;
const adminRenderNew = `{msg.reactions && Object.keys(msg.reactions).length > 0 && (
            <div className={\`absolute -bottom-3 \${isAdmin ? 'left-0' : 'right-0'} bg-surface border border-outline-variant rounded-full px-1.5 py-0.5 text-[14px] flex gap-1 shadow-sm min-h-[24px] items-center\`}>
              {Object.values(msg.reactions).map((r, i) => <span key={r + i} className="animate-pop-in inline-block origin-bottom">{r}</span>)}
            </div>
          )}`;
adminCode = adminCode.replace(adminRenderOld, adminRenderNew);

fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', adminCode);

