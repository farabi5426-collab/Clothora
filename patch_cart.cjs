const fs = require('fs');
const file = 'src/store/cartStore.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Update CartItem
code = code.replace(
  "imageUrl: string;\n  quantity: number;",
  "imageUrl: string;\n  quantity: number;\n  selectedSize?: string;\n  cartItemId?: string;"
);

// 2. Update addToCart logic
const oldAddToCart = `addToCart: (product, openCart = false) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
        isCartOpen: openCart
      };
    }
    return { 
      items: [...state.items, { ...product, quantity: 1 }],
      isCartOpen: openCart 
    };
  }),`;

const newAddToCart = `addToCart: (product, openCart = false) => set((state) => {
    const cartItemId = product.id + (product.selectedSize ? \`-\${product.selectedSize}\` : '');
    const existingItem = state.items.find(item => item.cartItemId === cartItemId || (!item.cartItemId && item.id === product.id && item.selectedSize === product.selectedSize));
    if (existingItem) {
      return {
        items: state.items.map(item =>
          (item.cartItemId === cartItemId || (!item.cartItemId && item.id === product.id && item.selectedSize === product.selectedSize))
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ),
        isCartOpen: openCart
      };
    }
    return { 
      items: [...state.items, { ...product, quantity: 1, cartItemId }],
      isCartOpen: openCart 
    };
  }),`;

code = code.replace(oldAddToCart, newAddToCart);

// 3. Update removeFromCart
code = code.replace(
  "items: state.items.filter(item => item.id !== id)",
  "items: state.items.filter(item => (item.cartItemId || item.id) !== id)"
);

// 4. Update updateQuantity
code = code.replace(
  "item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item",
  "(item.cartItemId || item.id) === id ? { ...item, quantity: Math.max(1, quantity) } : item"
);

fs.writeFileSync(file, code);
