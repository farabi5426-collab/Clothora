const fs = require('fs');
let code = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf8');

// Remove selectedSize state
code = code.replace(/const \[selectedSize, setSelectedSize\] = useState<string \| null>\(null\);\n/g, '');

// Remove size selection block
code = code.replace(/\{product\.sizes && product\.sizes\.length > 0 && \([\s\S]*?<\/div>\s*\)\s*\}/g, '');

// Update BUY NOW onClick
code = code.replace(/if \(product\.sizes && product\.sizes\.length > 0 && !selectedSize\) \{\s*toast\.error\('Please select a size first\.'\);\s*return;\s*\}/g, '');
code = code.replace(/selectedSize:\s*selectedSize\s*\|\|\s*undefined/g, '');
code = code.replace(/sizes:\s*product\.sizes\s*\|\|\s*\[\],\s*\n/g, 'sizes: product.sizes || []\n');

fs.writeFileSync('src/pages/store/ProductPage.tsx', code);
