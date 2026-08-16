const fs = require('fs');
let code = fs.readFileSync('src/components/store/layouts/MagazineStyle.tsx', 'utf8');

// Fix featured sizes and add to cart
code = code.replace(
  `          <div className="flex justify-between items-start mb-[16px]">
            <div>
              <span className="text-[14px] text-primary font-bold uppercase tracking-[0.2em] mb-[12px] block">
                FEATURED • {featured.category}
              </span>
              <h3 className="text-[32px] md:text-[48px] font-black text-on-surface uppercase leading-none tracking-tighter">
                {featured.title}
              </h3>
            </div>
            <span className="text-[32px] md:text-[48px] font-black text-primary leading-none">
              ৳{featured.price}
            </span>
          </div>
                    
          <button 
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
  `          <div className="flex justify-between items-start mb-[16px]">
            <div>
              <span className="text-[14px] text-primary font-bold uppercase tracking-[0.2em] mb-[12px] block">
                FEATURED • {featured.category}
              </span>
              <h3 className="text-[32px] md:text-[48px] font-black text-on-surface uppercase leading-none tracking-tighter">
                {featured.title}
              </h3>
            </div>
            <span className="text-[32px] md:text-[48px] font-black text-primary leading-none">
              ৳{featured.price}
            </span>
          </div>

          {featured.sizes && featured.sizes.length > 0 && (
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

// Fix others sizes and add to cart
code = code.replace(
  `            <div className="absolute inset-0 bg-surface-container-lowest/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
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
  `            <div className="absolute inset-0 bg-surface-container-lowest/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
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

code = code.replace(
  `          <div className="mt-auto">
            <h3 className="text-[16px] font-black text-on-surface uppercase leading-tight line-clamp-1 mb-[4px]">
              {product.title}
            </h3>
            <div className="flex justify-between items-center">`,
  `          <div className="mt-auto">
            <h3 className="text-[16px] font-black text-on-surface uppercase leading-tight line-clamp-1 mb-[4px]">
              {product.title}
            </h3>
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
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
            )}
            <div className="flex justify-between items-center">`
);

fs.writeFileSync('src/components/store/layouts/MagazineStyle.tsx', code);
