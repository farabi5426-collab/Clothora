const fs = require('fs');
const file = './src/store/cartStore.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "addToCart: (product: Omit<CartItem, 'quantity'>) => void;",
  "addToCart: (product: Omit<CartItem, 'quantity'>, openCart?: boolean) => void;\n  setCartOpen: (isOpen: boolean) => void;"
);

content = content.replace(
  "addToCart: (product) => set((state) => {",
  "setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),\n  addToCart: (product, openCart = false) => set((state) => {"
);

content = content.replace(/isCartOpen: true/g, 'isCartOpen: openCart');

fs.writeFileSync(file, content, 'utf8');
