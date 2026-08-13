import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import CheckoutModal from './CheckoutModal';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, items, updateQuantity, removeFromCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  
  // We don't manage forms here anymore, just delivery zone for charge calculation
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'delivery');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDeliveryCharge(deliveryZone === 'inside' ? data.insideDhaka : data.outsideDhaka);
        } else {
          setDeliveryCharge(deliveryZone === 'inside' ? 60 : 120);
        }
      } catch (error) {
        setDeliveryCharge(deliveryZone === 'inside' ? 60 : 120);
      }
    };
    fetchDeliverySettings();
  }, [deliveryZone]);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal - discountAmount + deliveryCharge;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const q = query(collection(db, 'promoCodes'), where('code', '==', promoCode.trim().toUpperCase()), where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error('Invalid or expired promo code.');
        return;
      }

      const promoDoc = querySnapshot.docs[0].data();
      let discount = 0;
      if (promoDoc.type === 'percentage') {
        discount = (subtotal * promoDoc.value) / 100;
      } else {
        discount = promoDoc.value;
      }
      
      setDiscountAmount(discount);
      setPromoApplied(true);
      toast.success('Promo code applied!');
    } catch (error) {
      toast.error('Error applying promo code.');
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0a0a0a] border-l border-[#ffffff15] z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-[#ffffff15]">
          <h2 className="text-xl font-black tracking-widest uppercase">Your Cart</h2>
          <button onClick={toggleCart} className="text-[#ffffff60] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
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
                    <button onClick={applyPromo} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  ) : (
                    <button onClick={() => { setPromoApplied(false); setDiscountAmount(0); setPromoCode(''); }} className="bg-red-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery Zone Selection */}
              <div className="space-y-2 mt-4 border-t border-[#ffffff15] pt-4">
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

              <div className="grid grid-cols-3 gap-2 pt-4 opacity-50">
                <div className="flex flex-col items-center text-center space-y-1">
                  <ShieldCheck className="w-4 h-4 text-[#ff4e00]" />
                  <span className="text-[8px] uppercase font-bold">Secure</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <Truck className="w-4 h-4 text-[#ff4e00]" />
                  <span className="text-[8px] uppercase font-bold">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <RefreshCw className="w-4 h-4 text-[#ff4e00]" />
                  <span className="text-[8px] uppercase font-bold">Easy Returns</span>
                </div>
              </div>
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
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full bg-[#ff4e00] hover:bg-[#e64600] text-white p-4 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        subtotal={subtotal}
        discount={discountAmount}
        deliveryCharge={deliveryCharge}
      />
    </>
  );
}