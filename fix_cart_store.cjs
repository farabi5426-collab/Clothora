const fs = require('fs');
let content = fs.readFileSync('src/store/cartStore.ts', 'utf8');

if (!content.includes('noColorVariations?: boolean;')) {
    content = content.replace(
      /cartItemId\?: string;/,
      'cartItemId?: string;\n  noColorVariations?: boolean;'
    );
}
fs.writeFileSync('src/store/cartStore.ts', content);
