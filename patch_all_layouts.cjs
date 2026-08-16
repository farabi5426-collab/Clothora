const fs = require('fs');
const path = require('path');
const layoutsDir = 'src/components/store/layouts';

const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(layoutsDir, file);
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Add sizes? to Product interface
  if (code.includes('interface Product {') && !code.includes('sizes?: string[];')) {
    code = code.replace(/interface Product \{\n([^}]*)\n\}/m, (match, body) => {
      if (!body.includes('sizes?:')) {
        return `interface Product {\n${body}\n  sizes?: string[];\n}`;
      }
      return match;
    });
  }

  // 2. Replace onClick={() => addToCart({
  // Since we might have multiline, we will do a regex
  code = code.replace(/onClick=\{\(\) => addToCart\(\{[\s\S]*?\}\)\}/g, (match) => {
    return `onClick={(e) => {
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
                }}`;
  });

  fs.writeFileSync(filePath, code);
}

console.log("Patched all layouts");
