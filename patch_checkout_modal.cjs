const fs = require('fs');
const file = 'src/components/store/CheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldCode = `<h4 className="font-bold uppercase text-[12px] leading-tight text-on-surface line-clamp-1">{item.title}</h4>`;
const newCode = `<div className="flex flex-col">
                            <h4 className="font-bold uppercase text-[12px] leading-tight text-on-surface line-clamp-1">{item.title}</h4>
                            {item.selectedSize && (
                               <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Size: {item.selectedSize}</p>
                            )}
                          </div>`;

code = code.replace(oldCode, newCode);

code = code.replace(/key=\{item\.id\}/g, "key={item.cartItemId || item.id}");

fs.writeFileSync(file, code);
