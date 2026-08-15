const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf-8');

content = content.replace(
  "imageUrl: '', imageUrls: [], videoUrl: '', showInBanner: false as string[], videoUrl: '', showInBanner: false",
  "imageUrl: '', imageUrls: [] as string[], videoUrl: '', showInBanner: false"
);

content = content.replace(
  "imageUrl: '', imageUrls: [], videoUrl: '', showInBanner: false",
  "imageUrl: '', imageUrls: [], videoUrl: '', showInBanner: false"
); // check second one (resetForm)

fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', content);
