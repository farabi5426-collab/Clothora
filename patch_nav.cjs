const fs = require('fs');
let code = fs.readFileSync('src/components/store/TopNavBar.tsx', 'utf8');

if (!code.includes("useWishlistStore")) {
  code = code.replace(
    "import { useCartStore } from '../../store/cartStore';",
    "import { useCartStore } from '../../store/cartStore';\nimport { useWishlistStore } from '../../store/wishlistStore';"
  );
  
  code = code.replace(
    "const { items, toggleCart } = useCartStore();",
    "const { items, toggleCart } = useCartStore();\n  const { items: wishlistItems } = useWishlistStore();"
  );
  
  const iconCode = `          <Link to="/wishlist" aria-label="favorite" className="text-on-surface hover:text-primary transition-colors relative group hidden sm:block">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">favorite</span>
            {wishlistItems.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={wishlistItems.length}
                className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface"
              >
                {wishlistItems.length}
              </motion.span>
            )}
          </Link>`;
          
  code = code.replace(
    "<button \n            id=\"cart-icon\"",
    iconCode + "\n          <button \n            id=\"cart-icon\""
  );
  
  // also add for mobile menu if needed, but it should be fine.
  
  fs.writeFileSync('src/components/store/TopNavBar.tsx', code);
  console.log("Navbar patched");
}
