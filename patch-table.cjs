const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

const oldTableCol = `{order.paymentMethod === 'bkash' && order.bkashDetails && (
                    <div className="flex flex-col gap-1 text-[10px]">
                      {order.bkashDetails.transactionId && (
                        <div className="flex flex-col gap-1">
                          <div className="text-primary font-bold">TrxID/Num: {order.bkashDetails.transactionId}</div>
                          {order.bkashDetails.isPaymentVerified ? (
                            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-[8px] font-bold w-fit uppercase">PAID</span>
                          ) : (
                            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-[8px] font-bold w-fit uppercase">UNVERIFIED</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}`;
                  
const newTableCol = `{order.bkashDetails && order.bkashDetails.transactionId && (
                    <div className="flex flex-col gap-1 text-[10px]">
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="text-primary font-bold">TrxID: {order.bkashDetails.transactionId}</div>
                        {order.bkashDetails.isPaymentVerified ? (
                          <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-[8px] font-bold w-fit uppercase border border-green-500/20">PAID</span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-[8px] font-bold w-fit uppercase border border-yellow-500/20">UNVERIFIED</span>
                        )}
                      </div>
                    </div>
                  )}`;

code = code.replace(oldTableCol, newTableCol);
fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
