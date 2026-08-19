const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

const oldFunc = `  const handleVerifyPayment = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        'bkashDetails.isPaymentVerified': true
      });
      setSelectedOrder(prev => prev && prev.id === orderId ? {
        ...prev,
        bkashDetails: { ...prev.bkashDetails, transactionId: prev.bkashDetails?.transactionId || '', isPaymentVerified: true }
      } : prev);
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, bkashDetails: { ...order.bkashDetails, transactionId: order.bkashDetails?.transactionId || '', isPaymentVerified: true } }
          : order
      ));
      alert('Payment Verified Successfully!');
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment');
    }
  };`;

const newFunc = `  const handleTogglePaymentStatus = async (orderId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, 'orders', orderId), {
        'bkashDetails.isPaymentVerified': newStatus
      });
      setSelectedOrder(prev => prev && prev.id === orderId ? {
        ...prev,
        bkashDetails: { ...prev.bkashDetails, transactionId: prev.bkashDetails?.transactionId || '', isPaymentVerified: newStatus }
      } : prev);
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, bkashDetails: { ...order.bkashDetails, transactionId: order.bkashDetails?.transactionId || '', isPaymentVerified: newStatus } }
          : order
      ));
    } catch (error) {
      console.error('Error toggling payment status:', error);
      alert('Failed to update payment status');
    }
  };`;

code = code.replace(oldFunc, newFunc);

const oldModalUI = `                            {!selectedOrder.bkashDetails.isPaymentVerified && (
                              <button 
                                onClick={() => handleVerifyPayment(selectedOrder.id)}
                                className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded-theme whitespace-nowrap"
                              >
                                Verify Payment
                              </button>
                            )}`;

const newModalUI = `                            <div className="flex flex-col items-end gap-2">
                              {selectedOrder.bkashDetails.isPaymentVerified ? (
                                <button 
                                  onClick={() => handleTogglePaymentStatus(selectedOrder.id, true)}
                                  className="bg-surface-container-high hover:bg-surface-bright text-on-surface-variant border border-surface-bright px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-theme whitespace-nowrap"
                                >
                                  Mark Unverified
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleTogglePaymentStatus(selectedOrder.id, false)}
                                  className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded-theme whitespace-nowrap"
                                >
                                  Verify Payment
                                </button>
                              )}
                            </div>`;

code = code.replace(oldModalUI, newModalUI);

fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
