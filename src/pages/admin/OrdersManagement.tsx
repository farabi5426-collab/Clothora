import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Package, User, CreditCard, Receipt, Printer, Image as ImageIcon } from 'lucide-react';
import { printInvoice, downloadInvoiceImage } from '../../lib/printInvoice';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  selectedSize?: string;
  selectedColor?: string;
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
  subtotal?: number;
  discount?: number;
  deliveryCharge?: number;
  totalAmount: number;
  paymentMethod?: string;
  bkashDetails?: {
    transactionId: string;
  };
  status: string;
  trackingId?: string;
  createdAt: any;
  cancellationRequest?: {
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: any;
  };
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => ords.push({ id: doc.id, ...doc.data() } as Order));
      setOrders(ords);
    });
    return () => unsubscribe();
  }, []);

  
  const handleCancelDecision = async (orderId: string, decision: 'approve' | 'reject') => {
    try {
      if (decision === 'approve') {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Cancelled',
          'cancellationRequest.status': 'approved'
        });
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder, 
            status: 'Cancelled', 
            cancellationRequest: { ...selectedOrder.cancellationRequest!, status: 'approved' }
          });
        }
      } else {
        await updateDoc(doc(db, 'orders', orderId), {
          'cancellationRequest.status': 'rejected'
        });
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder, 
            cancellationRequest: { ...selectedOrder.cancellationRequest!, status: 'rejected' }
          });
        }
      }
    } catch (error) {
      console.error('Error updating cancellation request:', error);
      alert('Failed to update cancellation request.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      if (newStatus === 'Shipped') {
        const trackingId = window.prompt("Enter Tracking URL/ID for this shipment:");
        if (trackingId === null) return; // User cancelled
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus, trackingId });
        
        if (selectedOrder && selectedOrder.id === orderId) {
           setSelectedOrder({...selectedOrder, status: newStatus, trackingId});
        }
      } else {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        
        if (selectedOrder && selectedOrder.id === orderId) {
           setSelectedOrder({...selectedOrder, status: newStatus});
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown Date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Customer</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Payment</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors">
                <td className="p-4 text-xs uppercase tracking-widest text-on-surface-variant font-mono">{order.id.slice(0, 8)}...</td>
                <td className="p-4">
                  <div className="text-sm font-bold uppercase mb-1">{order.customerDetails?.name || 'Unknown'}</div>
                  <div className="text-xs text-on-surface-variant">{order.customerDetails?.phone}</div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-bold uppercase text-on-surface mb-1">
                    {order.paymentMethod === 'bkash' ? 'bKash' : 'Cash On Delivery'}
                  </div>
                  {order.paymentMethod === 'bkash' && order.bkashDetails && (
                    <div className="flex flex-col gap-1 text-[10px]">
                      {order.bkashDetails.transactionId && (
                        <div className="text-primary font-bold">TrxID/Num: {order.bkashDetails.transactionId}</div>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-4 text-primary font-bold">৳ {order.totalAmount}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-theme ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' : order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                   <button 
                     onClick={() => setSelectedOrder(order)}
                     className="text-xs font-bold uppercase tracking-widest bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-2 border-2 border-surface-bright transition-colors"
                   >
                     View Details
                   </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest border-2 border-surface-bright w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b-2 border-surface-bright flex items-center justify-between bg-surface">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Order Details</h2>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">ID: {selectedOrder.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => {
                    try {
                      setIsDownloadingImage(true);
                      await downloadInvoiceImage(selectedOrder);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsDownloadingImage(false);
                    }
                  }} 
                  disabled={isDownloadingImage}
                  className="p-2 bg-surface-container-highest text-on-surface border-2 border-surface-bright hover:bg-surface-bright transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50">
                    <ImageIcon className="w-4 h-4" /> {isDownloadingImage ? 'Generating...' : 'Download Image'}
                  </button>
                  <button onClick={() => printInvoice(selectedOrder)} className="p-2 bg-primary text-on-primary border-2 border-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-surface-container-high border-2 border-surface-bright hover:bg-surface-bright text-on-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-8">
                
                {/* Header Info */}
                {selectedOrder.cancellationRequest?.status === 'pending' && (
                  <div className="bg-error/10 border-2 border-error p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-error mb-1">Cancellation Request</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Reason: {selectedOrder.cancellationRequest.reason}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleCancelDecision(selectedOrder.id, 'reject')}
                        className="flex-1 md:flex-none border-2 border-error text-error px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-error/20 transition-colors"
                      >
                        REJECT
                      </button>
                      <button 
                        onClick={() => handleCancelDecision(selectedOrder.id, 'approve')}
                        className="flex-1 md:flex-none bg-error text-on-error border-2 border-error px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-error-container hover:text-on-error-container transition-colors"
                      >
                        APPROVE
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface border-2 border-surface-bright p-4">
                     <div className="flex items-center gap-2 text-primary mb-4 border-b-2 border-surface-bright pb-2">
                        <User className="w-4 h-4" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Customer Info</h3>
                     </div>
                     <div className="space-y-2 text-sm font-bold uppercase tracking-wide">
                        <p className="text-on-surface"><span className="text-on-surface-variant">Name:</span> {selectedOrder.customerDetails?.name || 'Unknown'}</p>
                        <p className="text-on-surface"><span className="text-on-surface-variant">Phone:</span> {selectedOrder.customerDetails?.phone || 'N/A'}</p>
                        <p className="text-on-surface"><span className="text-on-surface-variant">Address:</span> {selectedOrder.customerDetails?.address || 'N/A'}</p>
                     </div>
                  </div>
                  
                  <div className="bg-surface border-2 border-surface-bright p-4">
                     <div className="flex items-center gap-2 text-primary mb-4 border-b-2 border-surface-bright pb-2">
                        <CreditCard className="w-4 h-4" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Payment Info</h3>
                     </div>
                     <div className="space-y-2 text-sm font-bold uppercase tracking-wide">
                        <p className="text-on-surface">
                          <span className="text-on-surface-variant">Method:</span> {selectedOrder.paymentMethod === 'bkash' ? 'bKash' : 'Cash On Delivery'}
                        </p>
                        {selectedOrder.paymentMethod === 'bkash' && selectedOrder.bkashDetails && (
                          <p className="text-on-surface">
                            <span className="text-on-surface-variant">TrxID/Number:</span> {selectedOrder.bkashDetails.transactionId || 'N/A'}
                          </p>
                        )}
                        <p className="text-on-surface"><span className="text-on-surface-variant">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                     </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-surface border-2 border-surface-bright p-4">
                   <div className="flex items-center gap-2 text-primary mb-4 border-b-2 border-surface-bright pb-2">
                      <Package className="w-4 h-4" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Purchased Items</h3>
                   </div>
                   <div className="space-y-4">
                     {selectedOrder.items?.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center text-sm font-bold uppercase tracking-wide border-b border-surface-bright pb-3 last:border-0 last:pb-0">
                         <div className="flex items-center gap-4">
                           {item.imageUrl ? (
                             <img src={item.selectedColor || item.imageUrl} alt={item.title} className="w-12 h-12 object-cover border border-surface-bright" />
                           ) : (
                             <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center border border-surface-bright">
                               <Package className="w-5 h-5 text-on-surface-variant" />
                             </div>
                           )}
                           <span className="bg-surface-container-high px-2 py-1 text-xs">{item.quantity}x</span>
                           <div className="flex flex-col">
                             <span className="text-on-surface line-clamp-2 max-w-[200px] sm:max-w-[300px]">{item.title}</span>
                             {item.selectedSize && (
                               <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Size: {item.selectedSize}</span>
                             )}
                             {item.selectedColor && (
                               <div className="mt-1 flex items-center gap-1">
                                 <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Color:</span>
                                 <img src={item.selectedColor} className="w-6 h-8 object-cover border border-outline-variant" />
                               </div>
                             )}
                           </div>
                         </div>
                         <span className="text-on-surface whitespace-nowrap">৳ {item.price * item.quantity}</span>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Summary */}
                <div className="bg-surface border-2 border-surface-bright p-4">
                   <div className="flex items-center gap-2 text-primary mb-4 border-b-2 border-surface-bright pb-2">
                      <Receipt className="w-4 h-4" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Order Summary</h3>
                   </div>
                   <div className="space-y-2 text-sm font-bold uppercase tracking-wide">
                     <div className="flex justify-between text-on-surface-variant">
                       <span>Subtotal</span>
                       <span>৳ {selectedOrder.subtotal || selectedOrder.totalAmount}</span>
                     </div>
                     {selectedOrder.discount && selectedOrder.discount > 0 ? (
                       <div className="flex justify-between text-green-500">
                         <span>Discount</span>
                         <span>-৳ {selectedOrder.discount}</span>
                       </div>
                     ) : null}
                     <div className="flex justify-between text-on-surface-variant border-b border-surface-bright pb-2">
                       <span>Delivery</span>
                       <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `৳ ${selectedOrder.deliveryCharge || 0}`}</span>
                     </div>
                     <div className="flex justify-between text-lg text-primary pt-2">
                       <span>Total</span>
                       <span>৳ {selectedOrder.totalAmount}</span>
                     </div>
                   </div>
                </div>

                {/* Status Update */}
                <div className="bg-surface-container-low border-2 border-surface-bright p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                   <div className="flex flex-col">
                     <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Update Status</span>
                     <select 
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                        className="bg-surface border-2 border-surface-bright p-3 text-sm font-bold uppercase tracking-widest text-on-background focus:border-primary outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                   </div>
                   
                   {selectedOrder.trackingId && (
                     <div className="flex flex-col md:items-end mt-4 md:mt-0">
                       <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Tracking ID</span>
                       <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-2">{selectedOrder.trackingId}</span>
                     </div>
                   )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
