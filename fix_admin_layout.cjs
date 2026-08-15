const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf-8');

// Change parent from min-h-screen to h-screen
content = content.replace(
  '<div className="min-h-screen bg-background text-on-background font-sans flex flex-col md:flex-row">',
  '<div className="h-screen w-full bg-background text-on-background font-sans flex flex-col md:flex-row overflow-hidden">'
);

// Remove h-screen from child, change to flex-1
content = content.replace(
  '<div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">',
  '<div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">'
);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);
