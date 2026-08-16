const fs = require('fs');
let code = fs.readFileSync('src/components/store/layouts/Lookbook.tsx', 'utf8');

code = code.replace(
  `              <span className="text-[32px] font-black text-on-surface mt-[8px] block drop-shadow-md">
                ৳{product.price}
              </span>
            </div>`,
  `              <span className="text-[32px] font-black text-on-surface mt-[8px] block drop-shadow-md">
                ৳{product.price}
              </span>
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={(e) => { e.preventDefault(); setSelectedSizes(prev => ({...prev, [product.id]: size})); }}
                      className={\`w-10 h-10 flex items-center justify-center text-sm font-bold border transition-colors \${selectedSizes[product.id] === size ? 'bg-primary text-on-primary border-primary' : 'bg-surface/50 text-on-surface-variant border-surface-bright hover:border-primary backdrop-blur-md'}\`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>`
);

code = code.replace(
  `              onClick={(e) => {
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
  `              onClick={(e) => {
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

fs.writeFileSync('src/components/store/layouts/Lookbook.tsx', code);
