import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  content: string;
  createdAt: any;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Messages</h1>
        <p className="text-xs text-[#ffffff60] uppercase tracking-widest">Customer inquiries</p>
      </div>
      
      <div className="flex-1 bg-[#111] border border-[#ffffff15] p-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#ffffff60] uppercase tracking-widest text-xs font-bold">
            No messages yet
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-[#1a1a1a] border border-[#ffffff0a] p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-[#ffffff05] pb-2">
                  <div>
                    <span className="font-bold uppercase text-sm text-white">{msg.senderName}</span>
                    <span className="text-xs text-[#ffffff60] ml-2 tracking-widest">{msg.senderEmail}</span>
                  </div>
                  <span className="text-[10px] text-[#ffffff40] uppercase tracking-widest">
                    {msg.createdAt?.toDate().toLocaleString()}
                  </span>
                </div>
                <p className="text-[#ffffff80] text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
