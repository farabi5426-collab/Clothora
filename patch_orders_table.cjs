const fs = require('fs');
const file = 'src/pages/admin/OrdersManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldHeaders = `<th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Customer</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Items</th>`;

const newHeaders = `<th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Customer</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Payment</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Items</th>`;

code = code.replace(oldHeaders, newHeaders);

const oldRow = `<td className="p-4">
                  <div className="text-sm font-bold uppercase mb-1">{order.customerDetails?.name || 'Unknown'}</div>
                  <div className="text-xs text-on-surface-variant">{order.customerDetails?.phone}</div>
                  <div className="text-xs text-on-surface-variant max-w-[200px] truncate" title={order.customerDetails?.address}>{order.customerDetails?.address}</div>
                </td>
                <td className="p-4">`;

const newRow = `<td className="p-4">
                  <div className="text-sm font-bold uppercase mb-1">{order.customerDetails?.name || 'Unknown'}</div>
                  <div className="text-xs text-on-surface-variant">{order.customerDetails?.phone}</div>
                  <div className="text-xs text-on-surface-variant max-w-[200px] truncate" title={order.customerDetails?.address}>{order.customerDetails?.address}</div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-bold uppercase text-on-surface mb-1">
                    {order.paymentMethod === 'bkash' ? 'bKash' : 'Cash On Delivery'}
                  </div>
                  {order.paymentMethod === 'bkash' && order.bkashDetails && (
                    <div className="flex flex-col gap-1 text-[10px]">
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
                </td>
                <td className="p-4">`;

code = code.replace(oldRow, newRow);

fs.writeFileSync(file, code);
