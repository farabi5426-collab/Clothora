import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';

export default function ChatWidget() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        senderName: name,
        senderEmail: email,
        content: message,
        createdAt: new Date()
      });
      setSent(true);
      setMessage('');
      setTimeout(() => {
        setSent(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-[#111] border border-[#ffffff15] shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-[#ffffff15] bg-[#1a1a1a]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Contact Us</h3>
            <button onClick={() => setIsOpen(false)} className="text-[#ffffff60] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {sent ? (
              <div className="text-center py-8">
                <p className="text-green-500 font-bold uppercase tracking-widest text-sm mb-2">Message Sent!</p>
                <p className="text-xs text-[#ffffff60]">We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-xs text-white focus:border-[#ff4e00] outline-none"
                  />
                </div>
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-xs text-white focus:border-[#ff4e00] outline-none"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-xs text-white focus:border-[#ff4e00] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-[#ff4e00] hover:bg-[#e64600] text-white p-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#ff4e00] hover:bg-[#e64600] text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,78,0,0.3)] hover:scale-105 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
