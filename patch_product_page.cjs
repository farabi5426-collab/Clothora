const fs = require('fs');
const file = 'src/pages/store/ProductPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update Product interface
code = code.replace(
  "videoUrl?: string;",
  "videoUrl?: string;\n  sizes?: string[];"
);

// 2. Add state
code = code.replace(
  "const [copied, setCopied] = useState(false);",
  "const [copied, setCopied] = useState(false);\n  const [selectedSize, setSelectedSize] = useState<string | null>(null);"
);

// 3. Add Sizes UI
const sizesUI = `
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Size</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={\`px-6 py-3 text-sm font-bold uppercase tracking-widest border transition-all \${selectedSize === size ? 'bg-primary text-on-primary border-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary hover:text-on-surface'}\`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
`;

code = code.replace(
  "<div className=\"mt-auto pt-8 border-t border-outline-variant\">",
  `${sizesUI}\n            <div className="mt-auto pt-8 border-t border-outline-variant">`
);

// 4. Update Add To Cart logic (two places: BUY NOW and ADD TO CART)
const oldAddToCart1 = `onClick={() => {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice
                    }, true);
                  }}`;

const newAddToCart1 = `onClick={() => {
                    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                      toast.error('Please select a size first.');
                      return;
                    }
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice,
                      selectedSize: selectedSize || undefined
                    }, true);
                  }}`;

code = code.replace(oldAddToCart1, newAddToCart1);

const oldAddToCart2 = `onClick={() => {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice
                    });
                    toast.success('Added to cart!');
                  }}`;

const newAddToCart2 = `onClick={() => {
                    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                      toast.error('Please select a size first.');
                      return;
                    }
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice,
                      selectedSize: selectedSize || undefined
                    });
                    toast.success('Added to cart!');
                  }}`;

code = code.replace(oldAddToCart2, newAddToCart2);

fs.writeFileSync(file, code);
