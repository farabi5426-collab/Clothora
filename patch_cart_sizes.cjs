const fs = require('fs');
const file = 'src/components/store/CartDrawer.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldCode = `<select 
                              value={item.selectedSize || ''} 
                              onChange={(e) => useCartStore.getState().updateSize(item.cartItemId || item.id, e.target.value)}
                              className="mt-2 bg-surface border border-outline-variant text-xs font-bold uppercase p-1 outline-none focus:border-primary text-on-surface-variant"
                            >
                              <option value="" disabled>Select Size</option>
                              {item.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>`;

const newCode = `<div className="flex flex-wrap gap-2 mt-2">
                              {item.sizes.map(s => (
                                <button
                                  key={s}
                                  onClick={() => useCartStore.getState().updateSize(item.cartItemId || item.id, s)}
                                  className={\`w-8 h-8 flex items-center justify-center text-xs font-bold border transition-colors \${item.selectedSize === s ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-surface-bright hover:border-primary'}\`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>`;

code = code.replace(oldCode, newCode);

fs.writeFileSync(file, code);
