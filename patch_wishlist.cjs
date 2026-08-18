const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

if (!code.includes("import { useWishlistStore }")) {
  // Try to create the wishlist store first
  const storeCode = `import { create } from 'zustand';
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
`;
  fs.writeFileSync('src/store/wishlistStore.ts', storeCode);
  
  // Patch Home.tsx
  code = code.replace(
    "import { Link, useNavigate } from 'react-router-dom';",
    "import { Link, useNavigate } from 'react-router-dom';\nimport { Heart } from 'lucide-react';\nimport { useWishlistStore } from '../../store/wishlistStore';"
  );
  
  const productCardOld = `const ProductCard: React.FC<{ product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product) => void }> = ({ product, openProductDetails, handleAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);`;

  const productCardNew = `const ProductCard: React.FC<{ product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product) => void }> = ({ product, openProductDetails, handleAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };`;

  code = code.replace(productCardOld, productCardNew);

  const imageContainerOld = `<div 
        className="w-full aspect-[3/4] bg-surface-container-low mb-6 relative overflow-hidden cursor-pointer"
        onClick={() => openProductDetails(product)}
      >`;

  const imageContainerNew = `<div 
        className="w-full aspect-[3/4] bg-surface-container-low mb-6 relative overflow-hidden cursor-pointer"
        onClick={() => openProductDetails(product)}
      >
        <button 
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-20 p-2 bg-surface-container-lowest/80 backdrop-blur rounded-full hover:bg-surface-container-lowest transition-colors shadow-sm"
        >
          <Heart className={\`w-5 h-5 \${isInWishlist(product.id) ? 'fill-primary text-primary' : 'text-on-surface-variant'}\`} />
        </button>`;

  code = code.replace(imageContainerOld, imageContainerNew);

  fs.writeFileSync('src/pages/store/Home.tsx', code);
  console.log("Wishlist patched in Home");
}
