const fs = require('fs');
let code = fs.readFileSync('src/pages/store/CustomerDashboard.tsx', 'utf8');

// 1. Imports
code = code.replace(
  "import { collection, query, where, getDocs } from 'firebase/firestore';",
  "import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';\nimport toast from 'react-hot-toast';"
);

// 2. Add State for Cancellation
const stateToAdd = `  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOtherReason, setCancelOtherReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const CANCEL_REASONS = [
    'Delivery time is too long',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Changed my mind',
    'Shipping cost is too high',
    'Other'
  ];

  const handleCancelRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason) {
      toast.error('Please select a reason');
      return;
    }
    if (cancelReason === 'Other' && !cancelOtherReason.trim()) {
      toast.error('Please specify your reason');
      return;
    }

    setCancelSubmitting(true);
    try {
      const finalReason = cancelReason === 'Other' ? cancelOtherReason : cancelReason;
      await updateDoc(doc(db, 'orders', selectedOrderForCancel.id), {
        cancellationRequest: {
          reason: finalReason,
          status: 'pending',
          requestedAt: new Date()
        }
      });
      
      toast.success('Cancellation request submitted.');
      
      // Update local state
      setOrders(orders.map(o => o.id === selectedOrderForCancel.id ? {
        ...o,
        cancellationRequest: { reason: finalReason, status: 'pending', requestedAt: new Date() }
      } : o));
      
      setCancelModalOpen(false);
      setSelectedOrderForCancel(null);
      setCancelReason('');
      setCancelOtherReason('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit cancellation request.');
    } finally {
      setCancelSubmitting(false);
    }
  };
`;
code = code.replace(
  "const [loading, setLoading] = useState(true);",
  "const [loading, setLoading] = useState(true);\n" + stateToAdd
);

// 3. Add Cancel Button and Status
const orderRenderTarget = `{order.status === 'Shipped' && order.trackingId && (
                      <div className="mt-[16px] bg-surface-container border-2 border-surface-bright p-[12px]">`;

const orderRenderReplacement = `{!['Shipped', 'Delivered', 'Cancelled'].includes(order.status) && !order.cancellationRequest && (
                      <button 
                        onClick={() => { setSelectedOrderForCancel(order); setCancelModalOpen(true); }}
                        className="mt-[16px] border-2 border-error text-error px-[16px] py-[8px] text-[12px] font-bold uppercase tracking-widest hover:bg-error hover:text-on-error transition-colors w-full md:w-auto text-center"
                      >
                        CANCEL ORDER
                      </button>
                    )}
                    {order.cancellationRequest?.status === 'pending' && (
                      <div className="mt-[16px] bg-error-container/20 border-2 border-error p-[12px] text-center w-full md:w-auto">
                        <span className="text-error text-[10px] font-black uppercase tracking-[0.1em]">CANCELLATION PENDING</span>
                      </div>
                    )}
                    {order.status === 'Shipped' && order.trackingId && (
                      <div className="mt-[16px] bg-surface-container border-2 border-surface-bright p-[12px]">`;
code = code.replace(orderRenderTarget, orderRenderReplacement);

// 4. Add the Modal
const endTarget = `        </div>
      </div>
    </div>
  );
}`;
const modalUI = `        </div>
      </div>

      {cancelModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-surface-bright w-full max-w-lg p-[32px] shadow-[8px_8px_0px_rgba(0,0,0,1)] relative">
            <h2 className="text-[24px] font-black uppercase tracking-tighter mb-2">Cancel Order</h2>
            <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">Order #{selectedOrderForCancel?.id.slice(0, 8)}</p>
            
            <form onSubmit={handleCancelRequest} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-on-surface mb-4">Please let us know why you are cancelling your order:</label>
                <div className="space-y-2">
                  {CANCEL_REASONS.map((reason) => (
                    <label key={reason} className="flex items-center gap-3 cursor-pointer">
                      <div className={\`w-5 h-5 border-2 flex items-center justify-center \${cancelReason === reason ? 'border-primary bg-primary' : 'border-surface-bright bg-surface'}\`}>
                        {cancelReason === reason && <div className="w-2.5 h-2.5 bg-on-primary"></div>}
                      </div>
                      <input 
                        type="radio" 
                        name="cancelReason" 
                        value={reason} 
                        className="hidden" 
                        onChange={(e) => setCancelReason(e.target.value)}
                        checked={cancelReason === reason}
                      />
                      <span className="text-[14px] font-bold text-on-surface">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelReason === 'Other' && (
                <div className="mt-4">
                  <textarea
                    required
                    placeholder="Please provide a reason..."
                    value={cancelOtherReason}
                    onChange={(e) => setCancelOtherReason(e.target.value)}
                    className="w-full bg-surface-container-low border-2 border-surface-bright p-3 text-[14px] text-on-background outline-none focus:border-primary font-bold min-h-[100px]"
                  />
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-6 border-t-2 border-surface-bright">
                <button 
                  type="button" 
                  onClick={() => { setCancelModalOpen(false); setSelectedOrderForCancel(null); setCancelReason(''); setCancelOtherReason(''); }}
                  className="flex-1 border-2 border-surface-bright px-4 py-3 text-[14px] font-bold uppercase tracking-widest hover:border-on-surface transition-colors"
                >
                  KEEP ORDER
                </button>
                <button 
                  type="submit"
                  disabled={cancelSubmitting}
                  className="flex-1 bg-error text-on-error border-2 border-error px-4 py-3 text-[14px] font-bold uppercase tracking-widest shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] transition-all disabled:opacity-50"
                >
                  {cancelSubmitting ? 'SUBMITTING...' : 'CANCEL ORDER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}`;
code = code.replace(endTarget, modalUI);

fs.writeFileSync('src/pages/store/CustomerDashboard.tsx', code);
console.log('Customer Dashboard Patched');
