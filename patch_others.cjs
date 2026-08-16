const fs = require('fs');

const fixSizes = (file) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Replace addToCart onClick logic
  const oldOnClick = `onClick={(e) => {
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
                }}`;
  
  const newOnClick = `onClick={(e) => {
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
                }}`;
  
  code = code.split(oldOnClick).join(newOnClick);

  // We need to inject the size selection UI somewhere. 
  // Let's just do it manually for each if possible, or append to product title
  const oldTitle = `{product.title}
            </h3>`;
  const newTitle = `{product.title}
            </h3>
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 mb-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={(e) => { e.preventDefault(); setSelectedSizes(prev => ({...prev, [product.id]: size})); }}
                    className={\`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-colors \${selectedSizes[product.id] === size ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-surface-bright hover:border-primary'}\`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}`;

  code = code.split(oldTitle).join(newTitle);
  fs.writeFileSync(file, code);
}

fixSizes('src/components/store/layouts/HorizontalGallery.tsx');
fixSizes('src/components/store/layouts/SplitScreen.tsx');
fixSizes('src/components/store/layouts/MasonryGrid.tsx');
