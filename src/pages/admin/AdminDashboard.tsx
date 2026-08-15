import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    netProfit: 0
  });

  useEffect(() => {
    // Listen to products count
    const unsubscribeProducts = onSnapshot(query(collection(db, 'products')), (snapshot) => {
      setStats(prev => ({ ...prev, products: snapshot.size }));
    });

    // Listen to orders count, calculate revenue and net profit
    const unsubscribeOrders = onSnapshot(query(collection(db, 'orders')), (snapshot) => {
      let totalRev = 0;
      let totalCost = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'Cancelled') {
          totalRev += (data.totalAmount || 0);
          const itemsCost = (data.items || []).reduce((sum: number, item: any) => sum + ((item.costPrice || 0) * (item.quantity || 1)), 0);
          totalCost += itemsCost;
        }
      });
      setStats(prev => ({ ...prev, orders: snapshot.size, revenue: totalRev, netProfit: totalRev - totalCost }));
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
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Store Performance Metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Products</h3>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="pt-6">
            <p className="text-4xl font-black text-on-background">{stats.products}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Orders</h3>
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <div className="pt-6">
            <p className="text-4xl font-black text-on-background">{stats.orders}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Revenue</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="pt-6 flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-500">৳</span>
            <p className="text-4xl font-black text-on-background">{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Net Profit</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="pt-6 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">৳</span>
            <p className="text-4xl font-black text-on-background">{stats.netProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
