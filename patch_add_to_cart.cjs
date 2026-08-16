const fs = require('fs');

const files = [
  'src/components/store/layouts/MasonryGrid.tsx',
  'src/components/store/layouts/SplitScreen.tsx',
  'src/components/store/layouts/HorizontalGallery.tsx',
  'src/components/store/layouts/MagazineStyle.tsx',
  'src/components/store/layouts/ClassicGrid.tsx',
  'src/components/store/layouts/Lookbook.tsx',
  'src/pages/store/Home.tsx',
  'src/pages/store/ProductPage.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace `sizes: (.*?)\.sizes \|\| \[\]` with `sizes: $1.sizes || [], imageUrls: $1.imageUrls || []`
    code = code.replace(/sizes:\s*(.*?)\.sizes\s*\|\|\s*\[\]/g, 'sizes: $1.sizes || [], imageUrls: $1.imageUrls || []');

    // For places where sizes was missing (e.g. MagazineStyle featured might not have had sizes originally but we added it)
    // Actually, in the last revert we might have removed sizes completely from some `addToCart` calls?
    // Let's check `MagazineStyle.tsx`
    fs.writeFileSync(file, code);
  }
});
console.log('done');
