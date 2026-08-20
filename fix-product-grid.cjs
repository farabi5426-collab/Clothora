const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf8');

content = content.replace(
  /<div className="grid grid-cols-2 gap-4">/g,
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">'
);

fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', content);
