const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

code = code.replace(
  /\{item\.selectedSize && \([\s\S]*?<\/span>\s*\)\}/,
  `{item.selectedSize && (
                               <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Size: {item.selectedSize}</span>
                             )}
                             {item.selectedColor && (
                               <div className="mt-1 flex items-center gap-1">
                                 <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Color:</span>
                                 <img src={item.selectedColor} className="w-6 h-8 object-cover border border-outline-variant" />
                               </div>
                             )}`
);

// We should also use the selectedColor as the main image if available
code = code.replace(
  /<img src=\{item\.imageUrl\} alt=\{item\.title\}/,
  `<img src={item.selectedColor || item.imageUrl} alt={item.title}`
);

fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
