const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

// 1. Revert ProductCard signature and state
code = code.replace(
  `const ProductCard: React.FC<{ product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product, size?: string) => void }> = ({ product, openProductDetails, handleAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);`,
  `const ProductCard: React.FC<{ product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product) => void }> = ({ product, openProductDetails, handleAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);`
);

// 2. Remove sizes from ProductCard UI
code = code.replace(
  `        <h3 className="text-lg font-black text-on-background uppercase leading-tight mb-4 line-clamp-2">
          {product.title}
        </h3>
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                className={\`w-8 h-8 flex items-center justify-center text-xs font-bold border transition-colors \${selectedSize === size ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary'}\`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto">`,
  `        <h3 className="text-lg font-black text-on-background uppercase leading-tight mb-4 line-clamp-2">
          {product.title}
        </h3>
        <div className="mt-auto">`
);

// 3. Update ProductCard handleAddToCart click
code = code.replace(
  `              <button 
                disabled={product.stock <= 0}
                onClick={(e) => handleAddToCart(e, product, selectedSize || undefined)}`,
  `              <button 
                disabled={product.stock <= 0}
                onClick={(e) => handleAddToCart(e, product)}`
);

// 4. Revert handleAddToCart function signature in Home
code = code.replace(
  `  const handleAddToCart = (e: React.MouseEvent, product: Product, selectedSize?: string) => {
    e.stopPropagation();
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size first');
      return;
    }
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl || '',
      sizes: product.sizes || [],
      selectedSize: selectedSize
    });`,
  `  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl || '',
      sizes: product.sizes || []
    });`
);

// 5. Remove modalSelectedSize state
code = code.replace(
  `  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalSelectedSize, setModalSelectedSize] = useState<string | null>(null);`,
  `  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);`
);

// 6. Revert openProductDetails
code = code.replace(
  `  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setModalSelectedSize(null);
  };`,
  `  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };`
);

// 7. Remove size selector from Modal
code = code.replace(
  `                <div className="text-3xl font-black text-on-background mb-8">
                  ৳{selectedProduct.price}
                </div>

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Select Size</span>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={(e) => { e.stopPropagation(); setModalSelectedSize(size); }}
                          className={\`px-6 py-3 text-sm font-bold uppercase tracking-widest border transition-all \${modalSelectedSize === size ? 'bg-primary text-on-primary border-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary hover:text-on-surface'}\`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="prose prose-invert max-w-none mb-10">`,
  `                <div className="text-3xl font-black text-on-background mb-8">
                  ৳{selectedProduct.price}
                </div>
                
                <div className="prose prose-invert max-w-none mb-10">`
);

// 8. Revert Modal Buy Now and Add to Cart
code = code.replace(
  `                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !modalSelectedSize) {
                          toast.error('Please select a size first');
                          return;
                        }
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice,
                          sizes: selectedProduct.sizes || [],
                          selectedSize: modalSelectedSize || undefined
                        }, true);
                        setSelectedProduct(null);
                      }}`,
  `                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice,
                          sizes: selectedProduct.sizes || []
                        }, true);
                        setSelectedProduct(null);
                      }}`
);

code = code.replace(
  `                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !modalSelectedSize) {
                          toast.error('Please select a size first');
                          return;
                        }
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice,
                          sizes: selectedProduct.sizes || [],
                          selectedSize: modalSelectedSize || undefined
                        }, false);
                        toast.success(\`\${selectedProduct.title} added to cart\`);
                        setSelectedProduct(null);
                      }}`,
  `                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice,
                          sizes: selectedProduct.sizes || []
                        }, false);
                        toast.success(\`\${selectedProduct.title} added to cart\`);
                        setSelectedProduct(null);
                      }}`
);

fs.writeFileSync('src/pages/store/Home.tsx', code);
