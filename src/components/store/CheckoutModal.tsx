import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, CreditCard, CheckCircle, User, Upload } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import districtsData from '../../data/bd-districts.json';
import upazilasData from '../../data/bd-upazilas.json';

const districts = districtsData as any[];
const upazilas = upazilasData as any[];

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
  const [requireDistrictUpazila, setRequireDistrictUpazila] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [bkashTrxId, setBkashTrxId] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    districtId: '',
    upazilaId: '',
    address: ''
  });

  const total = subtotal - discount + deliveryCharge;

  useEffect(() => {
    const fetchSettingsAndProfile = async () => {
      if (isOpen) {
        try {
          const configDoc = await getDoc(doc(db, 'settings', 'storeConfig'));
          if (configDoc.exists() && configDoc.data().requireDistrictUpazila !== undefined) {
            setRequireDistrictUpazila(configDoc.data().requireDistrictUpazila);
          }
        } catch (e) {
          console.error('Error fetching settings', e);
        }

        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setFormData(prev => {
                const dId = districts.find(d => d.name === data.district)?.id || prev.districtId;
                const uId = upazilas.find(u => u.name === data.upazila)?.id || prev.upazilaId;
                return {
                  ...prev,
                  name: data.name || prev.name,
                  phone: data.phone || prev.phone,
                  districtId: dId,
                  upazilaId: uId,
                  address: data.address || prev.address
                };
              });
            }
          } catch (e) {
            console.error('Error fetching profile for checkout', e);
          }
        }
      }
    };
    fetchSettingsAndProfile();
  }, [user, isOpen]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isDistrictUpazilaValid = requireDistrictUpazila ? (formData.districtId && formData.upazilaId) : true;
    if (!formData.name || !formData.phone || !isDistrictUpazilaValid || !formData.address) {
      toast.error('Please fill in all required delivery details.');
      return;
    }

    if (!bkashTrxId) {
      toast.error('Please provide the Transaction ID or the Sender bKash Number.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      

      const districtName = districts.find(d => d.id === formData.districtId)?.name || '';
      const upazilaName = upazilas.find(u => u.id === formData.upazilaId)?.name || '';

      await addDoc(collection(db, 'orders'), {
        customerId: user?.uid || 'guest',
        customerDetails: {
          name: formData.name || 'Guest',
          phone: formData.phone || '',
          district: districtName,
          upazila: upazilaName,
          address: formData.address || ''
        },
        items: items.map(item => ({
          id: item.id || '',
          title: item.title || 'Untitled',
          quantity: item.quantity || 1,
          price: item.price || 0,
          imageUrl: item.imageUrl || '',
          selectedSize: item.selectedSize || '',
          selectedColor: item.selectedColor || '',
        })),
        subtotal: subtotal || 0,
        discount: discount || 0,
        deliveryCharge: deliveryCharge || 0,
        totalAmount: total || 0,
        paymentMethod: paymentMethod || 'cod',
        bkashDetails: {
          transactionId: bkashTrxId,
          advanceAmount: paymentMethod === 'cod' ? (deliveryCharge === 0 ? 50 : deliveryCharge) : total
        },
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
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
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
                  
                  {requireDistrictUpazila && (
                    <>
                      <div className="relative">
                        <select required value={formData.districtId} onChange={e => setFormData({...formData, districtId: e.target.value, upazilaId: ''})} className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme appearance-none cursor-pointer">
                          <option value="" disabled>SELECT DISTRICT</option>
                          {districts.map(d => (
                            <option key={d.id} value={d.id}>{d.name} - {d.bn_name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                      <div className="relative">
                        <select required value={formData.upazilaId} onChange={e => setFormData({...formData, upazilaId: e.target.value})} disabled={!formData.districtId} className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme appearance-none cursor-pointer disabled:opacity-50">
                          <option value="" disabled>SELECT UPAZILA / THANA</option>
                          {upazilas.filter(u => u.district_id === formData.districtId).map(u => (
                            <option key={u.id} value={u.id}>{u.name} - {u.bn_name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </>
                  )}
                  
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
                      <p className="text-[12px] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">PAY ADVANCE TO CONFIRM BOOKING.</p>
                    </div>
                  </label>
                  
                  {paymentMethod === 'cod' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                      <div className="p-[16px] bg-surface-container-low border-2 border-surface-bright rounded-theme space-y-[16px]">
                        <p className="text-[14px] font-bold text-on-surface leading-relaxed text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
                          আপনার পছন্দের প্রোডাক্টটির বুকিং দ্রুত নিশ্চিত করতে শুধুমাত্র ডেলিভারি চার্জটি অগ্রিম প্রদান করার অনুরোধ করা হচ্ছে। স্টক ফুরিয়ে যাওয়ার আগেই আপনার অর্ডারটি কনফার্ম করে ফেলুন! সম্পূর্ণ প্রোডাক্টের মূল্য প্রোডাক্ট হাতে পাওয়ার পর দেওয়ার সুযোগ রয়েছে।
                        </p>
                        <p className="text-[12px] font-bold text-on-surface uppercase tracking-widest leading-relaxed">
                          Please send <span className="text-primary text-[14px]">৳ {deliveryCharge === 0 ? 50 : deliveryCharge}</span> as advance to our bKash Personal Number: <br/>
                          <span className="text-[18px] text-primary font-black mt-2 inline-block">01878576650</span>
                        </p>
                        
                        <p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-widest mb-[8px]">
                          After sending money, provide the Transaction ID OR the bKash number you sent money from:
                        </p>
                        
                        <input 
                          placeholder="TRANSACTION ID OR SENDER NUMBER" 
                          value={bkashTrxId} 
                          onChange={e => setBkashTrxId(e.target.value)} 
                          className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme" 
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="space-y-[16px]">
                  <label className={`flex items-start gap-[16px] p-[16px] border-2 cursor-pointer transition-colors rounded-theme ${paymentMethod === 'bkash' ? 'border-primary bg-primary-container/10 shadow-[4px_4px_0px_var(--color-primary)]' : 'border-surface-bright bg-surface'}`}>
                    <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="mt-1 accent-primary w-5 h-5" />
                    <div>
                      <div className="font-black uppercase text-[16px] flex items-center gap-2 text-on-surface"><CreditCard className="w-5 h-5 text-primary" /> PAY WITH BKASH</div>
                      <p className="text-[12px] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">SEND MONEY TO 01878576650</p>
                    </div>
                  </label>
                  
                  {paymentMethod === 'bkash' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                      <div className="p-[16px] bg-surface-container-low border-2 border-surface-bright rounded-theme space-y-[16px]">
                        <p className="text-[12px] font-bold text-on-surface uppercase tracking-widest leading-relaxed">
                          Please send exactly <span className="text-primary text-[14px]">৳ {total.toFixed(2)}</span> to our bKash Personal Number: <br/>
                          <span className="text-[18px] text-primary font-black mt-2 inline-block">01878576650</span>
                        </p>
                        
                        <p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-widest mb-[8px]">
                          After sending money, provide the Transaction ID OR the bKash number you sent money from:
                        </p>
                        
                        <input 
                          placeholder="TRANSACTION ID OR SENDER NUMBER" 
                          value={bkashTrxId} 
                          onChange={e => setBkashTrxId(e.target.value)} 
                          className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme" 
                        />
                      </div>
                    </motion.div>
                  )}
                  </div>
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
                    <span>{deliveryCharge === 0 ? "FREE" : `৳${deliveryCharge}`}</span>
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
