const fs = require('fs');
const file = './src/pages/store/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSection = `<div className="mt-auto pt-8 border-t border-outline-variant">
                  <button 
                    disabled={selectedProduct.stock <= 0}
                    onClick={(e) => {
                      handleAddToCart(e, selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full bg-primary text-on-primary py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {selectedProduct.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                  </button>
                  <p className="text-center text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-6">
                    Free shipping inside Dhaka
                  </p>
                </div>`;

const newSection = `<div className="mt-auto pt-8 border-t border-outline-variant">
                  <div className="flex flex-col md:flex-row gap-4">
                    <button 
                      disabled={selectedProduct.stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice
                        }, true);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-transparent border-2 border-[#ffffff] text-on-background py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      BUY NOW
                    </button>
                    <button 
                      disabled={selectedProduct.stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice
                        }, false);
                        toast.success(\`\${selectedProduct.title} added to cart\`);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-primary text-on-primary py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {selectedProduct.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                  <p className="text-center text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-6">
                    Free shipping inside Dhaka
                  </p>
                </div>`;

content = content.replace(oldSection, newSection);
fs.writeFileSync(file, content, 'utf8');
