const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

const regex = /\{\/\* Product Discovery: Best Sellers \& New Arrivals \*\/\}\s*<section className="w-full max-w-\[1920px\] mx-auto px-4 md:px-16 py-16 space-y-24">\s*\{\/\* Best Sellers \*\/\}\s*\{bestSellers.length > 0 && \(/;

const productDiscovery = `{/* Product Discovery: Best Sellers & New Arrivals */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-16 py-16 space-y-24">
        
        {/* Category View */}
        {activeCategory !== 'All' && filteredProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-10 border-b border-outline-variant pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-on-background uppercase tracking-tighter leading-none flex items-center gap-3">
                  {activeCategory}
                </h2>
                <p className="text-xs text-primary font-bold uppercase tracking-[0.1em] mt-2">Explore the collection</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(renderProductCard)}
            </div>
          </div>
        )}

        {/* Best Sellers (Only in All) */}
        {activeCategory === 'All' && bestSellers.length > 0 && (`;

code = code.replace(regex, productDiscovery);

const newArrivalsRegex = /\{\/\* New Arrivals \*\/\}\s*\{newArrivals\.length > 0 && \(/;
const newArrivals = `{/* New Arrivals */}
        {activeCategory === 'All' && newArrivals.length > 0 && (`;
code = code.replace(newArrivalsRegex, newArrivals);

fs.writeFileSync('src/pages/store/Home.tsx', code);
