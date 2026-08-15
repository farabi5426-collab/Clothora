import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, X } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxUsers: number;
  expiryDate: string;
  createdAt: any;
}

export default function PromoCodesManagement() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '', discountPercent: '', minOrderAmount: '', maxUsers: '', expiryDate: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'promoCodes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const codes: PromoCode[] = [];
      snapshot.forEach((doc) => codes.push({ id: doc.id, ...doc.data() } as PromoCode));
      setPromoCodes(codes);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'promoCodes'), {
        code: formData.code.toUpperCase(),
        discountPercent: Number(formData.discountPercent),
        minOrderAmount: Number(formData.minOrderAmount),
        maxUsers: Number(formData.maxUsers),
        expiryDate: formData.expiryDate,
        createdAt: new Date()
      });
      setIsModalOpen(false);
      setFormData({ code: '', discountPercent: '', minOrderAmount: '', maxUsers: '', expiryDate: '' });
    } catch (error) {
      console.error('Error adding promo code:', error);
      alert('Failed to save promo code.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this promo code?')) {
      await deleteDoc(doc(db, 'promoCodes', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Promo Codes</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Discounts & Offers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-container text-on-background px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Code
        </button>
      </div>
      
      <div className="bg-surface-container-lowest border border-outline-variant overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Code</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Discount</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Min Order</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Max Users</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Expiry Date</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((promo) => (
              <tr key={promo.id} className="border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-black text-primary tracking-widest text-lg">{promo.code}</td>
                <td className="p-4 font-bold">{promo.discountPercent}%</td>
                <td className="p-4">৳ {promo.minOrderAmount}</td>
                <td className="p-4">{promo.maxUsers}</td>
                <td className="p-4 text-xs uppercase tracking-widest text-on-surface-variant">{promo.expiryDate}</td>
                <td className="p-4 flex justify-end">
                  <button onClick={() => handleDelete(promo.id)} className="text-on-surface-variant hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {promoCodes.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No active promo codes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">New Promo Code</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-background">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Code</label>
                <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. SUMMER50" className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none uppercase font-bold tracking-widest" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Discount (%)</label>
                  <input required type="number" min="1" max="100" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Min Order (৳)</label>
                  <input required type="number" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Max Users</label>
                  <input required type="number" min="1" value={formData.maxUsers} onChange={e => setFormData({...formData, maxUsers: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Expiry Date</label>
                  <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-background p-4 text-xs font-bold uppercase tracking-widest mt-6">
                Create Promo Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
