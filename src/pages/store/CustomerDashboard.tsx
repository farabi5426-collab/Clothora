import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCartStore } from '../../store/cartStore';
import { Package } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, loading: authLoading, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [profileData, setProfileData] = useState({ name: '', phone: '', address: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOtherReason, setCancelOtherReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const CANCEL_REASONS = [
    'Delivery time is too long',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Changed my mind',
    'Shipping cost is too high',
    'Other'
  ];

  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { setDoc, doc } = require('firebase/firestore');
      await setDoc(doc(db, 'users', user!.uid), profileData, { merge: true });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };
  
  const handleCancelRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason) {
      toast.error('Please select a reason');
      return;
    }
    if (cancelReason === 'Other' && !cancelOtherReason.trim()) {
      toast.error('Please specify your reason');
      return;
    }

    setCancelSubmitting(true);
    try {
      const finalReason = cancelReason === 'Other' ? cancelOtherReason : cancelReason;
      await updateDoc(doc(db, 'orders', selectedOrderForCancel.id), {
        cancellationRequest: {
          reason: finalReason,
          status: 'pending',
          requestedAt: new Date()
        }
      });
      
      toast.success('Cancellation request submitted.');
      
      // Update local state
      setOrders(orders.map(o => o.id === selectedOrderForCancel.id ? {
        ...o,
        cancellationRequest: { reason: finalReason, status: 'pending', requestedAt: new Date() }
      } : o));
      
      setCancelModalOpen(false);
      setSelectedOrderForCancel(null);
      setCancelReason('');
      setCancelOtherReason('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit cancellation request.');
    } finally {
      setCancelSubmitting(false);
    }
  };


  useEffect(() => {
    if (!user) {
      if (!authLoading) setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const { getDoc, doc } = require('firebase/firestore');
        const userDoc = await getDoc(doc(db, 'users', user!.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData({
            name: data.name || user!.displayName || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        } else {
          setProfileData({ name: user!.displayName || '', phone: '', address: '' });
        }
      } catch (e) {
        console.error('Error fetching profile:', e);
      }
    };
    fetchProfile();
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort manually since compound index might not exist
        fetchedOrders.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-[16px] md:px-[64px] py-[64px] min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-[48px]">
        {/* Sidebar */}
        <div className="w-full md:w-[320px] shrink-0">
          <div className="bg-surface-container-low border-2 border-surface-bright p-[24px]">
            <h1 className="text-[24px] font-black uppercase tracking-tighter mb-[8px] text-on-surface leading-none">MY DASHBOARD</h1>
            <p className="text-on-surface-variant text-[12px] uppercase tracking-[0.1em] mb-[32px] font-bold">WELCOME BACK,<br/>{user?.displayName || user?.email}</p>
            
            <div className="flex flex-col gap-[16px]">
              
              <button onClick={() => setActiveTab('orders')} className={`text-[14px] font-black uppercase tracking-[0.1em] border-l-4 pl-[16px] py-[8px] text-left transition-colors ${activeTab === 'orders' ? 'text-primary border-primary bg-primary-container/10' : 'text-on-surface-variant border-transparent hover:text-on-surface'}`}>
                ORDER HISTORY
              </button>
              <button onClick={() => setActiveTab('profile')} className={`text-[14px] font-black uppercase tracking-[0.1em] border-l-4 pl-[16px] py-[8px] text-left transition-colors ${activeTab === 'profile' ? 'text-primary border-primary bg-primary-container/10' : 'text-on-surface-variant border-transparent hover:text-on-surface'}`}>
                PROFILE SETTINGS
              </button>
  
              <button onClick={logout} className="text-[14px] font-bold uppercase tracking-[0.1em] text-error hover:text-on-error hover:bg-error-container text-left pl-[20px] py-[8px] transition-colors">
                LOGOUT
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h2 className="text-[32px] font-black uppercase tracking-tighter mb-[24px] text-on-surface leading-none border-b-2 border-surface-bright pb-4">
            {activeTab === 'orders' ? 'ORDER HISTORY' : 'PROFILE SETTINGS'}
          </h2>
          
          {activeTab === 'profile' && (
            <div className="bg-surface-container-low border-2 border-surface-bright p-[32px]">
              <form onSubmit={handleSaveProfile} className="space-y-[24px] max-w-lg">
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">Full Name</label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[14px] text-on-background outline-none focus:border-primary font-bold" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">Phone Number</label>
                  <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[14px] text-on-background outline-none focus:border-primary font-bold" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">Delivery Address</label>
                  <textarea value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[14px] text-on-background outline-none focus:border-primary font-bold min-h-[100px]" />
                </div>
                <button type="submit" disabled={savingProfile} className="bg-primary text-on-primary px-[32px] py-[16px] text-[14px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] transition-all disabled:opacity-50">
                  {savingProfile ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <>
          {loading ? (
            <div className="space-y-[16px]">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[160px] bg-surface-container-low border-2 border-surface-bright animate-pulse"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-[64px] bg-surface-container-low border-2 border-surface-bright p-[24px]">
              <span className="material-symbols-outlined text-[64px] text-on-surface-variant opacity-50 mb-[16px]">inventory_2</span>
              <p className="text-on-surface-variant font-bold uppercase tracking-[0.1em] text-[14px]">NO ORDERS PLACED YET.</p>
              <Link to="/" className="inline-block mt-[24px] bg-primary text-on-primary px-[32px] py-[16px] text-[14px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] transition-all">START SHOPPING</Link>
            </div>
          ) : (
            <div className="space-y-[24px]">
              {orders.map((order, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id} 
                  className="bg-surface-container-low border-2 border-surface-bright p-[24px] flex flex-col md:flex-row gap-[24px] justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: order.status === 'Delivered' ? '#4ade80' : order.status === 'Shipped' ? '#60a5fa' : 'var(--color-primary)' }}></div>
                  
                  <div className="pl-4">
                    <div className="flex items-center gap-[12px] mb-[8px]">
                      <span className="text-on-surface-variant text-[14px] font-black uppercase tracking-[0.1em]">ORDER #{order.id.slice(0, 8)}</span>
                      <span className={`px-[12px] py-[4px] text-[10px] font-black uppercase tracking-[0.1em] border-2 ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500' :
                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500' :
                        'bg-primary-container/10 text-primary border-primary'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-[12px] mb-[16px] font-bold uppercase tracking-widest">
                      {order.createdAt?.toDate().toLocaleDateString()}
                    </p>
                    <div className="space-y-[12px] mt-[16px]">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 items-center bg-surface-container-lowest p-3 border-2 border-surface-bright">
                          {item.imageUrl ? (
                            <img src={item.selectedColor || item.imageUrl} alt={item.title} className="w-16 h-16 object-cover border-2 border-surface-bright" />
                          ) : (
                            <div className="w-16 h-16 bg-surface-bright flex items-center justify-center border-2 border-surface-bright">
                              <Package className="w-6 h-6 text-on-surface-variant" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-on-surface text-[12px] uppercase tracking-widest line-clamp-2">{item.title}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Qty: {item.quantity} • ৳{item.price}</p>
                            {(item.selectedSize || item.selectedColor) && (
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                                {item.selectedSize && `Size: ${item.selectedSize} `}
                                {item.selectedColor && `Color: Yes`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-between border-t-2 md:border-t-0 border-surface-bright pt-[16px] md:pt-0">
                    <div className="text-[32px] font-black text-primary leading-none">৳{order.totalAmount}</div>
                    
                    {!['Shipped', 'Delivered', 'Cancelled'].includes(order.status) && !order.cancellationRequest && (
                      <button 
                        onClick={() => { setSelectedOrderForCancel(order); setCancelModalOpen(true); }}
                        className="mt-[16px] border-2 border-error text-error px-[16px] py-[8px] text-[12px] font-bold uppercase tracking-widest hover:bg-error hover:text-on-error transition-colors w-full md:w-auto text-center"
                      >
                        CANCEL ORDER
                      </button>
                    )}
                    {order.cancellationRequest?.status === 'pending' && (
                      <div className="mt-[16px] bg-error-container/20 border-2 border-error p-[12px] text-center w-full md:w-auto">
                        <span className="text-error text-[10px] font-black uppercase tracking-[0.1em]">CANCELLATION PENDING</span>
                      </div>
                    )}
                    {order.status === 'Shipped' && order.trackingId && (
                      <div className="mt-[16px] bg-surface-container border-2 border-surface-bright p-[12px]">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.1em] mb-[4px] font-bold">TRACKING ID / URL</p>
                        <a href={order.trackingId.startsWith('http') ? order.trackingId : `#`} target="_blank" rel="noopener noreferrer" className="text-[14px] font-black text-on-surface hover:text-primary transition-colors break-all">
                          {order.trackingId}
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          </>
        )}
        </div>
      </div>

      {cancelModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-surface-bright w-full max-w-lg p-[32px] shadow-[8px_8px_0px_rgba(0,0,0,1)] relative">
            <h2 className="text-[24px] font-black uppercase tracking-tighter mb-2">Cancel Order</h2>
            <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">Order #{selectedOrderForCancel?.id.slice(0, 8)}</p>
            
            <form onSubmit={handleCancelRequest} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-on-surface mb-4">Please let us know why you are cancelling your order:</label>
                <div className="space-y-2">
                  {CANCEL_REASONS.map((reason) => (
                    <label key={reason} className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 border-2 flex items-center justify-center ${cancelReason === reason ? 'border-primary bg-primary' : 'border-surface-bright bg-surface'}`}>
                        {cancelReason === reason && <div className="w-2.5 h-2.5 bg-on-primary"></div>}
                      </div>
                      <input 
                        type="radio" 
                        name="cancelReason" 
                        value={reason} 
                        className="hidden" 
                        onChange={(e) => setCancelReason(e.target.value)}
                        checked={cancelReason === reason}
                      />
                      <span className="text-[14px] font-bold text-on-surface">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelReason === 'Other' && (
                <div className="mt-4">
                  <textarea
                    required
                    placeholder="Please provide a reason..."
                    value={cancelOtherReason}
                    onChange={(e) => setCancelOtherReason(e.target.value)}
                    className="w-full bg-surface-container-low border-2 border-surface-bright p-3 text-[14px] text-on-background outline-none focus:border-primary font-bold min-h-[100px]"
                  />
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-6 border-t-2 border-surface-bright">
                <button 
                  type="button" 
                  onClick={() => { setCancelModalOpen(false); setSelectedOrderForCancel(null); setCancelReason(''); setCancelOtherReason(''); }}
                  className="flex-1 border-2 border-surface-bright px-4 py-3 text-[14px] font-bold uppercase tracking-widest hover:border-on-surface transition-colors"
                >
                  KEEP ORDER
                </button>
                <button 
                  type="submit"
                  disabled={cancelSubmitting}
                  className="flex-1 bg-error text-on-error border-2 border-error px-4 py-3 text-[14px] font-bold uppercase tracking-widest shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] transition-all disabled:opacity-50"
                >
                  {cancelSubmitting ? 'SUBMITTING...' : 'CANCEL ORDER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
