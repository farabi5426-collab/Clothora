const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

const imports = `import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp, Plus, DollarSign, Calendar, Download, Image as ImageIcon, FileText } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { downloadDashboardImage, downloadDashboardPDF } from '../../lib/printDashboard';`;

content = content.replace(
  /import React, \{ useState, useEffect \} from 'react';\nimport \{ Package, ShoppingCart, TrendingUp, Plus, DollarSign, Calendar \} from 'lucide-react';\nimport \{ db \} from '\.\.\/\.\.\/lib\/firebase';\nimport \{ collection, onSnapshot, query, addDoc, serverTimestamp, orderBy \} from 'firebase\/firestore';/,
  imports
);


const stateAdditions = `  const [isExporting, setIsExporting] = useState(false);`;

content = content.replace(
  /const \[isAddingExpense, setIsAddingExpense\] = useState\(false\);/,
  `const [isAddingExpense, setIsAddingExpense] = useState(false);\n${stateAdditions}`
);

const buttonsUI = `        <div className="flex items-center gap-3">
          <button 
            onClick={async () => {
              setIsExporting(true);
              try {
                await downloadDashboardImage({ stats, expenses, totalExpense, monthlyExpenses, finalNetProfit });
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="flex items-center gap-2 bg-surface-container border border-outline-variant px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors text-on-surface disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4 text-primary" />
            Image
          </button>
          <button 
            onClick={async () => {
              setIsExporting(true);
              try {
                await downloadDashboardPDF({ stats, expenses, totalExpense, monthlyExpenses, finalNetProfit });
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="flex items-center gap-2 bg-surface-container border border-outline-variant px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors text-on-surface disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-primary" />
            PDF
          </button>
        </div>
      </div>`;

content = content.replace(
  /        <\/div>\n      <\/div>\n\n      \{\/\* Stats Grid \*\/\}/,
  '        </div>\n' + buttonsUI + '\n\n      {/* Stats Grid */}'
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
