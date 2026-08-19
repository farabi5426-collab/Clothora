const fs = require('fs');

const filesToFix = [
  'src/components/store/layouts/ClassicGrid.tsx',
  'src/components/store/layouts/Lookbook.tsx',
  'src/components/store/layouts/SplitScreen.tsx',
  'src/components/store/layouts/MagazineStyle.tsx',
  'src/components/store/layouts/HorizontalGallery.tsx',
  'src/components/store/layouts/MasonryGrid.tsx',
  'src/pages/store/WishlistPage.tsx',
  'src/pages/store/Home.tsx',
  'src/pages/store/ProductPage.tsx'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Pattern: imageUrl: (obj).imageUrl || '',\n sizes: 
    code = code.replace(/imageUrl:\s*([a-zA-Z0-9_]+)\.imageUrl\s*\|\|\s*'',\s*sizes:/g, 
                        'imageUrl: $1.imageUrl || \'\',\n      costPrice: $1.costPrice,\n      sizes:');
    
    fs.writeFileSync(file, code);
  }
});
