const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

// 1. Add `isPaymentVerified` to Order Interface
code = code.replace(
  /bkashDetails\?: \{\s*transactionId: string;\s*\};/g,
  "bkashDetails?: { transactionId: string; advanceAmount?: number; isPaymentVerified?: boolean; };"
);

// 2. Add verify payment handler
const handlerPos = code.indexOf("const handleUpdateStatus =");
const newHandler = `
  const handleVerifyPayment = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        'bkashDetails.isPaymentVerified': true
      });
      setSelectedOrder(prev => prev && prev.id === orderId ? {
        ...prev,
        bkashDetails: { ...prev.bkashDetails, transactionId: prev.bkashDetails?.transactionId || '', isPaymentVerified: true }
      } : prev);
      alert('Payment Verified Successfully!');
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment');
    }
  };
  
  const handleUpdateStatus =`;

code = code.replace("const handleUpdateStatus =", newHandler);

// 3. Update the view to show the verify button and PAID status
// Replace the TrxID display in the Table
const oldTableTrx = /{order\.bkashDetails\.transactionId && \(\s*<div className="text-primary font-bold">TrxID\/Num: \{order\.bkashDetails\.transactionId\}<\/div>\s*\)}/g;
const newTableTrx = `{order.bkashDetails.transactionId && (
                        <div className="flex flex-col gap-1">
                          <div className="text-primary font-bold">TrxID/Num: {order.bkashDetails.transactionId}</div>
                          {order.bkashDetails.isPaymentVerified ? (
                            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-[8px] font-bold w-fit uppercase">PAID</span>
                          ) : (
                            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-[8px] font-bold w-fit uppercase">UNVERIFIED</span>
                          )}
                        </div>
                      )}`;
code = code.replace(oldTableTrx, newTableTrx);

// Replace TrxID display in Modal
const oldModalTrxRegex = /\{selectedOrder\.paymentMethod === 'bkash' && selectedOrder\.bkashDetails && \([\s\S]*?<p className="text-on-surface">\s*<span className="text-on-surface-variant">TrxID\/Number:<\/span> \{selectedOrder\.bkashDetails\.transactionId \|\| 'N\/A'\}\s*<\/p>\s*\)\}/;

const newModalTrx = `{selectedOrder.bkashDetails && selectedOrder.bkashDetails.transactionId && (
                          <div className="text-on-surface flex items-center justify-between gap-4 border-2 border-surface-bright p-3 mt-2 rounded-theme bg-surface-container-low">
                            <div>
                              <span className="text-on-surface-variant text-xs block mb-1">TrxID / Number:</span> 
                              <span className="text-lg text-primary">{selectedOrder.bkashDetails.transactionId}</span>
                              <div className="mt-1">
                                {selectedOrder.bkashDetails.isPaymentVerified ? (
                                  <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> Payment Verified</span>
                                ) : (
                                  <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Pending Verification</span>
                                )}
                              </div>
                            </div>
                            {!selectedOrder.bkashDetails.isPaymentVerified && (
                              <button 
                                onClick={() => handleVerifyPayment(selectedOrder.id)}
                                className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded-theme whitespace-nowrap"
                              >
                                Verify Payment
                              </button>
                            )}
                          </div>
                        )}`;
code = code.replace(oldModalTrxRegex, newModalTrx);

fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
