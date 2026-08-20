const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/InvoiceGenerator.tsx', 'utf8');

content = content.replace(
  /className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-surface-bright pb-2 flex items-center justify-between"/g,
  'className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-surface-bright pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"'
);

// On line 317: <div className="flex gap-4"> might be better as <div className="flex flex-col sm:flex-row gap-4">
content = content.replace(
  /className="flex gap-4"/g,
  'className="flex flex-col sm:flex-row gap-4"'
);

// We should also look for grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
fs.writeFileSync('src/pages/admin/InvoiceGenerator.tsx', content);
