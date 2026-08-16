const fs = require('fs');
let code = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

const colorBoxCode = `              {/* Color/Design Selection Box */}
              {items.some(item => item.imageUrls && item.imageUrls.length > 0) && (
                <div className="bg-surface-container border-2 border-surface-bright p-[16px] rounded-theme">
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[12px]">SELECT COLOR/DESIGN</label>
                  <div className="space-y-4">
                    {items.filter(item => item.imageUrls && item.imageUrls.length > 0).map(item => (
                      <div key={item.cartItemId || item.id}>
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-[14px] font-bold text-on-surface line-clamp-1 pr-4">{item.title}</p>
                           {!item.selectedColor && <span className="text-[10px] font-bold text-error uppercase tracking-widest shrink-0">Required</span>}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {item.imageUrls!.map((url, idx) => (
                            <button
                              key={idx}
                              onClick={() => useCartStore.getState().updateColor(item.cartItemId || item.id, url)}
                              className={\`w-16 h-20 flex-shrink-0 border-2 transition-all \${item.selectedColor === url ? 'border-primary opacity-100' : 'border-surface-bright opacity-50 hover:opacity-100 hover:border-primary'}\`}
                            >
                              <img src={url} alt={\`\${item.title} \${idx}\`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection Box */}`;

code = code.replace(`{/* Size Selection Box */}`, colorBoxCode);

// Checkout validation
code = code.replace(
  /const itemsNeedingSize = items\.filter\(item => item\.sizes && item\.sizes\.length > 0 && !item\.selectedSize\);/g,
  `const itemsNeedingSize = items.filter(item => item.sizes && item.sizes.length > 0 && !item.selectedSize);
                  const itemsNeedingColor = items.filter(item => item.imageUrls && item.imageUrls.length > 0 && !item.selectedColor);
                  if (itemsNeedingColor.length > 0) {
                    toast.error('Please select color/design for all products');
                    return;
                  }`
);

// We need to display the selected color in the item card too.
code = code.replace(
  /\{item\.selectedSize && \([\s\S]*?<\/p>\s*\)\}/,
  `{item.selectedSize && (
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Size: {item.selectedSize}</p>
                          )}
                          {item.selectedColor && (
                            <div className="mt-2 w-8 h-10 border border-outline-variant">
                              <img src={item.selectedColor} className="w-full h-full object-cover" />
                            </div>
                          )}`
);

// If an item has selectedColor, we should maybe use that as the main image in the cart item!
code = code.replace(
  /src=\{item\.imageUrl\} alt=\{item\.title\}/g,
  `src={item.selectedColor || item.imageUrl} alt={item.title}`
);

fs.writeFileSync('src/components/store/CartDrawer.tsx', code);
