const fs = require('fs');
const file = 'src/pages/admin/OrdersManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update Interface
code = code.replace("screenshotUrl: string;", "");

// Update Table Display logic
const oldDisplay = `<td className="p-4">
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
                </td>`;

const newDisplay = `<td className="p-4">
                  <div className="text-xs font-bold uppercase text-on-surface mb-1">
                    {order.paymentMethod === 'bkash' ? 'bKash' : 'Cash On Delivery'}
                  </div>
                  {order.paymentMethod === 'bkash' && order.bkashDetails && (
                    <div className="flex flex-col gap-1 text-[10px]">
                      {order.bkashDetails.transactionId && (
                        <div className="text-primary font-bold">TrxID/Num: {order.bkashDetails.transactionId}</div>
                      )}
                    </div>
                  )}
                </td>`;

code = code.replace(oldDisplay, newDisplay);
fs.writeFileSync(file, code);

