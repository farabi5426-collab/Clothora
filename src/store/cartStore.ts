import { create } from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  costPrice?: number;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>, openCart?: boolean) => void;
  setCartOpen: (isOpen: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isCartOpen: false,
  
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  addToCart: (product, openCart = false) => set((state) => {
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
  }),
  
  removeFromCart: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),
  
  clearCart: () => set({ items: [] }),
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen }))
}));
