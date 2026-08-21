import { create } from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  costPrice?: number;
  imageUrl: string;
  quantity: number;
  selectedSize?: string;
  sizes?: string[];
  imageUrls?: string[];
  selectedColor?: string;
  cartItemId?: string;
  noColorVariations?: boolean;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>, openCart?: boolean) => void;
  setCartOpen: (isOpen: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSize: (id: string, newSize: string) => void;
  updateColor: (id: string, newColor: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isCartOpen: false,
  
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  addToCart: (product, openCart = false) => set((state) => {
    const cartItemId = product.id + (product.selectedSize ? `-${product.selectedSize}` : '') + (product.selectedColor ? `-color-${product.selectedColor}` : '');
    const existingItem = state.items.find(item => item.cartItemId === cartItemId || (!item.cartItemId && item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor));
    if (existingItem) {
      return {
        items: state.items.map(item =>
          (item.cartItemId === cartItemId || (!item.cartItemId && item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor))
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
  }),
  
  removeFromCart: (id) => set((state) => ({
    items: state.items.filter(item => (item.cartItemId || item.id) !== id)
  })),
  
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      (item.cartItemId || item.id) === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),
  updateSize: (id, newSize) => set((state) => {
    return {
      items: state.items.map(item => {
        if ((item.cartItemId || item.id) === id) {
          const newId = item.id + '-' + newSize + (item.selectedColor ? `-color-${item.selectedColor}` : '');
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
          const newId = item.id + (item.selectedSize ? `-${item.selectedSize}` : '') + `-color-${newColor}`;
          return { ...item, selectedColor: newColor, cartItemId: newId };
        }
        return item;
      })
    };
  }),
  
  clearCart: () => set({ items: [] }),
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen }))
}));
