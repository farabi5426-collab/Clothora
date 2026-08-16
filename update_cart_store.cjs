const fs = require('fs');
let code = fs.readFileSync('src/store/cartStore.ts', 'utf8');

code = code.replace(
  /sizes\?: string\[\];/,
  `sizes?: string[];
  imageUrls?: string[];
  selectedColor?: string;`
);

code = code.replace(
  /updateSize: \(id: string, newSize: string\) => void;/,
  `updateSize: (id: string, newSize: string) => void;
  updateColor: (id: string, newColor: string) => void;`
);

code = code.replace(
  /const cartItemId = product\.id \+ \(product\.selectedSize \? \`-\$\{product\.selectedSize\}\` : ''\);/,
  `const cartItemId = product.id + (product.selectedSize ? \`-\${product.selectedSize}\` : '') + (product.selectedColor ? \`-color-\${product.selectedColor}\` : '');`
);

code = code.replace(
  /const existingItem = state\.items\.find\(item => item\.cartItemId === cartItemId \|\| \(\!item\.cartItemId && item\.id === product\.id && item\.selectedSize === product\.selectedSize\)\);/g,
  `const existingItem = state.items.find(item => item.cartItemId === cartItemId || (!item.cartItemId && item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor));`
);

code = code.replace(
  /\(item\.cartItemId === cartItemId \|\| \(\!item\.cartItemId && item\.id === product\.id && item\.selectedSize === product\.selectedSize\)\)/g,
  `(item.cartItemId === cartItemId || (!item.cartItemId && item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor))`
);

code = code.replace(
  /updateSize: \(id, newSize\) => set\(\(state\) => \{[\s\S]*?\}\),/,
  `updateSize: (id, newSize) => set((state) => {
    return {
      items: state.items.map(item => {
        if ((item.cartItemId || item.id) === id) {
          const newId = item.id + '-' + newSize + (item.selectedColor ? \`-color-\${item.selectedColor}\` : '');
          return { ...item, selectedSize: newSize, cartItemId: newId };
        }
        return item;
      })
    };
  }),
  updateColor: (id, newColor) => set((state) => {
    return {
      items: state.items.map(item => {
        if ((item.cartItemId || item.id) === id) {
          const newId = item.id + (item.selectedSize ? \`-\${item.selectedSize}\` : '') + \`-color-\${newColor}\`;
          return { ...item, selectedColor: newColor, cartItemId: newId };
        }
        return item;
      })
    };
  }),`
);

fs.writeFileSync('src/store/cartStore.ts', code);
