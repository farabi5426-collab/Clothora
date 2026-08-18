const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

if (!code.includes("printInvoice")) {
  code = code.replace(
    "import { X, ExternalLink, Package, User, CreditCard, Receipt } from 'lucide-react';",
    "import { X, ExternalLink, Package, User, CreditCard, Receipt, Printer } from 'lucide-react';\nimport { printInvoice } from '../../lib/printInvoice';"
  );
  
  const oldHeader = `<h2 className="text-2xl font-black uppercase tracking-tighter">Order Details</h2>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">ID: {selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)}`;
                
  const newHeader = `<h2 className="text-2xl font-black uppercase tracking-tighter">Order Details</h2>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">ID: {selectedOrder.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => printInvoice(selectedOrder)} className="p-2 bg-primary text-on-primary border-2 border-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>
                  <button onClick={() => setSelectedOrder(null)}`;
  
  code = code.replace(oldHeader, newHeader);
  fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
  console.log("Invoice print button added");
}
