import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    // Listen to products count
    const unsubscribeProducts = onSnapshot(query(collection(db, 'products')), (snapshot) => {
      setStats(prev => ({ ...prev, products: snapshot.size }));
    });

    // Listen to orders count and calculate revenue
    const unsubscribeOrders = onSnapshot(query(collection(db, 'orders')), (snapshot) => {
      let totalRev = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'Cancelled') {
          totalRev += (data.totalAmount || 0);
        }
      });
      setStats(prev => ({ ...prev, orders: snapshot.size, revenue: totalRev }));
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Dashboard Overview</h1>
          <p className="text-xs text-[#ffffff60] uppercase tracking-widest">Store Performance Metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-[#ffffff15] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ffffff15]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ffffff80]">Total Products</h3>
            <Package className="w-5 h-5 text-[#ff4e00]" />
          </div>
          <div className="pt-6">
            <p className="text-4xl font-black text-white">{stats.products}</p>
          </div>
        </div>

        <div className="bg-[#111] border border-[#ffffff15] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ffffff15]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ffffff80]">Total Orders</h3>
            <ShoppingCart className="w-5 h-5 text-[#ff4e00]" />
          </div>
          <div className="pt-6">
            <p className="text-4xl font-black text-white">{stats.orders}</p>
          </div>
        </div>
        
        <div className="bg-[#111] border border-[#ffffff15] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ffffff15]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ffffff80]">Total Revenue</h3>
            <TrendingUp className="w-5 h-5 text-[#ff4e00]" />
          </div>
          <div className="pt-6 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#ff4e00]">৳</span>
            <p className="text-4xl font-black text-white">{stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
