const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

content = content.replace(
  /<div className="custom-scrollbar">/g,
  '<div className="custom-scrollbar overflow-x-auto overflow-y-auto max-h-[400px]">'
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
