const fs = require('fs');

const files = [
  'src/components/store/layouts/MasonryGrid.tsx',
  'src/components/store/layouts/SplitScreen.tsx',
  'src/components/store/layouts/HorizontalGallery.tsx',
  'src/components/store/layouts/MagazineStyle.tsx',
  'src/components/store/layouts/ClassicGrid.tsx',
  'src/components/store/layouts/Lookbook.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // 1. Remove useState for selectedSizes
  code = code.replace(/const \[selectedSizes, setSelectedSizes\] = useState<Record<string, string>>\(\{\}\);\n?/g, '');
  
  // Also clean up import { useState } if it's unused now. Let's just leave the import, it doesn't hurt.
  
  // 2. Remove size rendering block. It usually looks like:
  // {product.sizes && product.sizes.length > 0 && (
  //   <div className="flex flex-wrap gap-1 mb-2"> ... </div>
  // )}
  // Or for featured: {featured.sizes && featured.sizes.length > 0 && ( ... )}
  // We can use a regex to match the {product.sizes && ... } or {featured.sizes && ... } blocks.
  // Actually, let's just use string replacement for each specific file's pattern if possible, or regex.
  
  // Let's use a regex that matches `{.*\.sizes && .*\.sizes\.length > 0 && \([\s\S]*?<\/div>\s*\)\s*}`
  // But regex across multiple lines with brackets might be tricky.
  // Let's try to match it.
  code = code.replace(/\{(featured|product)\.sizes && \1\.sizes\.length > 0 && \([\s\S]*?<\/div>\s*\)\s*\}/g, '');
  code = code.replace(/\{item\.sizes && item\.sizes\.length > 0 && \([\s\S]*?<\/div>\s*\)\s*\}/g, '');

  // 3. Update onClick handlers
  // They look like this:
  /*
  onClick={(e) => {
    e.preventDefault();
    if (product.sizes && product.sizes.length > 0 && !selectedSizes[product.id]) {
       toast.error('Please select a size first');
       return;
    }
    addToCart({
         id: product.id,
         title: product.title,
         price: product.price,
         imageUrl: product.imageUrl || '',
         sizes: product.sizes || [],
         selectedSize: selectedSizes[product.id] || undefined
    }, true);
  }}
  */
  // I will replace all of those with a simpler onClick.
  code = code.replace(/if \((product|featured|item)\.sizes && \1\.sizes\.length > 0 && !selectedSizes\[\1\.id\]\) \{\s*toast\.error\('Please select a size first'\);\s*return;\s*\}/g, '');
  code = code.replace(/selectedSize:\s*selectedSizes\[.*?\]\s*\|\|\s*undefined/g, '');
  // Also remove trailing comma after sizes if selectedSize was the last one, or remove the empty line.
  code = code.replace(/sizes:\s*(product|featured|item)\.sizes\s*\|\|\s*\[\],\s*\n/g, 'sizes: $1.sizes || []\n');
  
  fs.writeFileSync(file, code);
});
console.log('Done');
