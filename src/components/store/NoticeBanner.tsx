import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { AlertCircle } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function NoticeBanner() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'notices'), where('isActive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeNotices: Notice[] = [];
      snapshot.forEach((doc) => activeNotices.push({ id: doc.id, ...doc.data() } as Notice));
      setNotices(activeNotices);
    });
    return () => unsubscribe();
  }, []);

  if (notices.length === 0) return null;

  return (
    <div className="w-full flex flex-col">
      {notices.map((notice) => (
        <div key={notice.id} className="bg-[#ff4e00] text-white px-4 py-3 flex items-center justify-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div className="text-xs font-bold uppercase tracking-widest text-center">
            {notice.title}: <span className="font-normal opacity-90">{notice.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
