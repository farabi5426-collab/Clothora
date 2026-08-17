const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

// 1. Add cancellationRequest to Order interface
code = code.replace(
  "  status: string;\n  trackingId?: string;\n  createdAt: any;\n}",
  "  status: string;\n  trackingId?: string;\n  createdAt: any;\n  cancellationRequest?: {\n    reason: string;\n    status: 'pending' | 'approved' | 'rejected';\n    requestedAt: any;\n  };\n}"
);

// 2. Add handleCancelDecision function
const handleCancelDecisionStr = `
  const handleCancelDecision = async (orderId: string, decision: 'approve' | 'reject') => {
    try {
      if (decision === 'approve') {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Cancelled',
          'cancellationRequest.status': 'approved'
        });
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder, 
            status: 'Cancelled', 
            cancellationRequest: { ...selectedOrder.cancellationRequest!, status: 'approved' }
          });
        }
      } else {
        await updateDoc(doc(db, 'orders', orderId), {
          'cancellationRequest.status': 'rejected'
        });
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder, 
            cancellationRequest: { ...selectedOrder.cancellationRequest!, status: 'rejected' }
          });
        }
      }
    } catch (error) {
      console.error('Error updating cancellation request:', error);
      alert('Failed to update cancellation request.');
    }
  };
`;
// insert it before handleStatusChange
code = code.replace(
  "const handleStatusChange = async",
  handleCancelDecisionStr + "\n  const handleStatusChange = async"
);

// 3. Render cancellation request badge in the table
const tableBadgeStr = `
                  <span className={\`px-3 py-1 text-[10px] font-bold uppercase tracking-widest \${
                    order.status === 'Delivered' ? 'bg-[#4ade80]/20 text-[#4ade80]' :
                    order.status === 'Cancelled' ? 'bg-error/20 text-error' :
                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-primary/20 text-primary'
                  }\`}>
                    {order.status}
                  </span>
                  {order.cancellationRequest?.status === 'pending' && (
                    <span className="block mt-2 px-2 py-1 bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest border border-error">
                      Cancel Req
                    </span>
                  )}
`;
code = code.replace(
  /<span className=\{\`px-3 py-1 text-\[10px\] font-bold uppercase tracking-widest \$\{[\s\S]*?\}\`\}>\s*\{order\.status\}\s*<\/span>/,
  tableBadgeStr
);

// 4. Render cancellation request UI in the modal
const modalTargetStr = `                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">`;
const modalCancellationUI = `                {selectedOrder.cancellationRequest?.status === 'pending' && (
                  <div className="bg-error/10 border-2 border-error p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-error mb-1">Cancellation Request</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Reason: {selectedOrder.cancellationRequest.reason}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleCancelDecision(selectedOrder.id, 'reject')}
                        className="flex-1 md:flex-none border-2 border-error text-error px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-error/20 transition-colors"
                      >
                        REJECT
                      </button>
                      <button 
                        onClick={() => handleCancelDecision(selectedOrder.id, 'approve')}
                        className="flex-1 md:flex-none bg-error text-on-error border-2 border-error px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-error-container hover:text-on-error-container transition-colors"
                      >
                        APPROVE
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">`;
code = code.replace(modalTargetStr, modalCancellationUI);

fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
console.log('OrdersManagement Patched');
