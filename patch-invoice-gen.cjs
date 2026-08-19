const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/InvoiceGenerator.tsx', 'utf8');

// 1. Add state for isDeliveryPaid
code = code.replace(
  "const [deliveryCharge, setDeliveryCharge] = useState(0);",
  "const [deliveryCharge, setDeliveryCharge] = useState(0);\n  const [isDeliveryPaid, setIsDeliveryPaid] = useState(false);"
);

// 2. Add bkashDetails to generated order object
const oldOrderObj = `      deliveryCharge: Number(deliveryCharge),
      totalAmount: totalAmount
    };`;
    
const newOrderObj = `      deliveryCharge: Number(deliveryCharge),
      totalAmount: totalAmount,
      bkashDetails: { isPaymentVerified: isDeliveryPaid }
    };`;
code = code.replace(oldOrderObj, newOrderObj);

// 3. Add toggle UI next to Delivery Charge input
const oldUI = `                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Delivery Charge (৳)</label>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                    className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>`;
                
const newUI = `                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Delivery Charge (৳)</label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <span className="text-[10px] font-bold uppercase text-on-surface">Paid?</span>
                      <input 
                        type="checkbox" 
                        checked={isDeliveryPaid}
                        onChange={(e) => setIsDeliveryPaid(e.target.checked)}
                        className="accent-primary w-3 h-3"
                      />
                    </label>
                  </div>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                    className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>`;

code = code.replace(oldUI, newUI);

fs.writeFileSync('src/pages/admin/InvoiceGenerator.tsx', code);
