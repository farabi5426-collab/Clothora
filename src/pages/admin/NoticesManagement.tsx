import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, X, Upload } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function NoticesManagement() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '', isActive: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nots: Notice[] = [];
      snapshot.forEach((doc) => nots.push({ id: doc.id, ...doc.data() } as Notice));
      setNotices(nots);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentFormData = { ...formData };
    const currentSelectedFile = selectedFile;
    
    setIsModalOpen(false);
    setFormData({ title: '', content: '', imageUrl: '', isActive: true });
    setSelectedFile(null);

    (async () => {
      let finalImageUrl = currentFormData.imageUrl;
      try {
        if (currentSelectedFile) {
          const uploadData = new FormData();
          uploadData.append('file', currentSelectedFile);
          uploadData.append('upload_preset', 'kwxslhnw');
          
          const res = await fetch('https://api.cloudinary.com/v1_1/dzsiqw51v/image/upload', {
            method: 'POST',
            body: uploadData
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || 'Failed to upload image');
          finalImageUrl = data.secure_url;
        }

        await addDoc(collection(db, 'notices'), {
          ...currentFormData,
          imageUrl: finalImageUrl,
          createdAt: new Date()
        });
      } catch (error) {
        console.error('Error adding notice:', error);
        alert('Failed to save notice.');
      }
    })();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'notices', id), { isActive: !currentStatus });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this notice?')) {
      await deleteDoc(doc(db, 'notices', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Notices</h1>
          <p className="text-xs text-[#ffffff60] uppercase tracking-widest">Store announcements</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ff4e00] hover:bg-[#e64600] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Notice
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-[#111] border border-[#ffffff15] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-black text-xl uppercase tracking-tight">{notice.title}</h3>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${notice.isActive ? 'bg-[#ff4e00]/20 text-[#ff4e00]' : 'bg-zinc-800 text-zinc-400'}`}>
                  {notice.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-[#ffffff80] text-sm">{notice.content}</p>
              {notice.imageUrl && (
                <img src={notice.imageUrl} alt="Notice" className="h-20 w-auto object-cover border border-[#ffffff15] mt-2" />
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={() => toggleActive(notice.id, notice.isActive)} className="text-xs uppercase font-bold tracking-widest text-white border border-[#ffffff15] px-4 py-2 hover:bg-[#ffffff0a]">
                Toggle Status
              </button>
              <button onClick={() => handleDelete(notice.id)} className="text-red-500 border border-red-500/20 px-4 py-2 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="bg-[#111] border border-[#ffffff15] p-12 text-center text-[#ffffff60] uppercase tracking-widest text-xs font-bold">
            No notices published.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#ffffff15] w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">Create Notice</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#ffffff60] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Content</label>
                <textarea required rows={3} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest text-[#ffffff60]">Image (Optional)</label>
                <div className="flex gap-4 items-center">
                  <label className="cursor-pointer bg-[#1a1a1a] border border-[#ffffff15] hover:border-[#ff4e00] p-3 flex-1 flex justify-center items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-[#ffffff60]" />
                    <span className="text-xs uppercase tracking-widest text-[#ffffff60]">
                      {selectedFile ? selectedFile.name : 'Upload File'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }} />
                  </label>
                </div>
                <div className="text-center text-[#ffffff40] text-[10px] uppercase tracking-widest font-bold">OR PASTE URL</div>
                <input placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none text-xs" />
              </div>

              <button type="submit" className="w-full bg-[#ff4e00] hover:bg-[#e64600] text-white p-4 text-xs font-bold uppercase tracking-widest mt-6">
                Publish Notice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
