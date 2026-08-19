const fs = require('fs');
let code = fs.readFileSync('src/lib/printInvoice.ts', 'utf8');

const oldDeliveryRow = `          <tr>
            <td>Delivery</td>
            <td class="amount" style="\${order.deliveryCharge === 0 ? 'color: #4CAF50;' : ''}">\${order.deliveryCharge === 0 ? 'FREE' : \`৳\${order.deliveryCharge}\`}</td>
          </tr>`;
          
const newDeliveryRow = `          <tr>
            <td>Delivery <span style="font-size: 10px; font-weight: bold; margin-left: 8px; color: #4CAF50; padding: 2px 6px; background: rgba(76, 175, 80, 0.1); border-radius: 4px; display: \${order.bkashDetails?.isPaymentVerified ? 'inline-block' : 'none'};">PAID</span></td>
            <td class="amount" style="\${order.deliveryCharge === 0 ? 'color: #4CAF50;' : ''}">\${order.deliveryCharge === 0 ? 'FREE' : \`৳\${order.deliveryCharge}\`}</td>
          </tr>`;

code = code.replace(oldDeliveryRow, newDeliveryRow);
fs.writeFileSync('src/lib/printInvoice.ts', code);
