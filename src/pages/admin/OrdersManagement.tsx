import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: any;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => ords.push({ id: doc.id, ...doc.data() } as Order));
      setOrders(ords);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Orders</h1>
          <p className="text-xs text-[#ffffff60] uppercase tracking-widest">Customer purchases</p>
        </div>
      </div>
      
      <div className="bg-[#111] border border-[#ffffff15] overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#ffffff15]">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Order ID</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Customer Details</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Items</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Total</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#ffffff0a] hover:bg-[#ffffff05] transition-colors">
                <td className="p-4 text-xs uppercase tracking-widest text-[#ffffff80] font-mono">{order.id.slice(0, 8)}...</td>
                <td className="p-4">
                  <div className="text-sm font-bold uppercase mb-1">{order.customerDetails?.name || 'Unknown'}</div>
                  <div className="text-xs text-[#ffffff60]">{order.customerDetails?.phone}</div>
                  <div className="text-xs text-[#ffffff60] max-w-[200px] truncate" title={order.customerDetails?.address}>{order.customerDetails?.address}</div>
                </td>
                <td className="p-4">
                  <div className="text-xs text-[#ffffff80] max-w-[200px]">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="truncate">{item.quantity}x {item.title}</div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-[#ff4e00] font-bold">৳ {order.totalAmount}</td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-[#1a1a1a] border border-[#ffffff15] p-2 text-xs font-bold uppercase tracking-widest text-white focus:border-[#ff4e00] outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#ffffff60] uppercase tracking-widest text-xs">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
