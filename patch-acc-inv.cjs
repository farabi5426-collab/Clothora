const fs = require('fs');
let code = fs.readFileSync('src/pages/store/CustomerDashboard.tsx', 'utf8');

const oldDeliveryRow = `                  <div className="flex justify-between font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                    <span>DELIVERY</span>
                    <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : \`৳\${selectedOrder.deliveryCharge}\`}</span>
                  </div>`;
                  
const newDeliveryRow = `                  <div className="flex justify-between items-center font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                    <span className="flex items-center gap-2">DELIVERY {selectedOrder.bkashDetails?.isPaymentVerified && <span className="text-[9px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-sm">PAID</span>}</span>
                    <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : \`৳\${selectedOrder.deliveryCharge}\`}</span>
                  </div>`;

if (code.includes(oldDeliveryRow)) {
  code = code.replace(oldDeliveryRow, newDeliveryRow);
  fs.writeFileSync('src/pages/store/CustomerDashboard.tsx', code);
  console.log('CustomerDashboard updated');
} else {
  console.log('CustomerDashboard not matched, searching...');
}
