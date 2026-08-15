const fs = require('fs');

const files = [
  'src/pages/admin/BannersManagement.tsx',
  'src/pages/admin/OrdersManagement.tsx',
  'src/pages/admin/ProductsManagement.tsx',
  'src/pages/admin/PromoCodesManagement.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  // Usually it is `<div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">`
  content = content.replace(
    'className="bg-surface-container-lowest border border-outline-variant overflow-hidden"',
    'className="bg-surface-container-lowest border border-outline-variant overflow-x-auto"'
  );
  fs.writeFileSync(file, content);
}
