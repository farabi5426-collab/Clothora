const fs = require('fs');
let content = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf8');

content = content.replace(
  /sizes\?: string\[\];/g,
  'sizes?: string[];\n  costPrice?: number;\n  noColorVariations?: boolean;'
);

content = content.replace(
  /sizes: product\.sizes \|\| \[\], imageUrls: product\.imageUrls \|\| \[\]/g,
  'sizes: product.sizes || [], imageUrls: product.imageUrls || [], noColorVariations: product.noColorVariations || false'
);

fs.writeFileSync('src/pages/store/ProductPage.tsx', content);
