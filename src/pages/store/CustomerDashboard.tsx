import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCartStore } from '../../store/cartStore';

export default function CustomerDashboard() {
  const { user, loading: authLoading, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      if (!authLoading) setLoading(false);
      return;
    }
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
              <Link to="/account" className="text-[14px] font-black uppercase tracking-[0.1em] text-primary border-l-4 border-primary pl-[16px] py-[8px] bg-primary-container/10">
                ORDER HISTORY
              </Link>
              <button onClick={logout} className="text-[14px] font-bold uppercase tracking-[0.1em] text-error hover:text-on-error hover:bg-error-container text-left pl-[20px] py-[8px] transition-colors">
                LOGOUT
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h2 className="text-[32px] font-black uppercase tracking-tighter mb-[24px] text-on-surface leading-none border-b-2 border-surface-bright pb-4">ORDER HISTORY</h2>
          
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
              <Link to="/" className="inline-block mt-[24px] bg-primary text-on-primary px-[32px] py-[16px] text-[14px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_#5c1900] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#5c1900] transition-all">START SHOPPING</Link>
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
                        order.status === 'Delivered' ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]' :
                        order.status === 'Shipped' ? 'bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]' :
                        'bg-primary-container/10 text-primary border-primary'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-[12px] mb-[16px] font-bold uppercase tracking-widest">
                      {order.createdAt?.toDate().toLocaleDateString()}
                    </p>
                    <div className="space-y-[8px]">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="text-[14px] font-bold uppercase tracking-[0.1em] text-on-surface">{item.quantity}x {item.title}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-between border-t-2 md:border-t-0 border-surface-bright pt-[16px] md:pt-0">
                    <div className="text-[32px] font-black text-primary leading-none">৳{order.totalAmount}</div>
                    
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
        </div>
      </div>
    </div>
  );
}
