const fs = require('fs');
let code = fs.readFileSync('src/components/store/layouts/MagazineStyle.tsx', 'utf8');

code = code.replace(
  `          <button 
            disabled={featured.stock <= 0}
            onClick={(e) => {
                  e.preventDefault();
                  if (product.sizes && product.sizes.length > 0) {
                     window.location.href = \`/product/\${product.id}\`;
                  } else {
                     addToCart({
                       id: product.id,
                       title: product.title,
                       price: product.price,
                       imageUrl: product.imageUrl || ''
                     });
                  }
                }}`,
  `          {featured.sizes && featured.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {featured.sizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => { e.preventDefault(); setSelectedSizes(prev => ({...prev, [featured.id]: size})); }}
                  className={\`w-10 h-10 flex items-center justify-center text-sm font-bold border transition-colors \${selectedSizes[featured.id] === size ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-surface-bright hover:border-primary'}\`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <button 
            disabled={featured.stock <= 0}
            onClick={(e) => {
                  e.preventDefault();
                  if (featured.sizes && featured.sizes.length > 0 && !selectedSizes[featured.id]) {
                     toast.error('Please select a size first');
                     return;
                  }
                  addToCart({
                       id: featured.id,
                       title: featured.title,
                       price: featured.price,
                       imageUrl: featured.imageUrl || '',
                       sizes: featured.sizes || [],
                       selectedSize: selectedSizes[featured.id] || undefined
                  }, true);
            }}`
);
fs.writeFileSync('src/components/store/layouts/MagazineStyle.tsx', code);
