import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import { getChatId } from '../../lib/chatUtils';
import { Send, X, MessageSquareText, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'customer' | 'admin';
  createdAt: any;
}

export default function ChatWidget() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  
  // Registration state for anonymous users before they can chat
  const [isRegistered, setIsRegistered] = useState(false);
  const [regName, setRegName] = useState(user?.displayName || '');
  const [regEmail, setRegEmail] = useState(user?.email || '');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatId = user ? user.uid : getChatId();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isOpen) return;

    // Check if chat document exists to determine if registered
    const chatDocRef = doc(db, 'chats', chatId);
    const unsubscribeChat = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsRegistered(true);
        if (docSnap.data().unreadCustomer > 0) {
          // Reset unread count for customer
          updateDoc(chatDocRef, { unreadCustomer: 0 }).catch(console.error);
        }
      }
    });

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() } as ChatMessage));
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
    if (!regName || !regEmail) return;
    
    await setDoc(doc(db, 'chats', chatId), {
      userId: chatId,
      customerName: regName,
      customerEmail: regEmail,
      lastMessage: 'Chat started',
      updatedAt: serverTimestamp(),
      unreadAdmin: 1,
      unreadCustomer: 0
    }, { merge: true });
    
    setIsRegistered(true);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    // Ensure chat doc exists/updated
    await setDoc(doc(db, 'chats', chatId), {
      userId: chatId,
      customerName: user?.displayName || regName || 'Guest',
      customerEmail: user?.email || regEmail || 'guest@example.com',
      lastMessage: textToSend,
      updatedAt: serverTimestamp(),
      unreadAdmin: 1 // We increment unreadAdmin count or just set it to > 0. In real world we'd use FieldValue.increment(1)
    }, { merge: true });

    // Add message
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: textToSend,
      sender: 'customer',
      createdAt: serverTimestamp()
    });
    
    scrollToBottom();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[380px] h-[600px] max-h-[85vh] bg-[#111] border border-[#ffffff15] shadow-2xl flex flex-col mb-4 overflow-hidden rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-[#ff4e00]">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-white m-0 leading-none">CLOTHORA SUPPORT</h3>
              <p className="text-[11px] text-white/90 mt-1.5 font-medium tracking-wide">Streetwear & Anime Apparel Experts</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-white/70 transition-colors">
                <span className="w-4 h-[2px] bg-current block"></span>
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-white/70 transition-colors">
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 bg-[#0a0a0a] flex flex-col gap-6">
            {!isRegistered ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#ff4e00] text-white flex items-center justify-center rounded-none mb-4">
                  <MessageSquareText className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tighter text-white">Welcome!</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Please introduce yourself to start chatting.</p>
                <form onSubmit={handleRegister} className="w-full space-y-3 mt-4">
                  <input required placeholder="YOUR NAME" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-4 text-xs font-bold uppercase tracking-[0.1em] text-white focus:border-[#ff4e00] outline-none rounded-none" />
                  <input required type="email" placeholder="YOUR EMAIL" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-4 text-xs font-bold uppercase tracking-[0.1em] text-white focus:border-[#ff4e00] outline-none rounded-none" />
                  <button type="submit" className="w-full bg-[#ff4e00] text-white p-4 text-xs font-black uppercase tracking-[0.1em] hover:bg-[#e64600] transition-colors rounded-none">Start Chat</button>
                </form>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'admin' && (
                      <div className="w-8 h-8 bg-[#ff4e00] flex-shrink-0 flex items-center justify-center text-white font-black text-sm">
                        C
                      </div>
                    )}
                    <div className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                      <div className={`p-4 text-[13px] leading-relaxed rounded-none shadow-sm ${
                        msg.sender === 'customer' 
                          ? 'bg-[#ff4e00] text-white' 
                          : 'bg-[#1a1a1a] text-[#e0e0e0]'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[10px] text-[#ffffff50] mt-1.5 flex items-center gap-1.5 ${msg.sender === 'customer' ? 'justify-end w-full' : 'w-full'}`}>
                        {msg.createdAt?.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) || 'Now'}
                        {msg.sender === 'customer' && <span className="text-[#ff4e00] text-xs">✓✓</span>}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Footer Input */}
          {isRegistered && (
            <div className="p-4 bg-[#111] border-t border-[#ffffff15]">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#1a1a1a] p-3.5 text-sm text-white outline-none rounded-none placeholder:text-[#ffffff40]"
                />
                <button type="submit" disabled={!inputText.trim()} className="bg-[#ff4e00] text-white w-12 flex flex-shrink-0 items-center justify-center rounded-none hover:bg-[#e64600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-5 h-5 fill-current" />
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#ff4e00] text-white flex items-center justify-center rounded-[20px] shadow-[0_0_40px_rgba(255,78,0,0.4)] hover:scale-105 transition-transform"
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
