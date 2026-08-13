import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function CustomerDashboard() {
  const { user, loading: authLoading } = useAuthStore();
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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#ffffff60] hover:text-[#ff4e00] transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">My Dashboard</h1>
        <p className="text-[#ffffff60] text-sm uppercase tracking-widest mb-12">Welcome back, {user?.displayName || user?.email}</p>

        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-[#ffffff15] pb-4">Order History</h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-[#111] animate-pulse border border-[#ffffff0a]"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-[#111] border border-[#ffffff15]">
            <Package className="w-12 h-12 text-[#ffffff20] mx-auto mb-4" />
            <p className="text-[#ffffff60] font-bold uppercase tracking-widest text-xs">No orders placed yet.</p>
            <Link to="/" className="inline-block mt-6 bg-[#ff4e00] hover:bg-[#e64600] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={order.id} 
                className="bg-[#111] border border-[#ffffff15] p-6 flex flex-col md:flex-row gap-6 justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#ffffff60] text-xs font-bold uppercase tracking-widest font-mono">Order #{order.id.slice(0, 8)}</span>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-[#ff4e00]/10 text-[#ff4e00]'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[#ffffff40] text-xs mb-4">
                    {order.createdAt?.toDate().toLocaleDateString()}
                  </p>
                  <div className="space-y-1">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="text-sm font-bold uppercase">{item.quantity}x {item.title}</div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 border-[#ffffff15] pt-4 md:pt-0">
                  <div className="text-2xl font-black text-[#ff4e00]">৳ {order.totalAmount}</div>
                  
                  {order.status === 'Shipped' && order.trackingId && (
                    <div className="mt-4 bg-[#ffffff0a] p-3 border border-[#ffffff15]">
                      <p className="text-[10px] text-[#ffffff60] uppercase tracking-widest mb-1">Tracking ID / URL</p>
                      <a href={order.trackingId.startsWith('http') ? order.trackingId : `#`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-[#ff4e00] transition-colors break-all">
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
  );
}
