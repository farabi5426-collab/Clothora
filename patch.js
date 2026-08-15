const fs = require('fs');
const content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');
const appendText = `
      {/* Flying Images Animation */}
      {flyingImages.map(img => (
        <motion.img
          key={img.id}
          src={img.src}
          className="fixed z-[100] w-16 h-16 object-cover rounded-none border border-[#ff4e00]"
          initial={{ top: img.startY - 32, left: img.startX - 32, scale: 1, opacity: 1 }}
          animate={{ 
            top: 20, 
            left: window.innerWidth - 60,
            scale: 0.1, 
            opacity: 0 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      ))}

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[#111] border border-[#ffffff15] w-full max-w-5xl max-h-[90vh] overflow-y-auto z-10 grid grid-cols-1 md:grid-cols-2 shadow-[8px_8px_0px_#ff4e00] scrollbar-hide"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur text-white flex items-center justify-center border border-[#ffffff15] hover:bg-[#ff4e00] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Gallery */}
              <div className="bg-[#1a1a1a] flex flex-col p-4 sm:p-8 gap-4 border-b md:border-b-0 md:border-r border-[#ffffff15]">
                <div className="w-full aspect-[3/4] relative border border-[#ffffff15]">
                  <img 
                    src={selectedProduct.imageUrls?.[activeImageIndex] || selectedProduct.imageUrl} 
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.imageUrls.map((url, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={\`w-20 h-24 flex-shrink-0 border transition-all \${activeImageIndex === idx ? 'border-[#ff4e00] opacity-100' : 'border-[#ffffff15] opacity-50 hover:opacity-100'}\`}
                      >
                        <img src={url} alt={\`\${selectedProduct.title} \${idx+1}\`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 sm:p-10 flex flex-col">
                <span className="text-[#ff4e00] text-xs font-bold uppercase tracking-widest mb-4">
                  {selectedProduct.category}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white mb-6 leading-tight">
                  {selectedProduct.title}
                </h2>
                <div className="text-3xl font-black text-white mb-8">
                  ৳{selectedProduct.price}
                </div>
                
                <div className="prose prose-invert max-w-none mb-10">
                  <p className="text-[#ffffff80] leading-relaxed whitespace-pre-wrap">
                    {selectedProduct.description || "Premium quality product. Crafted with care and designed for the modern aesthetics. Stand out from the crowd."}
                  </p>
                </div>

                <div className="mt-auto pt-8 border-t border-[#ffffff15]">
                  <button 
                    disabled={selectedProduct.stock <= 0}
                    onClick={(e) => {
                      handleAddToCart(e as any, selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full bg-[#ff4e00] text-white py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {selectedProduct.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                  </button>
                  <p className="text-center text-[#ffffff40] text-xs font-bold uppercase tracking-widest mt-6">
                    Free shipping inside Dhaka
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
`;
const newContent = content.replace(/    <\/main>\n  \);\n}\n?$/, appendText);
fs.writeFileSync('src/pages/store/Home.tsx', newContent);
