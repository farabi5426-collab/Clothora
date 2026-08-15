import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import { Truck, CreditCard, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

const HERO_CONTENT = [
  {
    prefix: "ELEVATE YOUR",
    highlight: "STREETWEAR",
    description: "PREMIUM OVERSIZED STREETWEAR, ANIME-INSPIRED DESIGNS, AND GRAPHIC APPAREL CRAFTED FOR THOSE WHO DARE TO STAND OUT."
  },
  {
    prefix: "DEFINE YOUR",
    highlight: "AESTHETIC",
    description: "BOLD SILHOUETTES AND UNCOMPROMISING QUALITY. DISCOVER STATEMENT PIECES THAT SPEAK VOLUMES WITHOUT SAYING A WORD."
  },
  {
    prefix: "OWN THE",
    highlight: "NARRATIVE",
    description: "FASHION IS MORE THAN CLOTHING; IT'S YOUR PERSONAL STORY. EXPRESS YOURSELF WITH OUR LATEST AVANT-GARDE DROPS."
  },
  {
    prefix: "EMBRACE THE",
    highlight: "UNCONVENTIONAL",
    description: "BREAK THE RULES OF TRADITIONAL FASHION. EXPERIMENT WITH TEXTURES, LAYERS, AND DESIGNS THAT DEFY THE NORM."
  },
  {
    prefix: "CRAFT YOUR",
    highlight: "IDENTITY",
    description: "FROM EVERYDAY ESSENTIALS TO EXCLUSIVE CAPSULES, BUILD A WARDROBE THAT IS UNAPOLOGETICALLY YOU."
  },
  {
    prefix: "CHANNEL YOUR",
    highlight: "ENERGY",
    description: "HIGH-IMPACT GRAPHICS AND PREMIUM FABRICS ENGINEERED TO MATCH YOUR HUSTLE AND AMPLIFY YOUR PRESENCE."
  }
];

const CATEGORIES = ["All", "Oversized Tees", "Anime Collection", "Accessories"];

const REVIEWS = [
  { id: 1, name: "Rakib H.", rating: 5, text: "The acid wash tee is insanely good. Heavyweight material just like they promised." },
  { id: 2, name: "Sakib A.", rating: 5, text: "Best streetwear brand in BD right now. Delivery was super fast." },
  { id: 3, name: "Tanvir R.", rating: 4.5, text: "Loved the oversized fit. Customer service was really helpful with the exchange." }
];

export default function Home() {
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_CONTENT.length);
    }, 5000);
    return () => clearInterval(heroInterval);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  // Simulate Best Sellers and New Arrivals by splitting the array
  const bestSellers = filteredProducts.slice(0, 4);
  const newArrivals = filteredProducts.slice(4, 12);

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="group bg-[#111] border border-[#ffffff15] p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#ff4e00] duration-200 rounded-none">
      <div className="w-full aspect-[3/4] bg-[#1a1a1a] mb-6 relative overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#ffffff40] font-bold uppercase tracking-widest text-xs">
            NO IMAGE
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#fff]">
            SOLD OUT
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <span className="text-xs text-[#ff4e00] font-bold uppercase tracking-widest mb-2">
          {product.category || 'Uncategorized'}
        </span>
        <h3 className="text-lg font-black text-white uppercase leading-tight mb-4">
          {product.title}
        </h3>
        <div className="mt-auto">
          {/* Social Proof Star Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-[#ff4e00] text-[#ff4e00]" />
            <span className="text-[#ffffff80] text-xs font-bold tracking-wider">4.8 (124)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">
              ৳{product.price}
            </span>
            <button 
              disabled={product.stock <= 0}
              onClick={() => addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl || ''
              })}
              className="w-12 h-12 bg-[#ff4e00] text-white flex items-center justify-center shadow-[2px_2px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-[#ff4e00] selection:text-white pb-16">
      {/* Hero Section */}
      <section className="relative border-b border-[#ffffff15] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full object-cover opacity-30 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2574&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-16 pt-24 pb-32 flex flex-col justify-end min-h-[70vh]">
          <div className="h-[90px] sm:h-[110px] md:h-[160px] lg:h-[200px] relative mb-6">
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute left-0 top-0 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl flex flex-col w-full"
              >
                <span>{HERO_CONTENT[heroIndex].prefix}</span>
                <span className="text-[#ff4e00] mt-1 sm:mt-2">{HERO_CONTENT[heroIndex].highlight}</span>
              </motion.h1>
            </AnimatePresence>
          </div>
          <div className="min-h-[140px] sm:min-h-[100px] relative mb-12 max-w-[650px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={heroIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="absolute left-0 top-0 text-base md:text-xl text-[#ffffff80] font-bold drop-shadow-lg leading-relaxed"
              >
                {HERO_CONTENT[heroIndex].description}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <a href="#shop" className="w-full sm:w-auto justify-center bg-[#ff4e00] text-white px-8 py-4 text-sm md:text-base font-black uppercase tracking-widest shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 rounded-none">
              SHOP NEW DROPS <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#shop" className="w-full sm:w-auto justify-center bg-transparent border-2 border-[#ff4e00] text-[#ff4e00] px-8 py-4 text-sm md:text-base font-black uppercase tracking-widest shadow-[4px_4px_0px_#ff4e00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ff4e00] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 rounded-none">
              EXPLORE CATEGORIES
            </a>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-b border-[#ffffff15] bg-[#111]">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-16 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#ffffff15]">
            <div className="flex items-center justify-center gap-4 py-4 md:py-0">
              <Truck className="w-8 h-8 text-[#ff4e00]" />
              <div className="text-left">
                <h4 className="font-black uppercase tracking-widest text-sm text-white">Fast Delivery</h4>
                <p className="text-xs text-[#ffffff60] uppercase tracking-wider">All Over Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-4 md:py-0">
              <CreditCard className="w-8 h-8 text-[#ff4e00]" />
              <div className="text-left">
                <h4 className="font-black uppercase tracking-widest text-sm text-white">Secure Payment</h4>
                <p className="text-xs text-[#ffffff60] uppercase tracking-wider">100% Safe Checkout</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-4 md:py-0">
              <RefreshCw className="w-8 h-8 text-[#ff4e00]" />
              <div className="text-left">
                <h4 className="font-black uppercase tracking-widest text-sm text-white">7-Days Return</h4>
                <p className="text-xs text-[#ffffff60] uppercase tracking-wider">Easy Exchange Policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation (Pills) */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-16 pt-16" id="shop">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border border-[#ffffff15] text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-[#ff4e00] text-white border-[#ff4e00] shadow-[0_0_15px_rgba(255,78,0,0.4)]' 
                  : 'bg-[#111] text-[#ffffff80] hover:text-white hover:border-[#ff4e00] hover:shadow-[0_0_10px_rgba(255,78,0,0.2)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Discovery: Best Sellers & New Arrivals */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-16 py-16 space-y-24">
        
        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-10 border-b border-[#ffffff15] pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none flex items-center gap-3">
                  🔥 Best Sellers
                </h2>
                <p className="text-xs text-[#ff4e00] font-bold uppercase tracking-[0.1em] mt-2">Most Wanted Drops</p>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                 {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#111] border border-[#ffffff15] p-4 flex flex-col h-[400px] animate-pulse"></div>
                 ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {bestSellers.map(renderProductCard)}
              </div>
            )}
          </div>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-10 border-b border-[#ffffff15] pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none flex items-center gap-3">
                  ✨ New Arrivals
                </h2>
                <p className="text-xs text-[#ff4e00] font-bold uppercase tracking-[0.1em] mt-2">Fresh From The Vault</p>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                 {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#111] border border-[#ffffff15] p-4 flex flex-col h-[400px] animate-pulse"></div>
                 ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {newArrivals.map(renderProductCard)}
              </div>
            )}
          </div>
        )}

        {/* Empty State / No Products Found */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-24 bg-[#111] border border-[#ffffff15]">
            <p className="text-[#ffffff60] font-bold uppercase tracking-widest mb-4">No drops found for this category.</p>
            <button onClick={() => setActiveCategory("All")} className="text-[#ff4e00] font-black uppercase tracking-widest hover:underline">
              View All Collections
            </button>
          </div>
        )}

      </section>

      {/* Social Proof: Customer Reviews */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-16 py-16 border-t border-[#ffffff15] bg-[#0a0a0a]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
            What Our Customers Say
          </h2>
          <p className="text-xs text-[#ffffff60] font-bold uppercase tracking-widest">Real Reviews from Real Ninjas</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(review => (
            <div key={review.id} className="bg-[#111] border border-[#ffffff15] p-8 relative group hover:border-[#ff4e00] transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-16 h-16 text-[#ff4e00] fill-[#ff4e00]" />
              </div>
              <div className="flex items-center gap-1 mb-4">
                {Array(Math.floor(review.rating)).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#ff4e00] text-[#ff4e00]" />
                ))}
                {review.rating % 1 !== 0 && <Star className="w-4 h-4 fill-[#ff4e00]/50 text-[#ff4e00]" />}
              </div>
              <p className="text-[#ffffff90] text-sm leading-relaxed mb-6 italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center font-black text-[#ff4e00] border border-[#ffffff15]">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold uppercase tracking-wider">{review.name}</h4>
                  <span className="text-[#ffffff40] text-[10px] uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified Buyer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
