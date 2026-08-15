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
      if (newStatus === 'Shipped') {
        const trackingId = window.prompt("Enter Tracking URL/ID for this shipment:");
        if (trackingId === null) return; // User cancelled
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus, trackingId });
      } else {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      }
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
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Customer purchases</p>
        </div>
      </div>
      
      <div className="bg-surface-container-lowest border border-outline-variant overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Order ID</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Customer Details</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Items</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors">
                <td className="p-4 text-xs uppercase tracking-widest text-on-surface-variant font-mono">{order.id.slice(0, 8)}...</td>
                <td className="p-4">
                  <div className="text-sm font-bold uppercase mb-1">{order.customerDetails?.name || 'Unknown'}</div>
                  <div className="text-xs text-on-surface-variant">{order.customerDetails?.phone}</div>
                  <div className="text-xs text-on-surface-variant max-w-[200px] truncate" title={order.customerDetails?.address}>{order.customerDetails?.address}</div>
                </td>
                <td className="p-4">
                  <div className="text-xs text-on-surface-variant max-w-[200px]">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="truncate">{item.quantity}x {item.title}</div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-primary font-bold">৳ {order.totalAmount}</td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-surface-container-low border border-outline-variant p-2 text-xs font-bold uppercase tracking-widest text-on-background focus:border-primary outline-none cursor-pointer w-full mb-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {order.status === 'Shipped' && (order as any).trackingId && (
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-widest truncate max-w-[150px]" title={(order as any).trackingId}>
                      TRK: {(order as any).trackingId}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
