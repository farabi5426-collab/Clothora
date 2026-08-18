const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/OrdersManagement.tsx', 'utf8');

// Add import
code = code.replace(
  "import { printInvoice } from '../../lib/printInvoice';",
  "import { printInvoice, downloadInvoiceImage } from '../../lib/printInvoice';"
);

// Add icon
code = code.replace(
  "import { Package, Search, Filter, Eye, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp, Printer, MapPin, Phone, User, Calendar, Save, Trash2, X } from 'lucide-react';",
  "import { Package, Search, Filter, Eye, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp, Printer, MapPin, Phone, User, Calendar, Save, Trash2, X, Image as ImageIcon } from 'lucide-react';"
);

// State for loading
code = code.replace(
  "const [searchTerm, setSearchTerm] = useState('');",
  "const [searchTerm, setSearchTerm] = useState('');\n  const [isDownloadingImage, setIsDownloadingImage] = useState(false);"
);

// Update button
const printBtnHtml = `<button onClick={() => printInvoice(selectedOrder)} className="p-2 bg-primary text-on-primary border-2 border-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>`;
                  
const newBtnsHtml = `<button onClick={async () => {
                    try {
                      setIsDownloadingImage(true);
                      await downloadInvoiceImage(selectedOrder);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsDownloadingImage(false);
                    }
                  }} 
                  disabled={isDownloadingImage}
                  className="p-2 bg-surface-container-highest text-on-surface border-2 border-surface-bright hover:bg-surface-bright transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50">
                    <ImageIcon className="w-4 h-4" /> {isDownloadingImage ? 'Generating...' : 'Download Image'}
                  </button>
                  <button onClick={() => printInvoice(selectedOrder)} className="p-2 bg-primary text-on-primary border-2 border-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>`;

code = code.replace(printBtnHtml, newBtnsHtml);

fs.writeFileSync('src/pages/admin/OrdersManagement.tsx', code);
console.log("Button added!");
