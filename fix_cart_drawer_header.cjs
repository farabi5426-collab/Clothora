const fs = require('fs');
let content = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

content = content.replace(
  /\{items\.some\(item => item\.imageUrls && item\.imageUrls\.length > 1\) && \(/,
  '{items.some(item => !item.noColorVariations && item.imageUrls && item.imageUrls.length > 1) && ('
);

fs.writeFileSync('src/components/store/CartDrawer.tsx', content);
