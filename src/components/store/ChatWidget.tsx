import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';

export default function ChatWidget() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSent(true);
    addDoc(collection(db, 'messages'), {
      senderName: name,
      senderEmail: email,
      content: message,
      createdAt: new Date()
    }).catch((error) => {
      console.error('Failed to send message in background', error);
    });
    
    setMessage('');
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-surface border-2 border-surface-bright shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col mb-4">
          <div className="flex items-center justify-between p-[16px] border-b-2 border-surface-bright bg-surface-container-low">
            <h3 className="text-[16px] font-black uppercase tracking-tighter text-on-surface">CONTACT US</h3>
            <button onClick={() => setIsOpen(false)} className="text-on-surface hover:text-primary transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="p-[24px]">
            {sent ? (
              <div className="text-center py-[48px]">
                <p className="text-[#4ade80] font-black uppercase tracking-[0.1em] text-[18px] mb-[8px]">MESSAGE SENT!</p>
                <p className="text-[12px] text-on-surface-variant font-bold uppercase tracking-widest">WE WILL GET BACK TO YOU SHORTLY.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-[16px]">
                <input
                  required
                  placeholder="YOUR NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface focus:border-primary outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface focus:border-primary outline-none"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="HOW CAN WE HELP YOU?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface focus:border-primary outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary p-[16px] text-[14px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_#5c1900] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#5c1900] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                  SEND MESSAGE <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-[64px] h-[64px] bg-primary text-on-primary flex items-center justify-center shadow-[4px_4px_0px_#5c1900] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#5c1900] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-none"
        >
          <span className="material-symbols-outlined text-[32px]">chat</span>
        </button>
      )}
    </div>
  );
}
