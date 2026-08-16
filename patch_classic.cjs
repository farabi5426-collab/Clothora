const fs = require('fs');
let code = fs.readFileSync('src/components/store/layouts/ClassicGrid.tsx', 'utf8');

code = code.replace(
  `              <h3 className="text-[20px] font-black text-on-surface uppercase leading-tight mb-[16px]">
                {product.title}
              </h3>
              <div className="mt-auto flex items-center justify-between">`,
  `              <h3 className="text-[20px] font-black text-on-surface uppercase leading-tight mb-[16px]">
                {product.title}
              </h3>
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={(e) => { e.preventDefault(); setSelectedSizes(prev => ({...prev, [product.id]: size})); }}
                      className={\`w-8 h-8 flex items-center justify-center text-xs font-bold border transition-colors \${selectedSizes[product.id] === size ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-surface-bright hover:border-primary'}\`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-auto flex items-center justify-between">`
);

code = code.replace(
  `                <button 
                  disabled={product.stock <= 0}
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
  `                <button 
                  disabled={product.stock <= 0}
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
                }}`
);

fs.writeFileSync('src/components/store/layouts/ClassicGrid.tsx', code);
