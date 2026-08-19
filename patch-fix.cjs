const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

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
  };
  
  const handleStatusChange =`;

code = code.replace("const handleStatusChange =", newHandler);
fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
