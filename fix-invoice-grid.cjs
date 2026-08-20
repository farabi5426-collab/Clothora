const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/InvoiceGenerator.tsx', 'utf8');

content = content.replace(
  /className="grid grid-cols-2 gap-4"/g,
  'className="grid grid-cols-1 sm:grid-cols-2 gap-4"'
);
content = content.replace(
  /className="mt-6 grid grid-cols-2 gap-4"/g,
  'className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"'
);
content = content.replace(
  /className="grid grid-cols-2 gap-2 mt-2"/g,
  'className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"'
);

fs.writeFileSync('src/pages/admin/InvoiceGenerator.tsx', content);
