const fs = require('fs');
const file = 'src/pages/admin/OrdersManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update OrderItem interface
const oldInterface = `interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}`;

const newInterface = `interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  selectedSize?: string;
}`;

code = code.replace(oldInterface, newInterface);

// 2. Update display logic
const oldDisplay = `<span className="text-on-surface line-clamp-2 max-w-[200px] sm:max-w-[300px]">{item.title}</span>`;
const newDisplay = `<div className="flex flex-col">
                             <span className="text-on-surface line-clamp-2 max-w-[200px] sm:max-w-[300px]">{item.title}</span>
                             {item.selectedSize && (
                               <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Size: {item.selectedSize}</span>
                             )}
                           </div>`;

code = code.replace(oldDisplay, newDisplay);

fs.writeFileSync(file, code);
