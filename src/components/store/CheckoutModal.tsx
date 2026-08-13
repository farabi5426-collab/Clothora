import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { X, MapPin, Phone, User, CheckCircle, Truck, CreditCard } from 'lucide-react';
import { db } from '../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  subtotal, 
  discount, 
  deliveryCharge 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  subtotal: number;
  discount: number;
  deliveryCharge: number;
}) {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'digital'>('cod');

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    address: ''
  });

  const total = subtotal - discount + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all delivery details.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customerId: user?.uid || 'guest',
        customerDetails: formData,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          costPrice: item.costPrice || 0
        })),
        subtotal,
        discount,
        deliveryCharge,
        totalAmount: total,
        paymentMethod,
        status: 'Pending',
        createdAt: new Date()
      });

      toast.success('Order Placed Successfully!');
      clearCart();
      setStep(3); // Success Step
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-[#111] border border-[#ffffff15] shadow-2xl flex flex-col max-h-[90vh]"
        >
          {step < 3 && (
            <div className="flex justify-between items-center p-6 border-b border-[#ffffff15]">
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest">Checkout</h2>
                <p className="text-xs text-[#ffffff60] uppercase tracking-widest">Step {step} of 2</p>
              </div>
              <button onClick={onClose} className="text-[#ffffff60] hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="p-6 overflow-y-auto">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest text-sm text-[#ffffff80] flex items-center gap-2">
                    <User className="w-4 h-4" /> Delivery Details
                  </h3>
                  <input required placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-4 text-sm text-white focus:border-[#ff4e00] outline-none transition-colors" />
                  <input required placeholder="Phone Number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-4 text-sm text-white focus:border-[#ff4e00] outline-none transition-colors" />
                  <textarea required placeholder="Detailed Address" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-4 text-sm text-white focus:border-[#ff4e00] outline-none resize-none transition-colors" />
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-[#ff4e00] hover:bg-[#e64600] text-white p-4 text-xs font-bold uppercase tracking-widest transition-colors">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="font-bold uppercase tracking-widest text-sm text-[#ffffff80] mb-4">Select Payment Method</h3>
                
                <div className="space-y-3">
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#ff4e00] bg-[#ff4e00]/5' : 'border-[#ffffff15] bg-[#1a1a1a]'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1" />
                    <div>
                      <div className="font-bold uppercase text-sm flex items-center gap-2"><Truck className="w-4 h-4 text-[#ff4e00]" /> Cash on Delivery</div>
                      <p className="text-xs text-[#ffffff60] mt-1">Pay with cash when your order is delivered.</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'digital' ? 'border-[#ff4e00] bg-[#ff4e00]/5' : 'border-[#ffffff15] bg-[#1a1a1a]'}`}>
                    <input type="radio" name="payment" value="digital" checked={paymentMethod === 'digital'} onChange={() => setPaymentMethod('digital')} className="mt-1" />
                    <div>
                      <div className="font-bold uppercase text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#ff4e00]" /> Digital Payment</div>
                      <p className="text-xs text-[#ffffff60] mt-1">Pay securely via bKash, Nagad, or Credit Card.</p>
                    </div>
                  </label>
                </div>

                <div className="bg-[#1a1a1a] border border-[#ffffff15] p-4 space-y-2 text-sm mt-6">
                  <div className="flex justify-between text-[#ffffff80]">
                    <span>Total Amount</span>
                    <span className="font-black text-white text-lg tracking-tighter">৳ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-4 border border-[#ffffff15] text-[#ffffff60] hover:text-white hover:bg-[#ffffff0a] text-xs font-bold uppercase tracking-widest transition-colors">
                    Back
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-[#ff4e00] hover:bg-[#e64600] text-white p-4 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-20 h-20 text-[#ff4e00] mx-auto mb-6" />
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Order Confirmed!</h3>
                <p className="text-[#ffffff60] text-sm mb-8">Thank you for shopping with us. Your brutal streetwear is on the way.</p>
                <button onClick={() => { onClose(); window.location.href = '/account'; }} className="bg-white text-black hover:bg-[#ff4e00] hover:text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors">
                  Track Order
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}