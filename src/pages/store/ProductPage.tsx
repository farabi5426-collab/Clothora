import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import {  ShoppingCart, ArrowLeft, Copy, Check , Video, Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  description?: string;
  imageUrls?: string[];
  videoUrl?: string;
  sizes?: string[];
  costPrice?: number;
  noColorVariations?: boolean;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Clothora`;

      const setMetaTag = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      setMetaTag('og:title', product.title);
      setMetaTag('og:description', product.description || `Buy ${product.title} at Clothora`);
      setMetaTag('og:image', product.imageUrl);
      setMetaTag('og:image:width', '1200');
      setMetaTag('og:image:height', '630');
      setMetaTag('og:type', 'product');
      setMetaTag('og:url', window.location.href);

      const setTwitterTag = (name: string, content: string) => {
        let element = document.querySelector(`meta[name="${name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };
      
      setTwitterTag('twitter:card', 'summary_large_image');
      setTwitterTag('twitter:title', product.title);
      setTwitterTag('twitter:description', product.description || `Buy ${product.title} at Clothora`);
      setTwitterTag('twitter:image', product.imageUrl);
    }
  }, [product]);
  const [copied, setCopied] = useState(false);
    const { addToCart } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prod = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(prod);
          
          if (prod.category) {
            const q = query(collection(db, 'products'), where('category', '==', prod.category), limit(5));
            const relatedSnap = await getDocs(q);
            const rel = [];
            relatedSnap.forEach(doc => {
              if (doc.id !== prod.id) {
                rel.push({ id: doc.id, ...doc.data() });
              }
            });
            setRelatedProducts(rel.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleCopyLink = () => {
    const url = window.location.origin + `/product/${product?.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Product link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-background text-on-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-outline-variant border-t-[#ff4e00] rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-background text-on-background flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black uppercase mb-4 text-primary">Product Not Found</h1>
        <p className="text-on-surface-variant mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-on-background transition-colors">
          Back to Store
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background text-on-background px-4 md:px-16 flex justify-center">
      <div className="w-full max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-background mb-8 font-bold uppercase tracking-widest text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-surface-container-lowest border border-outline-variant grid grid-cols-1 md:grid-cols-2 shadow-[8px_8px_0px_var(--color-primary)]">
          {/* Image Gallery */}
          <div className="bg-surface-container-low flex flex-col p-4 sm:p-8 gap-4 border-b md:border-b-0 md:border-r border-outline-variant relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button 
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
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-primary text-primary' : ''}`} />
                </button>
              )}
            </div>
            <div className="w-full aspect-[3/4] relative border border-outline-variant mt-10 sm:mt-0 bg-surface-container-lowest">
              {activeImageIndex === -1 && product.videoUrl ? (
                <video src={product.videoUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
              ) : (
                <img 
                  src={product.imageUrls?.[activeImageIndex] || product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {(product.imageUrls || product.videoUrl) && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-2">
                {product.videoUrl && (
                  <button 
                    onClick={() => setActiveImageIndex(-1)}
                    className={`w-20 h-24 flex-shrink-0 border transition-all relative overflow-hidden bg-black ${activeImageIndex === -1 ? 'border-primary opacity-100' : 'border-outline-variant opacity-60 hover:opacity-100'}`}
                  >
                    <video src={product.videoUrl} className="w-full h-full object-cover opacity-50" muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  </button>
                )}
                {product.imageUrls && product.imageUrls.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-24 flex-shrink-0 border transition-all overflow-hidden ${activeImageIndex === idx ? 'border-primary opacity-100' : 'border-outline-variant opacity-60 hover:opacity-100'}`}
                  >
                    <img src={url} alt={`${product.title} ${idx+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-10 flex flex-col">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
              {product.category}
            </span>
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-on-background mb-6 leading-tight">
                {product.title}
              </h2>
            </div>
            
            <div className="text-3xl font-black text-on-background mb-8">
              ৳{product.price}
            </div>
            
            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {product.description || "Premium quality product. Crafted with care and designed for the modern aesthetics. Stand out from the crowd."}
              </p>
            </div>

            
            

            <div className="mt-auto pt-8 border-t border-outline-variant">
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  disabled={product.stock <= 0}
                  onClick={() => {
                    
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice,
                      sizes: product.sizes || [], imageUrls: product.imageUrls || [], noColorVariations: product.noColorVariations || false
                    }, true);
                  }}
                  className="flex-1 bg-transparent border-2 border-[#ffffff] text-on-background py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  BUY NOW
                </button>
                <button 
                  disabled={product.stock <= 0}
                  onClick={() => {
                    
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl || '',
                      costPrice: product.costPrice,
                      sizes: product.sizes || [], imageUrls: product.imageUrls || [], noColorVariations: product.noColorVariations || false
                    }, false);
                    toast.success(`${product.title} added to cart`);
                  }}
                  className="flex-1 bg-primary text-on-primary py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
              </div>
              <p className="text-center text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-6">
                Free shipping inside Dhaka
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-outline-variant pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-on-surface">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map(rel => (
              <Link to={`/product/${rel.id}`} key={rel.id} className="group bg-surface-container-lowest border border-outline-variant p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200">
                <div className="w-full aspect-[3/4] bg-surface-container-low mb-4 relative overflow-hidden">
                  <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface line-clamp-2 mb-2">{rel.title}</h3>
                <div className="text-lg font-black text-primary mt-auto">৳{rel.price}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
