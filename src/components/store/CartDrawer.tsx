import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, items, updateQuantity, removeFromCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside' | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const deliveryCharge = deliveryZone === 'inside' ? 60 : deliveryZone === 'outside' ? 120 : 0;
  const finalTotal = total + deliveryCharge - discountAmount;

  const applyPromo = () => {
    if (!promoCode.trim()) return;
    try {
      if (promoCode.toUpperCase() === 'CLOTHORA10') {
        const discount = subtotal * 0.1;
        setDiscountAmount(discount);
        setPromoApplied(true);
        toast.success('Promo code applied successfully!');
      } else {
        toast.error('Invalid promo code');
      }
    } catch (error) {
      toast.error('Error applying promo code.');
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-surface border-l-2 border-surface-bright z-[110] transform transition-transform duration-300 ease-in-out flex flex-col shadow-[-8px_0_24px_rgba(0,0,0,0.5)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-[24px] border-b-2 border-surface-bright bg-surface-container-low">
          <h2 className="text-[32px] font-black tracking-tighter uppercase text-on-surface">YOUR CART</h2>
          <button onClick={toggleCart} className="text-on-surface hover:text-primary transition-colors flex items-center justify-center w-[40px] h-[40px] bg-surface-container-high border-2 border-surface-bright hover:bg-surface-bright">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-[48px] text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[64px] mb-[24px] opacity-50">shopping_bag</span>
            <p className="text-[16px] font-bold uppercase tracking-[0.1em]">YOUR CART IS EMPTY</p>
            <button onClick={toggleCart} className="mt-[24px] bg-primary text-on-primary px-[32px] py-[16px] font-bold uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] transition-all rounded-theme">
              START SHOPPING
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col bg-surface">
            <div className="flex-1 p-[24px] space-y-[24px]">
              {/* Items List */}
              <div className="space-y-[16px]">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-[16px] bg-surface-container border-2 border-surface-bright p-[16px] relative group rounded-theme">
                    <div className="w-[100px] h-[100px] bg-surface-container-highest border-2 border-surface-bright shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold uppercase text-[16px] leading-tight text-on-surface line-clamp-2">{item.title}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-on-surface-variant hover:text-error transition-colors shrink-0">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <p className="text-primary font-black text-[18px] mt-1">৳{item.price}</p>
                      
                      <div className="mt-auto flex items-center">
                        <div className="flex items-center bg-surface border-2 border-surface-bright">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-[32px] h-[32px] flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors">
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="text-[14px] font-bold w-[32px] text-center text-on-surface">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-[32px] h-[32px] flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="bg-surface-container border-2 border-surface-bright p-[16px] rounded-theme">
                <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">PROMO CODE</label>
                <div className="flex gap-[8px]">
                  <input 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    placeholder="ENTER CODE" 
                    className="flex-1 bg-surface border-2 border-surface-bright px-[16px] h-[48px] text-[14px] uppercase font-bold text-on-surface outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                  {!promoApplied ? (
                    <button onClick={applyPromo} className="bg-on-surface text-surface px-[24px] h-[48px] text-[14px] font-bold uppercase tracking-[0.1em] hover:bg-on-surface-variant transition-colors">
                      APPLY
                    </button>
                  ) : (
                    <button onClick={() => { setPromoApplied(false); setDiscountAmount(0); setPromoCode(''); }} className="bg-error text-on-error px-[24px] h-[48px] text-[14px] font-bold uppercase tracking-[0.1em] hover:bg-error-container transition-colors">
                      REMOVE
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery Zone Selection */}
              <div className="bg-surface-container border-2 border-surface-bright p-[16px] rounded-theme">
                <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">DELIVERY ZONE</label>
                <div className="grid grid-cols-2 gap-[8px]">
                  <button type="button" onClick={() => setDeliveryZone('inside')} className={`h-[48px] text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all ${deliveryZone === 'inside' ? 'bg-primary text-on-primary border-primary shadow-[2px_2px_0px_var(--color-on-primary)]' : 'bg-surface border-surface-bright text-on-surface hover:border-on-surface-variant'}`}>
                    INSIDE DHAKA
                  </button>
                  <button type="button" onClick={() => setDeliveryZone('outside')} className={`h-[48px] text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all ${deliveryZone === 'outside' ? 'bg-primary text-on-primary border-primary shadow-[2px_2px_0px_var(--color-on-primary)]' : 'bg-surface border-surface-bright text-on-surface hover:border-on-surface-variant'}`}>
                    OUTSIDE DHAKA
                  </button>
                </div>
              </div>
            </div>

            {/* Total & Submit */}
            <div className="bg-surface-container-low border-t-2 border-surface-bright p-[24px]">
              <div className="space-y-[12px] mb-[24px]">
                <div className="flex justify-between text-[14px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                  <span>SUBTOTAL</span>
                  <span>৳{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[14px] font-bold text-[#4ade80] uppercase tracking-[0.1em]">
                    <span>DISCOUNT</span>
                    <span>-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[14px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                  <span>DELIVERY</span>
                  <span>{deliveryZone ? `৳${deliveryCharge}` : 'CALCULATED NEXT'}</span>
                </div>
                <div className="flex justify-between text-[24px] font-black text-on-surface uppercase pt-[16px] border-t-2 border-surface-bright">
                  <span>TOTAL</span>
                  <span className="text-primary">৳{finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  if(!deliveryZone) {
                    toast.error('Please select a delivery zone');
                    return;
                  }
                  setIsCheckoutModalOpen(true);
                }}
                className="w-full h-[64px] bg-primary text-on-primary text-[18px] font-black uppercase tracking-[0.1em] shadow-[6px_6px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_var(--color-on-primary)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 rounded-theme"
              >
                PROCEED TO CHECKOUT <span className="material-symbols-outlined">arrow_forward</span>
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
