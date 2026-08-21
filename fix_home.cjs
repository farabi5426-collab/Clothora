const fs = require('fs');

let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

content = content.replace(
  /sizes\?: string\[\];/g,
  'sizes?: string[];\n  costPrice?: number;\n  noColorVariations?: boolean;'
);

content = content.replace(
  /sizes: product\.sizes \|\| \[\], imageUrls: product\.imageUrls \|\| \[\]/g,
  'sizes: product.sizes || [], imageUrls: product.imageUrls || [], noColorVariations: product.noColorVariations || false'
);

content = content.replace(
  /sizes: selectedProduct\.sizes \|\| \[\], imageUrls: selectedProduct\.imageUrls \|\| \[\]/g,
  'sizes: selectedProduct.sizes || [], imageUrls: selectedProduct.imageUrls || [], noColorVariations: selectedProduct.noColorVariations || false'
);

fs.writeFileSync('src/pages/store/Home.tsx', content);

content = fs.readFileSync('src/pages/store/WishlistPage.tsx', 'utf8');

content = content.replace(
  /sizes\?: string\[\];/g,
  'sizes?: string[];\n  costPrice?: number;\n  noColorVariations?: boolean;'
);

content = content.replace(
  /sizes: product\.sizes \|\| \[\], imageUrls: product\.imageUrls \|\| \[\]/g,
  'sizes: product.sizes || [], imageUrls: product.imageUrls || [], noColorVariations: product.noColorVariations || false'
);

fs.writeFileSync('src/pages/store/WishlistPage.tsx', content);

