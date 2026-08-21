const fs = require('fs');

let content = fs.readFileSync('src/pages/store/WishlistPage.tsx', 'utf8');

content = content.replace(
  /sizes: product\.sizes \|\| \[\],\s*imageUrls: product\.imageUrls \|\| \[\]/g,
  'sizes: product.sizes || [],\n                      imageUrls: product.imageUrls || [],\n                      noColorVariations: product.noColorVariations || false'
);

fs.writeFileSync('src/pages/store/WishlistPage.tsx', content);

