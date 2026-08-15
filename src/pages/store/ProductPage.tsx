import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import { ShoppingCart, ArrowLeft, Copy, Check } from 'lucide-react';
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
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
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
      <main className="min-h-screen pt-24 pb-16 bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ffffff15] border-t-[#ff4e00] rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black uppercase mb-4 text-[#ff4e00]">Product Not Found</h1>
        <p className="text-[#ffffff80] mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#ff4e00] hover:text-white transition-colors">
          Back to Store
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#0a0a0a] text-white px-4 md:px-16 flex justify-center">
      <div className="w-full max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-[#ffffff80] hover:text-white mb-8 font-bold uppercase tracking-widest text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-[#111] border border-[#ffffff15] grid grid-cols-1 md:grid-cols-2 shadow-[8px_8px_0px_#ff4e00]">
          {/* Image Gallery */}
          <div className="bg-[#1a1a1a] flex flex-col p-4 sm:p-8 gap-4 border-b md:border-b-0 md:border-r border-[#ffffff15] relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button 
                onClick={handleCopyLink}
                className="bg-black/50 backdrop-blur text-white flex items-center justify-center border border-[#ffffff15] hover:bg-[#ff4e00] transition-colors px-3 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                title="Copy product link"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
            <div className="w-full aspect-[3/4] relative border border-[#ffffff15] mt-10 sm:mt-0">
              <img 
                src={product.imageUrls?.[activeImageIndex] || product.imageUrl} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.imageUrls.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-24 flex-shrink-0 border transition-all ${activeImageIndex === idx ? 'border-[#ff4e00] opacity-100' : 'border-[#ffffff15] opacity-50 hover:opacity-100'}`}
                  >
                    <img src={url} alt={`${product.title} ${idx+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-10 flex flex-col">
            <span className="text-[#ff4e00] text-xs font-bold uppercase tracking-widest mb-4">
              {product.category}
            </span>
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white mb-6 leading-tight">
                {product.title}
              </h2>
            </div>
            
            <div className="text-3xl font-black text-white mb-8">
              ৳{product.price}
            </div>
            
            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-[#ffffff80] leading-relaxed whitespace-pre-wrap">
                {product.description || "Premium quality product. Crafted with care and designed for the modern aesthetics. Stand out from the crowd."}
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-[#ffffff15]">
              <button 
                disabled={product.stock <= 0}
                onClick={() => {
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl || ''
                  });
                  toast.success(`${product.title} added to cart`);
                }}
                className="w-full bg-[#ff4e00] text-white py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
              <p className="text-center text-[#ffffff40] text-xs font-bold uppercase tracking-widest mt-6">
                Free shipping inside Dhaka
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
