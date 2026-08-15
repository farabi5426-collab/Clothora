import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Send, User } from 'lucide-react';

interface ChatSession {
  id: string; // which is the userId/chatId
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  updatedAt: any;
  unreadAdmin: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'customer' | 'admin';
  createdAt: any;
}

export default function MessagesManagement() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList: ChatSession[] = [];
      snapshot.forEach((doc) => chatList.push({ id: doc.id, ...doc.data() } as ChatSession));
      setChats(chatList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    // Mark as read
    if (selectedChat.unreadAdmin > 0) {
      updateDoc(doc(db, 'chats', selectedChat.id), { unreadAdmin: 0 }).catch(console.error);
    }

    const q = query(collection(db, 'chats', selectedChat.id, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    const textToSend = inputText.trim();
    setInputText('');

    await setDoc(doc(db, 'chats', selectedChat.id), {
      lastMessage: textToSend,
      updatedAt: serverTimestamp(),
      unreadCustomer: 1
    }, { merge: true });

    await addDoc(collection(db, 'chats', selectedChat.id, 'messages'), {
      text: textToSend,
      sender: 'admin',
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Messages</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest">Live Customer Chat</p>
      </div>
      
      <div className="flex-1 bg-surface-container-lowest border border-outline-variant flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 border-r border-outline-variant flex flex-col ${selectedChat ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Active Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-outline-variant cursor-pointer transition-colors ${selectedChat?.id === chat.id ? 'bg-primary/10 border-l-4 border-l-[#ff4e00]' : 'hover:bg-surface-container-low border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm uppercase text-on-background truncate">{chat.customerName}</h3>
                  {chat.unreadAdmin > 0 && (
                    <span className="bg-primary text-on-background text-[10px] font-bold px-2 py-0.5 rounded-full">{chat.unreadAdmin}</span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant truncate">{chat.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-background ${!selectedChat ? "hidden md:flex" : "flex"}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden text-on-surface-variant hover:text-on-background mr-2"><span className="material-symbols-outlined">arrow_back</span></button>
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-outline-variant text-on-background">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold uppercase text-on-background">{selectedChat.customerName}</h2>
                  <p className="text-xs text-on-surface-variant tracking-widest">{selectedChat.customerEmail}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 text-sm font-medium ${
                      msg.sender === 'admin' 
                        ? 'bg-primary text-on-background' 
                        : 'bg-surface-container-low border border-outline-variant text-on-background'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Type your reply..." 
                    className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none text-sm"
                  />
                  <button type="submit" disabled={!inputText.trim()} className="bg-primary text-on-background px-6 flex items-center justify-center font-bold uppercase tracking-widest hover:bg-primary-container transition-colors disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
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
