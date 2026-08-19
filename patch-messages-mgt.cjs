const fs = require('fs');

let adminCode = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

// 1. Add reaction emojis constant and imports
adminCode = adminCode.replace(
  "import { Send, User } from 'lucide-react';",
  "import { Send, User } from 'lucide-react';\nimport { useLongPress } from '../../lib/useLongPress';\n\nconst REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];"
);

// 2. Update ChatMessage and ChatSession interface
adminCode = adminCode.replace(
  "unreadAdmin: number;\n}",
  "unreadAdmin: number;\n  isTypingCustomer?: boolean;\n}"
);

adminCode = adminCode.replace(
  "createdAt: any;\n}",
  "createdAt: any;\n  reactions?: string[];\n}"
);


// 3. Add typing state
adminCode = adminCode.replace(
  "const messagesEndRef = useRef<HTMLDivElement>(null);",
  "const messagesEndRef = useRef<HTMLDivElement>(null);\n  const [activeReactionMsg, setActiveReactionMsg] = useState<string | null>(null);\n  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);"
);

// 4. Add handleInput for typing status
adminCode = adminCode.replace(
  "const sendMessage = async (e: React.FormEvent) => {",
  `const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!selectedChat) return;
    
    updateDoc(doc(db, 'chats', selectedChat.id), { isTypingAdmin: true }).catch(console.error);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      updateDoc(doc(db, 'chats', selectedChat.id), { isTypingAdmin: false }).catch(console.error);
    }, 1500);
  };
  
  const handleReaction = async (msgId: string, emoji: string) => {
    try {
      if (!selectedChat) return;
      const msgRef = doc(db, 'chats', selectedChat.id, 'messages', msgId);
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
  };

  const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
    const isAdmin = msg.sender === 'admin';
    const longPressEvent = useLongPress(() => setActiveReactionMsg(msg.id), () => {}, { delay: 400 });
    
    return (
      <div className={\`flex gap-3 \${isAdmin ? 'justify-end' : 'justify-start'}\`}>
        {!isAdmin && (
          <div className="w-8 h-8 bg-surface-container-low flex-shrink-0 flex items-center justify-center text-on-surface font-black text-sm uppercase">
            {selectedChat?.customerName?.charAt(0) || 'C'}
          </div>
        )}
        <div className={\`flex flex-col \${isAdmin ? 'items-end' : 'items-start'} max-w-[85%] relative\`}>
          {activeReactionMsg === msg.id && (
            <div className={\`absolute z-50 -top-12 \${isAdmin ? 'right-0' : 'left-0'} bg-surface-container-highest border border-outline-variant shadow-xl rounded-full px-3 py-2 flex gap-2 animate-bounce-in\`}>
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-xl hover:scale-125 transition-transform">{emoji}</button>
              ))}
            </div>
          )}
          <div {...longPressEvent} className={\`p-4 text-[13px] leading-relaxed rounded-theme shadow-sm cursor-pointer select-none \${isAdmin ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'}\`}>
            {renderMessageWithLinks(msg.text)}
          </div>
          {msg.reactions && msg.reactions.length > 0 && (
            <div className={\`absolute -bottom-3 \${isAdmin ? 'left-0' : 'right-0'} bg-surface border border-outline-variant rounded-full px-1.5 py-0.5 text-xs flex gap-1 shadow-sm\`}>
              {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
            </div>
          )}
          <div className={\`text-[10px] text-on-surface-variant mt-1.5 flex items-center gap-1.5 \${isAdmin ? 'justify-end w-full' : 'w-full'}\`}>
            {formatTime(msg.createdAt)}
            {isAdmin && <span className="text-primary text-xs">✓✓</span>}
          </div>
        </div>
      </div>
    );
  };

  const sendMessage = async (e: React.FormEvent) => {`
);

// 6. Fix input handler and map
adminCode = adminCode.replace(
  "onChange={(e) => setInputText(e.target.value)}",
  "onChange={handleTyping}"
);

adminCode = adminCode.replace(
  /\{messages\.map\(\(msg\) => \([\s\S]*?<\/div>\s*<\/div>\s*\)\)\}/,
  "{messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}"
);


// Clear typing when sending
adminCode = adminCode.replace(
  "const textToSend = inputText.trim();",
  "const textToSend = inputText.trim();\n    updateDoc(doc(db, 'chats', selectedChat.id), { isTypingAdmin: false }).catch(console.error);\n    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);"
);


// Close reaction picker on click outside
adminCode = adminCode.replace(
  '<div className="flex-1 overflow-y-auto p-6 bg-surface flex flex-col gap-6">',
  '<div className="flex-1 overflow-y-auto p-6 bg-surface flex flex-col gap-6" onClick={(e) => { if (activeReactionMsg) { e.stopPropagation(); setActiveReactionMsg(null); } }}>'
);

// Add typing indicator inside messages body
adminCode = adminCode.replace(
  "<div ref={messagesEndRef} />",
  `<div ref={messagesEndRef} />
                  {selectedChat?.isTypingCustomer && (
                    <div className="flex gap-3 justify-start mb-2">
                      <div className="w-8 h-8 bg-surface-container-low flex-shrink-0 flex items-center justify-center text-on-surface font-black text-sm uppercase">
                        {selectedChat?.customerName?.charAt(0) || 'C'}
                      </div>
                      <div className="bg-surface-container-low p-4 py-5 rounded-theme flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                        <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                        <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                      </div>
                    </div>
                  )}`
);

fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', adminCode);
