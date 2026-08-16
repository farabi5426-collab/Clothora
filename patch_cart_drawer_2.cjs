const fs = require('fs');
const file = 'src/components/store/CartDrawer.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    `{/* Delivery Zone Selection */}
              <div className="bg-surface-container border-2 border-surface-bright p-[16px] rounded-theme">
                <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">DELIVERY ZONE</label>
                <div className="grid grid-cols-2 gap-[8px]">
                  <button type="button" onClick={() => setDeliveryZone('inside')} className={\`h-[48px] text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all \${deliveryZone === 'inside' ? 'bg-primary text-on-primary border-primary shadow-[2px_2px_0px_var(--color-on-primary)]' : 'bg-surface border-surface-bright text-on-surface hover:border-on-surface-variant'}\`}>
                    INSIDE DHAKA
                  </button>
                  <button type="button" onClick={() => setDeliveryZone('outside')} className={\`h-[48px] text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all \${deliveryZone === 'outside' ? 'bg-primary text-on-primary border-primary shadow-[2px_2px_0px_var(--color-on-primary)]' : 'bg-surface border-surface-bright text-on-surface hover:border-on-surface-variant'}\`}>
                    OUTSIDE DHAKA
                  </button>
                </div>
              </div>`,
    `{/* Delivery Zone Selection */}
              {!deliverySettings.freeDelivery ? (
                <div className="bg-surface-container border-2 border-surface-bright p-[16px] rounded-theme">
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">DELIVERY ZONE</label>
                  <div className="grid grid-cols-2 gap-[8px]">
                    <button type="button" onClick={() => setDeliveryZone('inside')} className={\`h-[48px] text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all \${deliveryZone === 'inside' ? 'bg-primary text-on-primary border-primary shadow-[2px_2px_0px_var(--color-on-primary)]' : 'bg-surface border-surface-bright text-on-surface hover:border-on-surface-variant'}\`}>
                      INSIDE DHAKA
                    </button>
                    <button type="button" onClick={() => setDeliveryZone('outside')} className={\`h-[48px] text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all \${deliveryZone === 'outside' ? 'bg-primary text-on-primary border-primary shadow-[2px_2px_0px_var(--color-on-primary)]' : 'bg-surface border-surface-bright text-on-surface hover:border-on-surface-variant'}\`}>
                      OUTSIDE DHAKA
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#4ade80]/10 border-2 border-[#4ade80] p-[16px] rounded-theme text-center">
                  <p className="text-[14px] font-black uppercase text-[#4ade80] tracking-widest">FREE DELIVERY APPLIED!</p>
                </div>
              )}`
);

// We should also bypass the requirement to select a zone if freeDelivery is true
code = code.replace(
    `if(!deliveryZone) {
                    toast.error('Please select a delivery zone');
                    return;
                  }`,
    `if(!deliveryZone && !deliverySettings.freeDelivery) {
                    toast.error('Please select a delivery zone');
                    return;
                  }`
);

// We should format the delivery display text in the total summary
code = code.replace(
    `<span>{deliveryZone ? \`৳\${deliveryCharge}\` : 'CALCULATED NEXT'}</span>`,
    `<span>{deliverySettings.freeDelivery ? 'FREE' : (deliveryZone ? \`৳\${deliveryCharge}\` : 'CALCULATED NEXT')}</span>`
);

fs.writeFileSync(file, code);
