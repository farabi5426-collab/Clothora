const fs = require('fs');
const file = 'src/components/store/CheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add Upload icon
code = code.replace("X, Truck, CreditCard, CheckCircle, User", "X, Truck, CreditCard, CheckCircle, User, Upload");

// 2. Change payment method type and add new states
code = code.replace(
    "const [paymentMethod, setPaymentMethod] = useState<'cod' | 'digital'>('cod');",
    "const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');\n  const [bkashTrxId, setBkashTrxId] = useState('');\n  const [bkashScreenshot, setBkashScreenshot] = useState<File | null>(null);\n  const [isUploading, setIsUploading] = useState(false);"
);

// 3. Update handleSubmit
const oldHandleSubmit = `const handleSubmit = async (e: React.FormEvent) => {
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
  };`;

const newHandleSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all delivery details.');
      return;
    }

    if (paymentMethod === 'bkash' && !bkashTrxId && !bkashScreenshot) {
      toast.error('Please provide either a Transaction ID or upload a screenshot.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let screenshotUrl = '';
      if (bkashScreenshot) {
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', bkashScreenshot);
        uploadData.append('upload_preset', 'kwxslhnw');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/dzsiqw51v/image/upload', {
          method: 'POST',
          body: uploadData
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error?.message || 'Failed to upload screenshot');
        }
        screenshotUrl = data.secure_url;
        setIsUploading(false);
      }

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
        bkashDetails: paymentMethod === 'bkash' ? {
          transactionId: bkashTrxId,
          screenshotUrl: screenshotUrl
        } : null,
        status: 'Pending',
        createdAt: new Date()
      });
      
      toast.success('Order Placed Successfully!');
      clearCart();
      setStep(3); // Success Step
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
      setIsUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  };`;

code = code.replace(oldHandleSubmit, newHandleSubmit);

// 4. Update the Digital Payment radio option to bKash
const oldDigitalPayment = `<label className={\`flex items-start gap-[16px] p-[16px] border-2 cursor-pointer transition-colors rounded-theme \${paymentMethod === 'digital' ? 'border-primary bg-primary-container/10 shadow-[4px_4px_0px_var(--color-primary)]' : 'border-surface-bright bg-surface'}\`}>
                    <input type="radio" name="payment" value="digital" checked={paymentMethod === 'digital'} onChange={() => setPaymentMethod('digital')} className="mt-1 accent-primary w-5 h-5" />
                    <div>
                      <div className="font-black uppercase text-[16px] flex items-center gap-2 text-on-surface"><CreditCard className="w-5 h-5 text-primary" /> DIGITAL PAYMENT</div>
                      <p className="text-[12px] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">PAY SECURELY VIA BKASH, NAGAD, OR CREDIT CARD.</p>
                    </div>
                  </label>`;

const newBkashPayment = `<div className="space-y-[16px]">
                  <label className={\`flex items-start gap-[16px] p-[16px] border-2 cursor-pointer transition-colors rounded-theme \${paymentMethod === 'bkash' ? 'border-primary bg-primary-container/10 shadow-[4px_4px_0px_var(--color-primary)]' : 'border-surface-bright bg-surface'}\`}>
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
                        
                        <p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-widest">
                          After sending money, provide EITHER the Transaction ID OR upload a screenshot:
                        </p>
                        
                        <input 
                          placeholder="TRANSACTION ID (e.g. 8XL...)" 
                          value={bkashTrxId} 
                          onChange={e => setBkashTrxId(e.target.value)} 
                          className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme" 
                        />
                        
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="bkash-screenshot"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                setBkashScreenshot(e.target.files[0]);
                              }
                            }}
                          />
                          <label htmlFor="bkash-screenshot" className="flex items-center justify-center gap-2 w-full bg-surface-container-highest border-2 border-dashed border-surface-bright p-[16px] text-[14px] font-bold text-on-surface-variant hover:text-on-surface hover:border-primary cursor-pointer transition-colors uppercase rounded-theme">
                            <Upload className="w-5 h-5" />
                            {bkashScreenshot ? bkashScreenshot.name : 'UPLOAD SCREENSHOT'}
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  </div>`;

code = code.replace(oldDigitalPayment, newBkashPayment);

// 5. Update processing text
code = code.replace("{isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}", "{isSubmitting ? (isUploading ? 'UPLOADING...' : 'PROCESSING...') : 'PLACE ORDER'}");

fs.writeFileSync(file, code);
