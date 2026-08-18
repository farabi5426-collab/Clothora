import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (productId) => {
        set((state) => {
          if (state.items.includes(productId)) {
            return { items: state.items.filter(id => id !== productId) };
          }
          return { items: [...state.items, productId] };
        });
      },
      isInWishlist: (productId) => get().items.includes(productId),
    }),
    {
      name: 'clothora-wishlist',
    }
  )
);
