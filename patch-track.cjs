const fs = require('fs');
let code = fs.readFileSync('src/pages/store/TrackOrder.tsx', 'utf8');

const oldTotal = `<div className="flex justify-between border-b border-surface-bright pb-2">
                      <span>Total Amount</span>
                      <span className="text-primary">৳ {order.totalAmount}</span>
                    </div>`;
                    
const newTotal = `<div className="flex justify-between border-b border-surface-bright pb-2">
                      <span>Total Amount</span>
                      <span className="text-primary">৳ {order.totalAmount}</span>
                    </div>
                    {order.deliveryCharge !== undefined && (
                      <div className="flex justify-between border-b border-surface-bright pb-2 items-center">
                        <span className="flex items-center gap-2">Delivery Charge {order.bkashDetails?.isPaymentVerified && <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-widest">PAID</span>}</span>
                        <span className="text-on-background">{order.deliveryCharge === 0 ? 'FREE' : \`৳\${order.deliveryCharge}\`}</span>
                      </div>
                    )}`;

if (code.includes(oldTotal)) {
  code = code.replace(oldTotal, newTotal);
  fs.writeFileSync('src/pages/store/TrackOrder.tsx', code);
}
