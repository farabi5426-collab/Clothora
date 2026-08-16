const fs = require('fs');
const file = 'src/components/store/CartDrawer.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldCode = `<h4 className="font-bold uppercase text-[16px] leading-tight text-on-surface line-clamp-2">{item.title}</h4>`;
const newCode = `<div>
                          <h4 className="font-bold uppercase text-[16px] leading-tight text-on-surface line-clamp-2">{item.title}</h4>
                          {item.sizes && item.sizes.length > 0 ? (
                            <select 
                              value={item.selectedSize || ''} 
                              onChange={(e) => useCartStore.getState().updateSize(item.cartItemId || item.id, e.target.value)}
                              className="mt-2 bg-surface border border-outline-variant text-xs font-bold uppercase p-1 outline-none focus:border-primary text-on-surface-variant"
                            >
                              <option value="" disabled>Select Size</option>
                              {item.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : item.selectedSize && (
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Size: {item.selectedSize}</p>
                          )}
                        </div>`;

code = code.replace(oldCode, newCode);

code = code.replace(/key=\{item\.id\}/g, "key={item.cartItemId || item.id}");
code = code.replace(/removeFromCart\(item\.id\)/g, "removeFromCart(item.cartItemId || item.id)");
code = code.replace(/updateQuantity\(item\.id,/g, "updateQuantity(item.cartItemId || item.id,");

fs.writeFileSync(file, code);
