const fs = require('fs');
let content = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

content = content.replace(
  /const itemsNeedingColor = items\.filter\(item => item\.imageUrls && item\.imageUrls\.length > 1 && !item\.selectedColor\);/,
  'const itemsNeedingColor = items.filter(item => !item.noColorVariations && item.imageUrls && item.imageUrls.length > 1 && !item.selectedColor);'
);

content = content.replace(
  /\{item\.imageUrls && item\.imageUrls\.length > 1 && \(/,
  '{!item.noColorVariations && item.imageUrls && item.imageUrls.length > 1 && ('
);

fs.writeFileSync('src/components/store/CartDrawer.tsx', content);
