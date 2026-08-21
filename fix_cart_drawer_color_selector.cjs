const fs = require('fs');
let content = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

content = content.replace(
  /\{items\.filter\(item => item\.imageUrls && item\.imageUrls\.length > 1\)\.map\(item => \(/,
  '{items.filter(item => !item.noColorVariations && item.imageUrls && item.imageUrls.length > 1).map(item => ('
);

fs.writeFileSync('src/components/store/CartDrawer.tsx', content);
