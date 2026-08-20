const fs = require('fs');

let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

content = content.replace(
  /nav className="flex-1 /g,
  'nav className="md:flex-1 '
);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);
