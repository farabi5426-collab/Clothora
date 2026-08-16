const fs = require('fs');
const file = 'src/store/cartStore.ts';
let code = fs.readFileSync(file, 'utf8');

// Add sizes? to CartItem interface
code = code.replace(
  "selectedSize?: string;",
  "selectedSize?: string;\n  sizes?: string[];"
);

// Add updateSize to CartStore interface
code = code.replace(
  "updateQuantity: (id: string, quantity: number) => void;",
  "updateQuantity: (id: string, quantity: number) => void;\n  updateSize: (id: string, newSize: string) => void;"
);

// Add updateSize implementation
const updateQuantityImpl = `updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      (item.cartItemId || item.id) === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),`;

const newImpl = `updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      (item.cartItemId || item.id) === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),
  updateSize: (id, newSize) => set((state) => {
    return {
      items: state.items.map(item => {
        if ((item.cartItemId || item.id) === id) {
          return { ...item, selectedSize: newSize, cartItemId: item.id + '-' + newSize };
        }
        return item;
      })
    };
  }),`;

code = code.replace(updateQuantityImpl, newImpl);

fs.writeFileSync(file, code);
