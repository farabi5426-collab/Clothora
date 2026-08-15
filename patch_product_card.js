const fs = require('fs');

const content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

const productCardComponent = `
function ProductCard({ product, openProductDetails, handleAddToCart }: { product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product) => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : (product.imageUrl ? [product.imageUrl] : []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="group bg-[#111] border border-[#ffffff15] p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#ff4e00] duration-200 rounded-none">
      <div 
        className="w-full aspect-[3/4] bg-[#1a1a1a] mb-6 relative overflow-hidden cursor-pointer"
        onClick={() => openProductDetails(product)}
      >
        {images.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImageIndex}
              src={images[currentImageIndex]} 
              alt={product.title} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#ffffff40] font-bold uppercase tracking-widest text-xs">
            NO IMAGE
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white z-10 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#fff]">
            SOLD OUT
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={\`h-1 rounded-full transition-all duration-300 \${idx === currentImageIndex ? 'w-4 bg-[#ff4e00]' : 'w-1.5 bg-white/50'}\`} 
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <span className="text-xs text-[#ff4e00] font-bold uppercase tracking-widest mb-2">
          {product.category || 'Uncategorized'}
        </span>
        <h3 className="text-lg font-black text-white uppercase leading-tight mb-4 line-clamp-2">
          {product.title}
        </h3>
        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-[#ff4e00] text-[#ff4e00]" />
            <span className="text-[#ffffff80] text-xs font-bold tracking-wider">4.8 (124)</span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-2xl font-black text-white mb-2">
              ৳{product.price}
            </div>
            <div className="flex gap-2">
              <button 
                disabled={product.stock <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  openProductDetails(product);
                }}
                className="flex-1 bg-transparent border-2 border-[#ffffff] text-white flex items-center justify-center py-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button 
                disabled={product.stock <= 0}
                onClick={(e) => handleAddToCart(e, product)}
                className="flex-1 bg-[#ff4e00] text-white flex items-center justify-center py-3 gap-2 shadow-[2px_2px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
              >
                <ShoppingCart className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
`;

let newContent = content.replace('export default function Home() {', productCardComponent);

// Also need to replace the old renderProductCard inside Home()
// We can just find the renderProductCard function and replace it with a call to ProductCard

const oldRenderFunction = `  const renderProductCard = (product: Product) => (
    <div key={product.id} className="group bg-[#111] border border-[#ffffff15] p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#ff4e00] duration-200 rounded-none">
      <div 
        className="w-full aspect-[3/4] bg-[#1a1a1a] mb-6 relative overflow-hidden cursor-pointer"
        onClick={() => openProductDetails(product)}
      >
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#ffffff40] font-bold uppercase tracking-widest text-xs">
            NO IMAGE
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#fff]">
            SOLD OUT
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <span className="text-xs text-[#ff4e00] font-bold uppercase tracking-widest mb-2">
          {product.category || 'Uncategorized'}
        </span>
        <h3 className="text-lg font-black text-white uppercase leading-tight mb-4">
          {product.title}
        </h3>
        <div className="mt-auto">
          {/* Social Proof Star Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-[#ff4e00] text-[#ff4e00]" />
            <span className="text-[#ffffff80] text-xs font-bold tracking-wider">4.8 (124)</span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-2xl font-black text-white mb-2">
              ৳{product.price}
            </div>
            <div className="flex gap-2">
              <button 
                disabled={product.stock <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  openProductDetails(product);
                }}
                className="flex-1 bg-transparent border-2 border-[#ffffff] text-white flex items-center justify-center py-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button 
                disabled={product.stock <= 0}
                onClick={(e) => handleAddToCart(e, product)}
                className="flex-1 bg-[#ff4e00] text-white flex items-center justify-center py-3 gap-2 shadow-[2px_2px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
              >
                <ShoppingCart className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );`;

newContent = newContent.replace(oldRenderFunction, `  const renderProductCard = (product: Product) => (
    <ProductCard 
      key={product.id} 
      product={product} 
      openProductDetails={openProductDetails} 
      handleAddToCart={handleAddToCart} 
    />
  );`);

fs.writeFileSync('src/pages/store/Home.tsx', newContent);
