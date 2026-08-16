const fs = require('fs');
const file = 'src/pages/admin/OrdersManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update Interface
const oldInterface = `interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}`;

const newInterface = `interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}`;

code = code.replace(oldInterface, newInterface);

// 2. Update Items Display
const oldItemsDisplay = `<div className="space-y-4">
                     {selectedOrder.items?.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center text-sm font-bold uppercase tracking-wide border-b border-surface-bright pb-2 last:border-0 last:pb-0">
                         <div className="flex items-center gap-4">
                           <span className="bg-surface-container-high px-2 py-1 text-xs">{item.quantity}x</span>
                           <span className="text-on-surface">{item.title}</span>
                         </div>
                         <span className="text-on-surface">৳ {item.price * item.quantity}</span>
                       </div>
                     ))}
                   </div>`;

const newItemsDisplay = `<div className="space-y-4">
                     {selectedOrder.items?.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center text-sm font-bold uppercase tracking-wide border-b border-surface-bright pb-3 last:border-0 last:pb-0">
                         <div className="flex items-center gap-4">
                           {item.imageUrl ? (
                             <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover border border-surface-bright" />
                           ) : (
                             <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center border border-surface-bright">
                               <Package className="w-5 h-5 text-on-surface-variant" />
                             </div>
                           )}
                           <span className="bg-surface-container-high px-2 py-1 text-xs">{item.quantity}x</span>
                           <span className="text-on-surface line-clamp-2 max-w-[200px] sm:max-w-[300px]">{item.title}</span>
                         </div>
                         <span className="text-on-surface whitespace-nowrap">৳ {item.price * item.quantity}</span>
                       </div>
                     ))}
                   </div>`;

code = code.replace(oldItemsDisplay, newItemsDisplay);

fs.writeFileSync(file, code);
