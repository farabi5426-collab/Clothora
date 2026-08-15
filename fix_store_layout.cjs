const fs = require('fs');
let content = fs.readFileSync('src/layouts/store/StoreLayout.tsx', 'utf-8');

content = content.replace(
  '<div className="min-h-screen flex flex-col font-body-md text-on-background bg-background selection:bg-primary-container selection:text-black">',
  '<div className="min-h-screen flex flex-col font-body-md text-on-background bg-background selection:bg-primary-container selection:text-black overflow-x-hidden">'
);

fs.writeFileSync('src/layouts/store/StoreLayout.tsx', content);
