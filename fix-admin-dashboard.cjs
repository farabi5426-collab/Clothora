const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

// Header
content = content.replace(
  /<div className="flex items-center justify-between">/,
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">'
);

content = content.replace(
  /<div className="flex items-center gap-3">/,
  '<div className="flex flex-wrap items-center gap-3">'
);

// Net Profit Header
content = content.replace(
  /<div className="flex items-center justify-between">/g, // Replaces any remaining "flex items-center justify-between" (the Net Profit one)
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">'
);

// Business Expenses Header
content = content.replace(
  /<div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-6">/,
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant mb-6 gap-4">'
);

// Final Net profit Amount block
content = content.replace(
  /<div className="text-right">/,
  '<div className="text-left sm:text-right">'
);


fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
