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
    
    // Replace imageUrl: product.imageUrl || '',\n sizes: 
    // Wait, let's be more robust.
    // We want to add costPrice: product.costPrice right before sizes:
    code = code.replace(/imageUrl:\s*(product\.imageUrl\s*\|\|\s*''|product\.imageUrl),\s*sizes:/g, 
                        'imageUrl: $1,\n      costPrice: product.costPrice,\n      sizes:');
                        
    // Wait, some might use `item` or something else? Let's check WishlistPage.tsx
    // WishlistPage might use `product`
    
    fs.writeFileSync(file, code);
  }
});
