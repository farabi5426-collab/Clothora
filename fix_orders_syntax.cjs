const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

const regex = /<div className="flex gap-2">[\s\S]*?<button onClick=\{\(\) => setSelectedOrder\(null\)\} className="p-2 bg-surface-container-high border-2 border-surface-bright hover:bg-surface-bright text-on-surface transition-colors">\s*<X className="w-5 h-5" \/>\s*<\/button>\s*<\/div>/m;

const replacement = `<div className="flex gap-2">
                  <button onClick={() => printInvoice(selectedOrder)} className="p-2 bg-primary text-on-primary border-2 border-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-surface-container-high border-2 border-surface-bright hover:bg-surface-bright text-on-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
    console.log("Syntax fixed");
} else {
    console.log("Could not find block");
}
