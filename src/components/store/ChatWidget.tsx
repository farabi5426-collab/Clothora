import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import { getChatId } from '../../lib/chatUtils';
import { Send, X, MessageSquareText, Reply, CornerDownRight } from 'lucide-react';
import { useLongPress } from '../../lib/useLongPress';
import { motion } from 'motion/react';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface ChatMessage {
  id: string;
  text: string;
  sender: 'customer' | 'admin';
  createdAt: any;
  reactions?: string[];
  replyTo?: { id: string; text: string; sender: string };
}

const renderMessageWithLinks = (text: string) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 break-all" onClick={(e) => e.stopPropagation()}>
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const formatTime = (createdAt: any) => {
  if (!createdAt) return 'Now';
  if (typeof createdAt.toDate === 'function') {
    return createdAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (createdAt.seconds) {
    return new Date(createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  return 'Now';
};

export default function ChatWidget() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [regName, setRegName] = useState(user?.displayName || '');
  const [regPhone, setRegPhone] = useState('');
  const [isTypingAdmin, setIsTypingAdmin] = useState(false);
  
  const [activeReactionMsg, setActiveReactionMsg] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const chatId = user ? user.uid : getChatId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isTypingAdmin) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isTypingAdmin]);

  useEffect(() => {
    if (!isOpen) return;
    const chatDocRef = doc(db, 'chats', chatId);
    const unsubscribeChat = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsRegistered(true);
        setIsTypingAdmin(!!docSnap.data()?.isTypingAdmin);
        if (docSnap.data().unreadCustomer > 0) {
          updateDoc(chatDocRef, { unreadCustomer: 0 }).catch(console.error);
        }
      }
    });

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) } as ChatMessage));
      setMessages(msgs);
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [isOpen, chatId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;
    const phoneStr = regPhone.replace(/[\s-]/g, '');
    if (!/^(?:\+88|88)?01[3-9]\d{8}$/.test(phoneStr) && !/^\+?[0-9]{10,15}$/.test(phoneStr)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    const finalName = user ? regName : `${regName} (G)`;
    setDoc(doc(db, 'chats', chatId), {
      userId: chatId,
      customerName: finalName,
      customerPhone: regPhone,
      lastMessage: 'Chat started',
      updatedAt: serverTimestamp(),
      unreadAdmin: 1,
      unreadCustomer: 0
    }, { merge: true }).catch((err) => {
      console.error(err);
      toast.error('Failed to register.');
    });
    setIsRegistered(true);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');
    
    updateDoc(doc(db, 'chats', chatId), { isTypingCustomer: false }).catch(console.error);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    setDoc(doc(db, 'chats', chatId), {
      lastMessage: textToSend,
      updatedAt: serverTimestamp(),
      unreadAdmin: 1 
    }, { merge: true }).catch(console.error);

    const msgData: any = {
      text: textToSend,
      sender: 'customer',
      createdAt: serverTimestamp()
    };
    
    if (replyingTo) {
      msgData.replyTo = {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.sender
      };
    }
    
    addDoc(collection(db, 'chats', chatId, 'messages'), msgData).catch(console.error);
    setReplyingTo(null);
    setTimeout(scrollToBottom, 50);
  };

  const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
    const isMe = msg.sender === 'customer';
    const longPressEvent = useLongPress(() => setActiveReactionMsg(msg.id), () => {}, { delay: 400 });
    
    return (
      <div className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
        {!isMe && (
          <div className="w-8 h-8 bg-primary flex-shrink-0 flex items-center justify-center text-on-primary font-black text-sm">C</div>
        )}
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] relative`}>
          {activeReactionMsg === msg.id && (
            <div className={`absolute z-50 -top-12 ${isMe ? 'right-0' : 'left-0'} bg-surface-container-highest border border-outline-variant shadow-xl rounded-full px-3 py-2 flex gap-2 animate-bounce-in`}>
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-xl hover:scale-125 transition-transform">{emoji}</button>
              ))}
              <button 
                onClick={() => { setReplyingTo(msg); setActiveReactionMsg(null); }}
                className="w-8 h-8 bg-surface-container-low text-on-surface rounded-full flex items-center justify-center hover:bg-surface-bright transition-colors ml-1 border border-outline-variant"
              >
                <Reply className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <motion.div 
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.x > 50 || info.offset.x < -50) {
                setReplyingTo(msg);
              }
            }}
            onContextMenu={(e) => { e.preventDefault(); setActiveReactionMsg(msg.id); }}
            {...longPressEvent} 
            className={`p-4 text-[13px] leading-relaxed rounded-none shadow-sm cursor-pointer select-none relative ${isMe ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'}`}
          >
            {msg.replyTo && (
              <div className={`mb-2 p-2 rounded text-xs border-l-4 ${isMe ? 'bg-primary-container text-on-primary border-on-primary/50' : 'bg-surface-container-highest text-on-surface border-primary'}`}>
                <span className="font-bold uppercase tracking-widest block mb-0.5 opacity-80">{msg.replyTo.sender === 'customer' ? 'You' : 'Clothora'}</span>
                <span className="line-clamp-1 opacity-90">{msg.replyTo.text}</span>
              </div>
            )}
            {renderMessageWithLinks(msg.text)}
          </motion.div>

          {msg.reactions && msg.reactions.length > 0 && (
            <div className={`absolute -bottom-3 ${isMe ? 'left-0' : 'right-0'} bg-surface-container-low border border-outline-variant rounded-full px-1.5 py-0.5 text-xs flex gap-1 shadow-sm`}>
              {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
            </div>
          )}
          <div className={`text-[10px] text-on-surface-variant mt-1.5 flex items-center gap-1.5 ${isMe ? 'justify-end w-full' : 'w-full'}`}>
            {formatTime(msg.createdAt)}
            {isMe && <span className="text-primary text-xs">✓✓</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      {isOpen ? (
        <div className="w-[calc(100vw-32px)] sm:w-[380px] h-[500px] sm:h-[600px] max-h-[80vh] bg-surface-container-lowest border border-outline-variant shadow-2xl flex flex-col mb-2 sm:mb-4 overflow-hidden rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-primary">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-on-primary m-0 leading-none">CLOTHORA SUPPORT</h3>
              <p className="text-[11px] text-on-primary/90 mt-1.5 font-medium tracking-wide">Streetwear & Anime Apparel Experts</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsOpen(false)} className="text-on-primary hover:text-on-primary/70 transition-colors">
                <span className="w-4 h-[2px] bg-current block"></span>
              </button>
              <button onClick={() => setIsOpen(false)} className="text-on-primary hover:text-on-primary/70 transition-colors">
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 bg-background flex flex-col gap-6" onClick={(e) => { if (activeReactionMsg) { e.stopPropagation(); setActiveReactionMsg(null); } }}>
            {!isRegistered ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center rounded-none mb-4">
                  <MessageSquareText className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tighter text-on-background">Welcome!</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Please introduce yourself to start chatting.</p>
                <form onSubmit={handleRegister} className="w-full space-y-3 mt-4">
                  <input required placeholder="YOUR NAME" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant p-4 text-xs font-bold uppercase tracking-[0.1em] text-on-background focus:border-primary outline-none rounded-none" />
                  <input required type="tel" placeholder="YOUR PHONE" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant p-4 text-xs font-bold uppercase tracking-[0.1em] text-on-background focus:border-primary outline-none rounded-none" />
                  <button type="submit" className="w-full bg-primary text-on-primary p-4 text-xs font-black uppercase tracking-[0.1em] hover:bg-primary-container transition-colors rounded-none">Start Chat</button>
                </form>
              </div>
            ) : (
              <>
                {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
                <div ref={messagesEndRef} />
                {isTypingAdmin && (
                  <div className="flex gap-3 justify-start mb-2">
                    <div className="w-8 h-8 bg-primary flex-shrink-0 flex items-center justify-center text-on-primary font-black text-sm">C</div>
                    <div className="bg-surface-container-low p-4 py-5 rounded-none flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                      <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                      <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full typing-dot"></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Footer Input */}
          {isRegistered && (
            <div className="flex flex-col bg-surface-container-lowest border-t border-outline-variant">
              {replyingTo && (
                <div className="flex items-center justify-between p-3 bg-surface border-b border-outline-variant">
                  <div className="flex items-center gap-2 overflow-hidden text-on-surface">
                    <CornerDownRight className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-bold uppercase text-primary">Replying to {replyingTo.sender === 'customer' ? 'Yourself' : 'Clothora'}</span>
                      <span className="text-xs truncate opacity-80">{replyingTo.text}</span>
                    </div>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-surface-bright rounded text-on-surface-variant">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="p-4">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={inputText}
                    onChange={handleTyping}
                    className="flex-1 bg-surface-container-low p-3.5 text-sm text-on-background outline-none rounded-none placeholder:text-on-surface-variant"
                  />
                  <button type="submit" disabled={!inputText.trim()} className="bg-primary text-on-primary w-12 flex flex-shrink-0 items-center justify-center rounded-none hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-5 h-5 fill-current" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center rounded-[20px] shadow-[0_0_40px_var(--color-primary)] hover:scale-105 transition-transform"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <line x1="8" y1="10" x2="16" y2="10"></line>
            <line x1="8" y1="14" x2="16" y2="14"></line>
          </svg>
        </button>
      )}
    </div>
  );
}
