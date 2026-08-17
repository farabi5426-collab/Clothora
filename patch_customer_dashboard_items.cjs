const fs = require('fs');
let code = fs.readFileSync('src/pages/store/CustomerDashboard.tsx', 'utf8');

// Add import
if (!code.includes("import { Package }")) {
    code = code.replace(
        "import { useCartStore } from '../../store/cartStore';",
        "import { useCartStore } from '../../store/cartStore';\nimport { Package } from 'lucide-react';"
    );
}

// Replace items mapping
const oldMapping = `<div className="space-y-[8px]">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="text-[14px] font-bold uppercase tracking-[0.1em] text-on-surface">{item.quantity}x {item.title}</div>
                      ))}
                    </div>`;

const newMapping = `<div className="space-y-[12px] mt-[16px]">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 items-center bg-surface-container-lowest p-3 border-2 border-surface-bright">
                          {item.imageUrl ? (
                            <img src={item.selectedColor || item.imageUrl} alt={item.title} className="w-16 h-16 object-cover border-2 border-surface-bright" />
                          ) : (
                            <div className="w-16 h-16 bg-surface-bright flex items-center justify-center border-2 border-surface-bright">
                              <Package className="w-6 h-6 text-on-surface-variant" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-on-surface text-[12px] uppercase tracking-widest line-clamp-2">{item.title}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Qty: {item.quantity} • ৳{item.price}</p>
                            {(item.selectedSize || item.selectedColor) && (
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                                {item.selectedSize && \`Size: \${item.selectedSize} \`}
                                {item.selectedColor && \`Color: Yes\`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>`;

code = code.replace(oldMapping, newMapping);

fs.writeFileSync('src/pages/store/CustomerDashboard.tsx', code);
console.log('Customer Dashboard Items Patched');
