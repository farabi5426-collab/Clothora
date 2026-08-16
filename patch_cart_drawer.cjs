const fs = require('fs');
let code = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

// 1. Remove size buttons from the item card
code = code.replace(
  /\{item\.sizes && item\.sizes\.length > 0 \? \([\s\S]*?\) : item\.selectedSize && \([\s\S]*?\)\}/,
  `{item.selectedSize && (
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Size: {item.selectedSize}</p>
                          )}`
);

// 2. Add the new Size Selection box above Promo Code
const sizeBoxCode = `              {/* Size Selection Box */}
              {items.some(item => item.sizes && item.sizes.length > 0) && (
                <div className="bg-surface-container border-2 border-surface-bright p-[16px] rounded-theme">
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[12px]">SELECT SIZES</label>
                  <div className="space-y-4">
                    {items.filter(item => item.sizes && item.sizes.length > 0).map(item => (
                      <div key={item.cartItemId || item.id}>
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-[14px] font-bold text-on-surface line-clamp-1 pr-4">{item.title}</p>
                           {!item.selectedSize && <span className="text-[10px] font-bold text-error uppercase tracking-widest shrink-0">Required</span>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.sizes!.map(s => (
                            <button
                              key={s}
                              onClick={() => useCartStore.getState().updateSize(item.cartItemId || item.id, s)}
                              className={\`w-10 h-10 flex items-center justify-center text-[14px] font-bold border transition-colors \${item.selectedSize === s ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-surface-bright hover:border-primary'}\`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Promo Code */}`;

code = code.replace(`{/* Promo Code */}`, sizeBoxCode);

// 3. Update Proceed to Checkout validation
code = code.replace(
  `                  if(!deliveryZone && !deliverySettings.freeDelivery) {
                    toast.error('Please select a delivery zone');
                    return;
                  }`,
  `                  const itemsNeedingSize = items.filter(item => item.sizes && item.sizes.length > 0 && !item.selectedSize);
                  if (itemsNeedingSize.length > 0) {
                    toast.error('Please select sizes for all products');
                    return;
                  }
                  
                  if(!deliveryZone && !deliverySettings.freeDelivery) {
                    toast.error('Please select a delivery zone');
                    return;
                  }`
);

fs.writeFileSync('src/components/store/CartDrawer.tsx', code);
