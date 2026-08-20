import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Send, User, Reply, CornerDownRight, X, ArrowLeft } from 'lucide-react';
import { useLongPress } from '../../lib/useLongPress';
import { motion } from 'motion/react';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface ChatSession {
  id: string; // which is the userId/chatId
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  lastMessage: string;
  updatedAt: any;
  unreadAdmin: number;
  isTypingCustomer?: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'customer' | 'admin';
  createdAt: any;
  reactions?: Record<string, string>;
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

const MessageBubble = React.memo(({ msg, activeReactionMsg, setActiveReactionMsg, handleReaction, setReplyingTo, selectedChat }: any) => {
    const isAdmin = msg.sender === 'admin';
    const longPressEvent = useLongPress(() => setActiveReactionMsg(msg.id), () => {}, { delay: 400 });
    
    
  return (
      <div className={`flex gap-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
        {!isAdmin && (
          <div className="w-8 h-8 bg-surface-container-low flex-shrink-0 flex items-center justify-center text-on-surface font-black text-sm uppercase">
            {selectedChat?.customerName?.charAt(0) || 'C'}
          </div>
        )}
        <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[85%] relative`}>
          {activeReactionMsg === msg.id && (
            <div className={`absolute z-50 -top-12 ${isAdmin ? 'right-0' : 'left-0'} bg-surface-container-highest border border-outline-variant shadow-xl rounded-full px-3 py-2 flex gap-2 animate-bounce-in`}>
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-[22px] hover:scale-125 transition-transform animate-dance inline-block origin-bottom">{emoji}</button>
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
            className={`p-4 text-[13px] leading-relaxed rounded-theme shadow-sm cursor-pointer select-none relative ${isAdmin ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'}`}
          >
            {msg.replyTo && (
              <div className={`mb-2 p-2 rounded text-xs border-l-4 ${isAdmin ? 'bg-primary-container text-on-primary border-on-primary/50' : 'bg-surface-container-highest text-on-surface border-primary'}`}>
                <span className="font-bold uppercase tracking-widest block mb-0.5 opacity-80">{msg.replyTo.sender === 'admin' ? 'You' : selectedChat?.customerName || 'Customer'}</span>
                <span className="line-clamp-1 opacity-90">{msg.replyTo.text}</span>
              </div>
            )}
            {renderMessageWithLinks(msg.text)}
          </motion.div>
          
          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
            <div className={`absolute -bottom-3 ${isAdmin ? 'left-0' : 'right-0'} bg-surface border border-outline-variant rounded-full px-1.5 py-0.5 text-[14px] flex gap-1 shadow-sm min-h-[24px] items-center`}>
              {Object.values(msg.reactions).map((r, i) => <span key={r + i} className="animate-pop-in inline-block origin-bottom">{r}</span>)}
            </div>
          )}
          <div className={`text-[10px] text-on-surface-variant mt-1.5 flex items-center gap-1.5 ${isAdmin ? 'justify-end w-full' : 'w-full'}`}>
            {formatTime(msg.createdAt)}
            {isAdmin && <span className="text-primary text-xs">✓✓</span>}
          </div>
        </div>
      </div>
    );
  });


export default function MessagesManagement() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  
  const [activeReactionMsg, setActiveReactionMsg] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedChat = chats.find(c => c.id === selectedChatId) || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (selectedChat?.isTypingCustomer) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedChat?.isTypingCustomer]);

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList: ChatSession[] = [];
      snapshot.forEach((doc) => chatList.push({ id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) } as ChatSession));
      setChats(chatList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedChatId) return;
    const currentSelectedChat = chats.find(c => c.id === selectedChatId);
    if (currentSelectedChat && currentSelectedChat.unreadAdmin > 0) {
      updateDoc(doc(db, 'chats', selectedChatId), { unreadAdmin: 0 }).catch(console.error);
    }
    
    const q = query(collection(db, 'chats', selectedChatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data({ serverTimestamps: 'estimate' }) } as ChatMessage));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [selectedChatId]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!selectedChatId) return;
    
    updateDoc(doc(db, 'chats', selectedChatId), { isTypingAdmin: true }).catch(console.error);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      updateDoc(doc(db, 'chats', selectedChatId), { isTypingAdmin: false }).catch(console.error);
    }, 1500);
  };
  
  const handleReaction = async (msgId: string, emoji: string) => {
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
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;
    const textToSend = inputText.trim();
    setInputText('');
    
    updateDoc(doc(db, 'chats', selectedChatId), { isTypingAdmin: false }).catch(console.error);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    setDoc(doc(db, 'chats', selectedChatId), {
      lastMessage: textToSend,
      updatedAt: serverTimestamp(),
      unreadCustomer: 1
    }, { merge: true }).catch((err) => {
      console.error(err);
      toast.error('Failed to update chat metadata');
    });

    const msgData: any = {
      text: textToSend,
      sender: 'admin',
      createdAt: serverTimestamp()
    };
    
    if (replyingTo) {
      msgData.replyTo = {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.sender
      };
    }

    addDoc(collection(db, 'chats', selectedChatId, 'messages'), msgData).catch((err) => {
      console.error(err);
      toast.error('Failed to send message');
    });
    
    setReplyingTo(null);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Messages</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest">Live Customer Chat</p>
      </div>
      
      <div className="flex-1 bg-surface-container-lowest border border-outline-variant flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 border-r border-outline-variant flex flex-col ${selectedChatId ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Active Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-4 border-b border-outline-variant cursor-pointer transition-colors ${selectedChatId === chat.id ? 'bg-primary/10 border-l-4 border-l-[#ff4e00]' : 'hover:bg-surface-container-low border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm uppercase text-on-background truncate">{chat.customerName}</h3>
                  {chat.unreadAdmin > 0 && (
                    <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{chat.unreadAdmin}</span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant truncate">{chat.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-background ${!selectedChatId ? "hidden md:flex" : "flex"}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-4">
                <button onClick={() => setSelectedChatId(null)} className="md:hidden text-on-surface-variant hover:text-on-background mr-2"><ArrowLeft className="w-6 h-6" /></button>
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-outline-variant text-on-background">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold uppercase text-on-background">{selectedChat.customerName}</h2>
                  <p className="text-xs text-on-surface-variant tracking-widest">{selectedChat.customerPhone || selectedChat.customerEmail}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-surface flex flex-col gap-6" onClick={(e) => { if (activeReactionMsg) { e.stopPropagation(); setActiveReactionMsg(null); } }}>
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} activeReactionMsg={activeReactionMsg} setActiveReactionMsg={setActiveReactionMsg} handleReaction={handleReaction} setReplyingTo={setReplyingTo} selectedChat={selectedChat} />)}
                <div ref={messagesEndRef} />
                
                {selectedChat.isTypingCustomer && (
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
                )}
              </div>

              {/* Input */}
              <div className="flex flex-col border-t border-outline-variant bg-surface-container-lowest">
                {replyingTo && (
                  <div className="flex items-center justify-between p-3 bg-surface border-b border-outline-variant">
                    <div className="flex items-center gap-2 overflow-hidden text-on-surface">
                      <CornerDownRight className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold uppercase text-primary">Replying to {replyingTo.sender === 'admin' ? 'Yourself' : selectedChat.customerName}</span>
                        <span className="text-xs truncate opacity-80">{replyingTo.text}</span>
                      </div>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-surface-bright rounded text-on-surface-variant">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="p-4">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={handleTyping}
                      placeholder="Type your reply..." 
                      className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none text-sm"
                    />
                    <button type="submit" disabled={!inputText.trim()} className="bg-primary text-on-primary px-6 flex items-center justify-center font-bold uppercase tracking-widest hover:bg-primary-container transition-colors disabled:opacity-50">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant uppercase tracking-widest text-xs font-bold">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
