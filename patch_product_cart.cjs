const fs = require('fs');
const file = 'src/pages/store/ProductPage.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldCode = `onClick={() => {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice
                    }, false);
                    toast.success(\`\${product.title} added to cart\`);
                  }}`;

const newCode = `onClick={() => {
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
                    }, false);
                    toast.success(\`\${product.title} added to cart\`);
                  }}`;

code = code.replace(oldCode, newCode);
fs.writeFileSync(file, code);
