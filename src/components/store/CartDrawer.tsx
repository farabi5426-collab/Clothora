import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';

export default function CartDrawer() {
  const { user } = useAuthStore();
  const { items, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');
  const [deliverySettings, setDeliverySettings] = useState({ insideDhaka: 60, outsideDhaka: 120 });
  
  // Checkout form
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // Fetch delivery settings
    const fetchDelivery = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'delivery'));
        if (docSnap.exists()) {
          setDeliverySettings({
            insideDhaka: docSnap.data().insideDhaka || 60,
            outsideDhaka: docSnap.data().outsideDhaka || 120
          });
        }
      } catch (error: any) {
        console.warn("Failed to load delivery settings (client might be offline):", error);
      }
    };
    fetchDelivery();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = deliveryZone === 'inside' ? deliverySettings.insideDhaka : deliverySettings.outsideDhaka;
  const total = Math.max(0, subtotal - discountAmount) + deliveryCharge;

  const applyPromo = async () => {
    setPromoError('');
    if (!promoCode.trim()) return;

    try {
      const q = query(collection(db, 'promoCodes'), where('code', '==', promoCode.toUpperCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setPromoError('Invalid promo code');
        return;
      }

      const promoDoc = querySnapshot.docs[0].data();
      
      if (new Date(promoDoc.expiryDate) < new Date()) {
        setPromoError('Promo code expired');
        return;
      }
      
      if (subtotal < promoDoc.minOrderAmount) {
        setPromoError(`Minimum order amount is ৳${promoDoc.minOrderAmount}`);
        return;
      }

      const discount = (subtotal * promoDoc.discountPercent) / 100;
      setDiscountAmount(discount);
      setPromoApplied(true);
      setPromoError('');
    } catch (error) {
      console.error('Promo error:', error);
      setPromoError('Error applying code');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderData = {
        customerId: user?.uid || 'guest',
        customerDetails: { name, phone, address },
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        discountAmount,
        deliveryCharge,
        totalAmount: total,
        status: 'Pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" onClick={toggleCart} />
      
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-l border-[#ffffff15] shadow-2xl z-50 flex flex-col transform transition-transform">
        <div className="p-6 border-b border-[#ffffff15] flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#ff4e00]" />
            <h2 className="font-black uppercase tracking-widest text-lg">Your Cart</h2>
          </div>
          <button onClick={toggleCart} className="text-[#ffffff60] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 flex items-center justify-center mb-6 border border-green-500/20">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Order Placed!</h3>
            <p className="text-[#ffffff80] text-sm mb-8">Thank you for your purchase. We will contact you shortly to confirm delivery.</p>
            <button 
              onClick={() => { setOrderSuccess(false); toggleCart(); }}
              className="bg-[#ff4e00] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#e64600] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#ffffff60]">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm font-bold uppercase tracking-widest">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-6 space-y-6">
              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-[#111] p-4 border border-[#ffffff0a]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover border border-[#ffffff15]" />
                    ) : (
                      <div className="w-20 h-20 bg-[#1a1a1a] border border-[#ffffff15]" />
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold uppercase text-sm leading-tight mb-1">{item.title}</h4>
                        <p className="text-[#ff4e00] font-bold text-sm">৳ {item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#ffffff15]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-[#ffffff60] hover:text-white">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-[#ffffff60] hover:text-white">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-[#ffffff40] hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="bg-[#111] p-4 border border-[#ffffff0a] space-y-3">
                <label className="block text-xs uppercase tracking-widest font-bold text-[#ffffff80]">Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    placeholder="ENTER CODE" 
                    className="flex-1 bg-[#1a1a1a] border border-[#ffffff15] px-3 py-2 text-xs uppercase font-bold text-white outline-none focus:border-[#ff4e00]"
                  />
                  {!promoApplied ? (
                    <button onClick={applyPromo} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-200">
                      Apply
                    </button>
                  ) : (
                    <button onClick={() => { setPromoApplied(false); setDiscountAmount(0); setPromoCode(''); }} className="bg-red-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                      Remove
                    </button>
                  )}
                </div>
                {promoError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{promoError}</p>}
                {promoApplied && <p className="text-green-500 text-xs font-bold uppercase tracking-widest">Code Applied Successfully!</p>}
              </div>

              {/* Checkout Form */}
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-[#ffffff15]">
                <h3 className="font-bold uppercase tracking-widest text-sm text-[#ffffff80] mb-2">Delivery Details</h3>
                <input required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#111] border border-[#ffffff15] p-3 text-sm text-white focus:border-[#ff4e00] outline-none" />
                <input required placeholder="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#111] border border-[#ffffff15] p-3 text-sm text-white focus:border-[#ff4e00] outline-none" />
                <textarea required placeholder="Detailed Address" rows={3} value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-[#111] border border-[#ffffff15] p-3 text-sm text-white focus:border-[#ff4e00] outline-none resize-none" />
                
                <div className="space-y-2 mt-4">
                  <label className="block text-xs uppercase tracking-widest font-bold text-[#ffffff80]">Delivery Zone</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setDeliveryZone('inside')} className={`p-3 text-xs font-bold uppercase tracking-widest border transition-colors ${deliveryZone === 'inside' ? 'bg-[#ff4e00]/10 border-[#ff4e00] text-[#ff4e00]' : 'bg-[#111] border-[#ffffff15] text-[#ffffff60]'}`}>
                      Inside Dhaka
                    </button>
                    <button type="button" onClick={() => setDeliveryZone('outside')} className={`p-3 text-xs font-bold uppercase tracking-widest border transition-colors ${deliveryZone === 'outside' ? 'bg-[#ff4e00]/10 border-[#ff4e00] text-[#ff4e00]' : 'bg-[#111] border-[#ffffff15] text-[#ffffff60]'}`}>
                      Outside Dhaka
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Total & Submit */}
            <div className="bg-[#111] border-t border-[#ffffff15] p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#ffffff80]">
                  <span>Subtotal</span>
                  <span>৳ {subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>- ৳ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#ffffff80]">
                  <span>Delivery Charge</span>
                  <span>৳ {deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-black text-xl text-white pt-2 border-t border-[#ffffff15]">
                  <span>Total</span>
                  <span className="text-[#ff4e00]">৳ {total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-[#ff4e00] hover:bg-[#e64600] text-white p-4 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
