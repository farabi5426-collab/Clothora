const fs = require('fs');
let code = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf8');

if (!code.includes("useWishlistStore")) {
  code = code.replace(
    "import {  ShoppingCart, ArrowLeft, Copy, Check , Video } from 'lucide-react';",
    "import {  ShoppingCart, ArrowLeft, Copy, Check , Video, Heart } from 'lucide-react';\nimport { useWishlistStore } from '../../store/wishlistStore';"
  );

  code = code.replace(
    "const [activeImageIndex, setActiveImageIndex] = useState(0);",
    "const [activeImageIndex, setActiveImageIndex] = useState(0);\n  const { toggleWishlist, isInWishlist } = useWishlistStore();"
  );

  const buttonGroup = `<button 
                onClick={handleCopyLink}
                className="bg-black/50 backdrop-blur text-on-background flex items-center justify-center border border-outline-variant hover:bg-primary transition-colors px-3 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                title="Copy product link"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>`;
              
  const newButtonGroup = `<button 
                onClick={handleCopyLink}
                className="bg-black/50 backdrop-blur text-on-background flex items-center justify-center border border-outline-variant hover:bg-primary transition-colors px-3 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                title="Copy product link"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
              {product && (
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="bg-black/50 backdrop-blur text-on-background flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors px-3 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  <Heart className={\`w-4 h-4 \${isInWishlist(product.id) ? 'fill-primary text-primary' : ''}\`} />
                </button>
              )}`;
              
  code = code.replace(buttonGroup, newButtonGroup);
  
  fs.writeFileSync('src/pages/store/ProductPage.tsx', code);
  console.log("Wishlist patched in ProductPage");
}
