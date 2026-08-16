const fs = require('fs');
const file = 'src/pages/store/ProductPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// For both buttons
code = code.replace(/costPrice: product\.costPrice,/g, "costPrice: product.costPrice,\n                      sizes: product.sizes || [],");

fs.writeFileSync(file, code);
