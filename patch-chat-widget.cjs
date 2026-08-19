const fs = require('fs');

let widgetCode = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

// 1. Add reaction emojis constant and imports
widgetCode = widgetCode.replace(
  "import { Send, X, MessageSquareText, MessageSquare } from 'lucide-react';",
  "import { Send, X, MessageSquareText, MessageSquare } from 'lucide-react';\nimport { useLongPress } from '../../lib/useLongPress';\n\nconst REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];"
);

// 2. Update ChatMessage interface
widgetCode = widgetCode.replace(
  "createdAt: any;\n}",
  "createdAt: any;\n  reactions?: string[];\n}"
);

// 3. Add typing state
widgetCode = widgetCode.replace(
  "const [inputText, setInputText] = useState('');",
  "const [inputText, setInputText] = useState('');\n  const [isTypingAdmin, setIsTypingAdmin] = useState(false);\n  const [activeReactionMsg, setActiveReactionMsg] = useState<string | null>(null);\n  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);"
);

// 4. Update onSnapshot for chats to listen to isTypingAdmin
widgetCode = widgetCode.replace(
  "if (docSnap.data().unreadCustomer > 0) {",
  "setIsTypingAdmin(!!docSnap.data()?.isTypingAdmin);\n        if (docSnap.data().unreadCustomer > 0) {"
);

// 5. Add handleInput for typing status
widgetCode = widgetCode.replace(
  "const sendMessage = async (e: React.FormEvent) => {",
  `const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!isRegistered) return;
    
    updateDoc(doc(db, 'chats', chatId), { isTypingCustomer: true }).catch(console.error);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      updateDoc(doc(db, 'chats', chatId), { isTypingCustomer: false }).catch(console.error);
    }, 1500);
  };
  
  const handleReaction = async (msgId: string, emoji: string) => {
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
  };

  const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
    const isMe = msg.sender === 'customer';
    const longPressEvent = useLongPress(() => setActiveReactionMsg(msg.id), () => {}, { delay: 400 });
    
    return (
      <div className={\`flex gap-3 \${isMe ? 'justify-end' : 'justify-start'}\`}>
        {!isMe && (
          <div className="w-8 h-8 bg-primary flex-shrink-0 flex items-center justify-center text-on-primary font-black text-sm">C</div>
        )}
        <div className={\`flex flex-col \${isMe ? 'items-end' : 'items-start'} max-w-[85%] relative\`}>
          {activeReactionMsg === msg.id && (
            <div className={\`absolute z-50 -top-12 \${isMe ? 'right-0' : 'left-0'} bg-surface-container-highest border border-outline-variant shadow-xl rounded-full px-3 py-2 flex gap-2 animate-bounce-in\`}>
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-xl hover:scale-125 transition-transform">{emoji}</button>
              ))}
            </div>
          )}
          <div {...longPressEvent} className={\`p-4 text-[13px] leading-relaxed rounded-none shadow-sm cursor-pointer select-none \${isMe ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'}\`}>
            {renderMessageWithLinks(msg.text)}
          </div>
          {msg.reactions && msg.reactions.length > 0 && (
            <div className={\`absolute -bottom-3 \${isMe ? 'left-0' : 'right-0'} bg-surface-container-low border border-outline-variant rounded-full px-1.5 py-0.5 text-xs flex gap-1 shadow-sm\`}>
              {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
            </div>
          )}
          <div className={\`text-[10px] text-on-surface-variant mt-1.5 flex items-center gap-1.5 \${isMe ? 'justify-end w-full' : 'w-full'}\`}>
            {formatTime(msg.createdAt)}
            {isMe && <span className="text-primary text-xs">✓✓</span>}
          </div>
        </div>
      </div>
    );
  };

  const sendMessage = async (e: React.FormEvent) => {`
);

// 6. Fix input handler and map
widgetCode = widgetCode.replace(
  "onChange={(e) => setInputText(e.target.value)}",
  "onChange={handleTyping}"
);

widgetCode = widgetCode.replace(
  /\{messages\.map\(\(msg\) => \([\s\S]*?<\/div>\s*<\/div>\s*\)\)\}/,
  "{messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}"
);

// Add typing indicator inside messages body
widgetCode = widgetCode.replace(
  "<div ref={messagesEndRef} />",
  `<div ref={messagesEndRef} />
                {isTypingAdmin && (
                  <div className="flex gap-3 justify-start mb-2">
                    <div className="w-8 h-8 bg-primary flex-shrink-0 flex items-center justify-center text-on-primary font-black text-sm">C</div>
                    <div className="bg-surface-container-low p-4 py-5 rounded-none flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                      <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                      <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                    </div>
                  </div>
                )}`
);


// Clear typing when sending
widgetCode = widgetCode.replace(
  "const textToSend = inputText.trim();",
  "const textToSend = inputText.trim();\n    updateDoc(doc(db, 'chats', chatId), { isTypingCustomer: false }).catch(console.error);\n    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);"
);

// Close reaction picker on click outside (hacky but works for now by wrapping body)
widgetCode = widgetCode.replace(
  '<div className="flex-1 overflow-y-auto p-5 bg-background flex flex-col gap-6">',
  '<div className="flex-1 overflow-y-auto p-5 bg-background flex flex-col gap-6" onClick={(e) => { if (activeReactionMsg) { e.stopPropagation(); setActiveReactionMsg(null); } }}>'
);


fs.writeFileSync('src/components/store/ChatWidget.tsx', widgetCode);
