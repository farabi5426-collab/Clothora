const fs = require('fs');

let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

content = content.replace(
  /sizes: selectedProduct\.sizes \|\| \[\], imageUrls: selectedProduct\.imageUrls \|\| \[\]\s*\}/g,
  'sizes: selectedProduct.sizes || [], imageUrls: selectedProduct.imageUrls || [], noColorVariations: selectedProduct.noColorVariations || false\n                        }'
);

fs.writeFileSync('src/pages/store/Home.tsx', content);

