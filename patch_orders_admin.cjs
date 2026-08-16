const fs = require('fs');
const file = 'src/pages/admin/OrdersManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update Interface
const oldInterface = `interface Order {
  id: string;
  customerId: string;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: any;
}`;

const newInterface = `interface Order {
  id: string;
  customerId: string;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  bkashDetails?: {
    transactionId: string;
    screenshotUrl: string;
  };
  status: string;
  createdAt: any;
}`;
code = code.replace(oldInterface, newInterface);

// 2. Add column headers
code = code.replace(
    `<th className="text-left py-4 px-4 font-bold uppercase tracking-widest text-xs text-on-surface-variant">Customer</th>`,
    `<th className="text-left py-4 px-4 font-bold uppercase tracking-widest text-xs text-on-surface-variant">Customer</th>\n                <th className="text-left py-4 px-4 font-bold uppercase tracking-widest text-xs text-on-surface-variant">Payment</th>`
);

// 3. Add column data
const oldDataCol = `<td className="py-4 px-4">
                    <div className="font-bold text-on-surface uppercase">{order.customerDetails.name}</div>
                    <div className="text-xs text-on-surface-variant">{order.customerDetails.phone}</div>
                  </td>`;

const newDataCol = `<td className="py-4 px-4">
                    <div className="font-bold text-on-surface uppercase">{order.customerDetails.name}</div>
                    <div className="text-xs text-on-surface-variant">{order.customerDetails.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-on-surface uppercase text-xs">
                      {order.paymentMethod === 'bkash' ? 'bKash' : 'COD'}
                    </div>
                    {order.paymentMethod === 'bkash' && order.bkashDetails && (
                      <div className="mt-1 flex flex-col gap-1 text-[10px]">
                        {order.bkashDetails.transactionId && (
                          <div className="text-primary font-bold">TrxID: {order.bkashDetails.transactionId}</div>
                        )}
                        {order.bkashDetails.screenshotUrl && (
                          <a href={order.bkashDetails.screenshotUrl} target="_blank" rel="noreferrer" className="text-on-surface-variant underline hover:text-primary transition-colors">
                            View Screenshot
                          </a>
                        )}
                      </div>
                    )}
                  </td>`;
code = code.replace(oldDataCol, newDataCol);

fs.writeFileSync(file, code);
