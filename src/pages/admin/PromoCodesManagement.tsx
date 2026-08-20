import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, X } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount: number;
  maxUsers: number;
  expiryDate: string;
  createdAt: any;
  isActive?: boolean;
}

export default function PromoCodesManagement() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '', discountPercent: '', discountAmount: '', minOrderAmount: '', maxUsers: '', expiryDate: ''
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
    if (!formData.discountPercent && !formData.discountAmount) {
      alert('Please provide either a discount percentage or a flat discount amount.');
      return;
    }
    try {
      await addDoc(collection(db, 'promoCodes'), {
        code: formData.code.toUpperCase(),
        discountPercent: formData.discountPercent ? Number(formData.discountPercent) : 0,
        discountAmount: formData.discountAmount ? Number(formData.discountAmount) : 0,
        minOrderAmount: Number(formData.minOrderAmount),
        maxUsers: Number(formData.maxUsers),
        expiryDate: formData.expiryDate,
        createdAt: new Date(),
        isActive: true
      });
      setIsModalOpen(false);
      setFormData({ code: '', discountPercent: '', discountAmount: '', minOrderAmount: '', maxUsers: '', expiryDate: '' });
    } catch (error) {
      console.error('Error adding promo code:', error);
      alert('Failed to save promo code.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // updateDoc needs to be imported, but we can do it via firebase/firestore at the top
      await updateDoc(doc(db, 'promoCodes', id), { isActive: !currentStatus });
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this promo code?')) {
      await deleteDoc(doc(db, 'promoCodes', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Promo Codes</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Discounts & Offers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
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
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((promo) => (
              <tr key={promo.id} className="border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-black text-primary tracking-widest text-lg">{promo.code}</td>
                <td className="p-4 font-bold">{promo.discountPercent && promo.discountPercent > 0 ? `${promo.discountPercent}%` : `৳ ${promo.discountAmount}`}</td>
                <td className="p-4">৳ {promo.minOrderAmount}</td>
                <td className="p-4">{promo.maxUsers}</td>
                <td className="p-4 text-xs uppercase tracking-widest text-on-surface-variant">{promo.expiryDate}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleToggleStatus(promo.id, promo.isActive !== false)} 
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors ${promo.isActive !== false ? 'bg-[#4ade80]/20 text-[#4ade80] hover:bg-[#4ade80]/30' : 'bg-error/20 text-error hover:bg-error/30'}`}
                  >
                    {promo.isActive !== false ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => handleDelete(promo.id)} className="text-on-surface-variant hover:text-red-500 transition-colors p-2 bg-surface-container-low hover:bg-surface-container rounded-theme">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {promoCodes.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No promo codes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-lg p-4 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                  <input type="number" min="1" max="100" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value, discountAmount: ''})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" placeholder="e.g. 10" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Discount Amount (৳)</label>
                  <input type="number" min="1" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: e.target.value, discountPercent: ''})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" placeholder="e.g. 100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Min Order (৳)</label>
                  <input required type="number" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Max Users</label>
                  <input required type="number" min="1" value={formData.maxUsers} onChange={e => setFormData({...formData, maxUsers: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Expiry Date</label>
                  <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary p-4 text-xs font-bold uppercase tracking-widest mt-6">
                Create Promo Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
