import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (items.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        // Firestore 'in' query supports up to 10 items.
        // For simplicity, chunking isn't implemented here. Assuming < 10 for demo.
        const chunkedItems = items.slice(0, 10);
        const q = query(collection(db, 'products'), where('__name__', 'in', chunkedItems));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
      } catch (err) {
        console.error("Error fetching wishlist", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [items]);

  return (
    <main className="min-h-screen pt-32 pb-16 bg-background text-on-background px-4 md:px-16 flex justify-center">
      <div className="w-full max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-background mb-8 font-bold uppercase tracking-widest text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-on-background border-b-2 border-surface-bright pb-6 flex items-center gap-4">
          <Heart className="w-10 h-10 text-primary fill-primary" /> My Wishlist
        </h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest border-2 border-surface-bright p-8">
            <Heart className="w-16 h-16 text-on-surface-variant mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-on-surface">Your wishlist is empty</h2>
            <p className="text-on-surface-variant mb-8 font-bold uppercase tracking-widest text-sm">Save your favorite items here.</p>
            <Link to="/" className="inline-block bg-primary text-on-primary px-8 py-4 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_var(--color-on-surface)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-surface)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="group bg-surface-container-lowest border-2 border-surface-bright p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200">
                <Link to={\`/product/\${product.id}\`} className="w-full aspect-[3/4] bg-surface-container-low mb-4 relative overflow-hidden block">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-6 right-6 z-20 p-2 bg-surface-container-lowest/80 backdrop-blur rounded-full hover:bg-surface-container-lowest transition-colors shadow-sm"
                  title="Remove from Wishlist"
                >
                  <Heart className="w-5 h-5 fill-primary text-primary" />
                </button>
                <Link to={\`/product/\${product.id}\`}>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                </Link>
                <div className="text-lg font-black text-primary mt-auto mb-4">৳{product.price}</div>
                <button 
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice,
                      sizes: product.sizes || [],
                      imageUrls: product.imageUrls || []
                    }, false);
                    toast.success(\`\${product.title} added to cart\`);
                  }}
                  disabled={product.stock <= 0}
                  className="w-full bg-surface-container-high text-on-surface py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-transparent hover:border-on-surface"
                >
                  <ShoppingCart className="w-4 h-4" /> {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
