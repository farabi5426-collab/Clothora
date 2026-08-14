import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, CreditCard, CheckCircle, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
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
        customerDetails: {
          name: formData.name || 'Guest',
          phone: formData.phone || '',
          address: formData.address || ''
        },
        items: items.map(item => ({
          id: item.id || '',
          title: item.title || 'Untitled',
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        subtotal: subtotal || 0,
        discount: discount || 0,
        deliveryCharge: deliveryCharge || 0,
        totalAmount: total || 0,
        paymentMethod: paymentMethod || 'cod',
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
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-[16px] md:p-[64px]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0e0e0e]/90 backdrop-blur-md"
          onClick={onClose}
        ></motion.div>
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-surface border-2 border-surface-bright shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]"
        >
          {step < 3 && (
            <div className="flex justify-between items-center p-[24px] border-b-2 border-surface-bright bg-surface-container-low">
              <div>
                <h2 className="text-[32px] font-black uppercase tracking-tighter text-on-surface leading-none">CHECKOUT</h2>
                <p className="text-[14px] text-primary font-bold uppercase tracking-[0.1em] mt-1">STEP {step} OF 2</p>
              </div>
              <button onClick={onClose} className="text-on-surface hover:text-primary transition-colors flex items-center justify-center w-[40px] h-[40px] bg-surface-container-high border-2 border-surface-bright hover:bg-surface-bright">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          <div className="p-[24px] overflow-y-auto">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-[24px]">
                <div className="space-y-[16px]">
                  <h3 className="font-bold uppercase tracking-[0.1em] text-[16px] text-on-surface flex items-center gap-2 border-b-2 border-surface-bright pb-2">
                    <User className="w-5 h-5 text-primary" /> DELIVERY DETAILS
                  </h3>
                  <input required placeholder="FULL NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme" />
                  <input required placeholder="PHONE NUMBER" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme" />
                  <textarea required placeholder="DETAILED ADDRESS" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none resize-none transition-colors uppercase rounded-theme" />
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-primary text-on-primary p-[16px] text-[16px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] transition-all">
                  CONTINUE TO PAYMENT
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-[24px]">
                <h3 className="font-bold uppercase tracking-[0.1em] text-[16px] text-on-surface mb-[16px] border-b-2 border-surface-bright pb-2">
                  SELECT PAYMENT METHOD
                </h3>
                
                <div className="space-y-[16px]">
                  <label className={`flex items-start gap-[16px] p-[16px] border-2 cursor-pointer transition-colors rounded-theme ${paymentMethod === 'cod' ? 'border-primary bg-primary-container/10 shadow-[4px_4px_0px_var(--color-primary)]' : 'border-surface-bright bg-surface'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 accent-primary w-5 h-5" />
                    <div>
                      <div className="font-black uppercase text-[16px] flex items-center gap-2 text-on-surface"><Truck className="w-5 h-5 text-primary" /> CASH ON DELIVERY</div>
                      <p className="text-[12px] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">PAY WITH CASH WHEN YOUR ORDER IS DELIVERED.</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start gap-[16px] p-[16px] border-2 cursor-pointer transition-colors rounded-theme ${paymentMethod === 'digital' ? 'border-primary bg-primary-container/10 shadow-[4px_4px_0px_var(--color-primary)]' : 'border-surface-bright bg-surface'}`}>
                    <input type="radio" name="payment" value="digital" checked={paymentMethod === 'digital'} onChange={() => setPaymentMethod('digital')} className="mt-1 accent-primary w-5 h-5" />
                    <div>
                      <div className="font-black uppercase text-[16px] flex items-center gap-2 text-on-surface"><CreditCard className="w-5 h-5 text-primary" /> DIGITAL PAYMENT</div>
                      <p className="text-[12px] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">PAY SECURELY VIA BKASH, NAGAD, OR CREDIT CARD.</p>
                    </div>
                  </label>
                </div>

                <div className="bg-surface-container border-2 border-surface-bright p-[24px] space-y-[8px] text-[14px]">
                  <div className="flex justify-between font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                    <span>SUBTOTAL</span>
                    <span>৳{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-bold text-[#4ade80] uppercase tracking-[0.1em]">
                      <span>DISCOUNT</span>
                      <span>-৳{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                    <span>DELIVERY</span>
                    <span>৳{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-on-surface font-black text-[24px] uppercase pt-[16px] mt-[16px] border-t-2 border-surface-bright">
                    <span>TOTAL</span>
                    <span className="text-primary">৳ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-[16px]">
                  <button onClick={() => setStep(1)} className="px-[32px] py-[16px] border-2 border-surface-bright text-on-surface hover:bg-surface-bright text-[16px] font-black uppercase tracking-[0.1em] transition-colors">
                    BACK
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-primary text-on-primary p-[16px] text-[16px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] transition-all disabled:opacity-50">
                    {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-[48px]">
                <div className="w-[120px] h-[120px] mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-[24px] border-4 border-primary">
                  <CheckCircle className="w-[64px] h-[64px] text-primary" />
                </div>
                <h3 className="text-[48px] font-black uppercase tracking-tighter mb-[16px] leading-none">ORDER CONFIRMED!</h3>
                <p className="text-on-surface-variant text-[16px] font-bold uppercase tracking-widest mb-[48px] max-w-sm mx-auto">THANK YOU FOR SHOPPING WITH US. YOUR BRUTAL STREETWEAR IS ON THE WAY.</p>
                <button onClick={() => { onClose(); window.location.href = '/account'; }} className="bg-primary text-on-primary hover:bg-primary-container px-[48px] py-[24px] font-black uppercase tracking-[0.1em] text-[16px] shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] transition-all">
                  TRACK ORDER
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
