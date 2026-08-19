import React, { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function TrackOrder() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError('');
    setOrders([]);
    setSearched(true);

    try {
      const q = query(collection(db, 'orders'), where('customerDetails.phone', '==', phone.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by createdAt descending locally since we might not have a composite index
        fetchedOrders.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });
        setOrders(fetchedOrders);
      } else {
        setError('No orders found for this phone number.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching your orders.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Package className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-black uppercase tracking-tighter text-on-background mb-4">Track Your Order</h1>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest">Enter your phone number to see current status</p>
        </div>

        <div className="bg-surface border-2 border-surface-bright p-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="tel"
              placeholder="PHONE NUMBER (e.g. 017XXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-surface-container-low border-2 border-surface-bright p-4 text-sm font-bold uppercase tracking-[0.1em] text-on-background outline-none focus:border-primary transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-on-primary px-8 py-4 font-black uppercase tracking-[0.1em] hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'SEARCHING...' : <><Search className="w-5 h-5" /> TRACK</>}
            </button>
          </form>

          {error && (
            <div className="bg-error/10 border-2 border-error p-4 text-center">
              <p className="text-error font-bold uppercase tracking-widest text-sm">{error}</p>
            </div>
          )}

          {!loading && searched && orders.length === 0 && !error && (
            <div className="text-center p-8 border-2 border-dashed border-surface-bright">
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">No recent orders found</p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="space-y-8">
              {orders.map((order, idx) => (
                <div key={order.id} className="border-t-2 border-surface-bright pt-8 mt-8 first:border-t-0 first:pt-0 first:mt-0">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black uppercase tracking-widest text-on-background">Order Details</h2>
                    <span className={`px-4 py-2 text-xs font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-primary/20 text-primary'}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                  
                  <div className="space-y-4 text-sm font-bold uppercase tracking-wide text-on-surface-variant">
                    <div className="flex justify-between border-b border-surface-bright pb-2">
                      <span>Order ID</span>
                      <span className="text-on-background">{order.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-surface-bright pb-2">
                      <span>Date</span>
                      <span className="text-on-background">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-surface-bright pb-2">
                      <span>Total Amount</span>
                      <span className="text-primary">৳ {order.totalAmount}</span>
                    </div>
                    {order.deliveryCharge !== undefined && (
                      <div className="flex justify-between border-b border-surface-bright pb-2 items-center">
                        <span className="flex items-center gap-2">Delivery Charge {order.bkashDetails?.isPaymentVerified && <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-widest">PAID</span>}</span>
                        <span className="text-on-background">{order.deliveryCharge === 0 ? 'FREE' : `৳${order.deliveryCharge}`}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-surface-bright pb-2">
                      <span>Payment Method</span>
                      <span className="text-on-background">{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Items</h3>
                    <div className="space-y-4">
                      {order.items?.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="flex gap-4 items-center bg-surface-container p-4">
                          {item.imageUrl ? (
                             <img src={item.selectedColor || item.imageUrl} alt={item.title} className="w-16 h-16 object-cover border border-surface-bright" />
                          ) : (
                             <div className="w-16 h-16 bg-surface-bright flex items-center justify-center">
                               <Package className="w-6 h-6 text-on-surface-variant" />
                             </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-on-background line-clamp-1">{item.title}</p>
                            <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                            {(item.selectedSize || item.selectedColor) && (
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
                                {item.selectedSize && `Size: ${item.selectedSize} `}
                                {item.selectedColor && `Color: Yes`}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">৳ {item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
