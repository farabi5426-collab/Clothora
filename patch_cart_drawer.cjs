const fs = require('fs');
const file = 'src/components/store/CartDrawer.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldMap = `key={item.id} className="flex gap-[16px] bg-surface-container border-2 border-surface-bright p-[16px] relative group rounded-theme">
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
                          <span className="w-[40px] text-center font-bold text-[14px] text-on-surface">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-[32px] h-[32px] flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>`;

const newMap = `key={item.cartItemId || item.id} className="flex gap-[16px] bg-surface-container border-2 border-surface-bright p-[16px] relative group rounded-theme">
                    <div className="w-[100px] h-[100px] bg-surface-container-highest border-2 border-surface-bright shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold uppercase text-[16px] leading-tight text-on-surface line-clamp-2">{item.title}</h4>
                          {item.selectedSize && (
                             <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Size: {item.selectedSize}</p>
                          )}
                        </div>
                        <button onClick={() => removeFromCart(item.cartItemId || item.id)} className="text-on-surface-variant hover:text-error transition-colors shrink-0">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <p className="text-primary font-black text-[18px] mt-1">৳{item.price}</p>
                      
                      <div className="mt-auto flex items-center">
                        <div className="flex items-center bg-surface border-2 border-surface-bright">
                          <button onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)} className="w-[32px] h-[32px] flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors">
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-[40px] text-center font-bold text-[14px] text-on-surface">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)} className="w-[32px] h-[32px] flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>`;

code = code.replace(oldMap, newMap);
fs.writeFileSync(file, code);
