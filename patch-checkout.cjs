const fs = require('fs');
let code = fs.readFileSync('src/components/store/CheckoutModal.tsx', 'utf8');

// Update validation
code = code.replace(
  "if (paymentMethod === 'bkash' && !bkashTrxId) {",
  "if (!bkashTrxId) {"
);

// Update DB save payload
const oldDbSave = `        paymentMethod: paymentMethod || 'cod',
        bkashDetails: paymentMethod === 'bkash' ? {
          transactionId: bkashTrxId
        } : null,`;

const newDbSave = `        paymentMethod: paymentMethod || 'cod',
        bkashDetails: {
          transactionId: bkashTrxId,
          advanceAmount: paymentMethod === 'cod' ? (deliveryCharge === 0 ? 50 : deliveryCharge) : total
        },`;
code = code.replace(oldDbSave, newDbSave);

// Add COD Expanded block
const codBlockRegex = /<label className={`flex items-start gap-\[16px\] p-\[16px\] border-2 cursor-pointer transition-colors rounded-theme \$\{paymentMethod === 'cod' \? 'border-primary bg-primary-container\/10 shadow-\[4px_4px_0px_var\(--color-primary\)]' : 'border-surface-bright bg-surface'\}`}>\s*<input type="radio" name="payment" value="cod" checked=\{paymentMethod === 'cod'\} onChange=\{\(\) => setPaymentMethod\('cod'\)\} className="mt-1 accent-primary w-5 h-5" \/>\s*<div>\s*<div className="font-black uppercase text-\[16px\] flex items-center gap-2 text-on-surface"><Truck className="w-5 h-5 text-primary" \/> CASH ON DELIVERY<\/div>\s*<p className="text-\[12px\] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">PAY WITH CASH WHEN YOUR ORDER IS DELIVERED.<\/p>\s*<\/div>\s*<\/label>/m;

const newCodBlock = `<label className={\`flex items-start gap-[16px] p-[16px] border-2 cursor-pointer transition-colors rounded-theme \${paymentMethod === 'cod' ? 'border-primary bg-primary-container/10 shadow-[4px_4px_0px_var(--color-primary)]' : 'border-surface-bright bg-surface'}\`}>
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
                  )}`;

code = code.replace(codBlockRegex, newCodBlock);

fs.writeFileSync('src/components/store/CheckoutModal.tsx', code);
