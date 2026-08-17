import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import { Star, ArrowRight, ShoppingCart, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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


const REVIEWS = [
  { id: 1, name: "Rakib H.", rating: 5, text: "The acid wash tee is insanely good. Heavyweight material just like they promised." },
  { id: 2, name: "Sakib A.", rating: 5, text: "Best streetwear brand in BD right now. Delivery was super fast." },
  { id: 3, name: "Tanvir R.", rating: 4.5, text: "Loved the oversized fit. Customer service was really helpful with the exchange." }
];


const ProductCard: React.FC<{ product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product) => void }> = ({ product, openProductDetails, handleAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : (product.imageUrl ? [product.imageUrl] : []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="group bg-surface-container-lowest border border-outline-variant p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200 rounded-none">
      <div 
        className="w-full aspect-[3/4] bg-surface-container-low mb-6 relative overflow-hidden cursor-pointer"
        onClick={() => openProductDetails(product)}
      >
        {images.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImageIndex}
              src={images[currentImageIndex]} 
              alt={product.title} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bold uppercase tracking-widest text-xs">
            NO IMAGE
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute top-4 right-4 bg-red-600 text-on-background z-10 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_var(--color-on-background)]">
            SOLD OUT
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`} 
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <span className="text-xs text-primary font-bold uppercase tracking-widest mb-2">
          {product.category || 'Uncategorized'}
        </span>
        <h3 className="text-lg font-black text-on-background uppercase leading-tight mb-4 line-clamp-2">
          {product.title}
        </h3>
        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="text-on-surface-variant text-xs font-bold tracking-wider">4.8 (124)</span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-2xl font-black text-on-background mb-2">
              ৳{product.price}
            </div>
            <div className="flex gap-2">
              <button 
                disabled={product.stock <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  openProductDetails(product);
                }}
                className="flex-1 bg-transparent border-2 border-[#ffffff] text-on-background flex items-center justify-center py-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button 
                disabled={product.stock <= 0}
                onClick={(e) => handleAddToCart(e, product)}
                className="flex-1 bg-primary text-on-primary flex items-center justify-center py-3 gap-2 shadow-[2px_2px_0px_var(--color-on-background)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_var(--color-on-background)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
              >
                <ShoppingCart className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {

  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDbVideos, setHeroDbVideos] = useState<{id: string, url: string}[]>([]);
  const [productBannerVideos, setProductBannerVideos] = useState<{id: string, url: string}[]>([]);
  const heroVideos = [...heroDbVideos, ...productBannerVideos];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [flyingImages, setFlyingImages] = useState<{id: number, src: string, startX: number, startY: number}[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!selectedProduct) return;
    const url = window.location.origin + `/product/${selectedProduct.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Product link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl || '',
      sizes: product.sizes || [], imageUrls: product.imageUrls || []
    });

    // Get click coordinates
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newFlyingImage = {
      id: Date.now(),
      src: product.imageUrl || '',
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2
    };

    setFlyingImages(prev => [...prev, newFlyingImage]);

    // Remove the flying image after animation
    setTimeout(() => {
      setFlyingImages(prev => prev.filter(img => img.id !== newFlyingImage.id));
    }, 1000);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_CONTENT.length);
    }, 5000);
    return () => clearInterval(heroInterval);
  }, []);

  useEffect(() => {
    const vq = query(collection(db, 'heroVideos'), orderBy('createdAt', 'desc'));
    const unsubV = onSnapshot(vq, (snapshot) => {
      const vids: {id: string, url: string}[] = [];
      snapshot.forEach(doc => vids.push({ id: doc.id, url: doc.data().url }));
      setHeroDbVideos(vids);
    });
    return () => unsubV();
  }, []);

  useEffect(() => {
    const pq = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubP = onSnapshot(pq, (snapshot) => {
      const pVids: {id: string, url: string}[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.showInBanner && data.videoUrl) {
          pVids.push({ id: doc.id, url: data.videoUrl });
        }
      });
      setProductBannerVideos(pVids);
    });
    return () => unsubP();
  }, []);

  useEffect(() => {
    if (heroVideos.length <= 1) return;
    const vidInterval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % heroVideos.length);
    }, 6000); // switch video every 6 seconds
    return () => clearInterval(vidInterval);
  }, [heroVideos.length]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  
  
  useEffect(() => {
    const cq = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubC = onSnapshot(cq, (snapshot) => {
      const cats: {id: string, name: string}[] = [];
      snapshot.forEach(doc => cats.push({ id: doc.id, ...doc.data() } as any));
      setCategories(cats);
    });
    return () => unsubC();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => (p.category || '').trim().toLowerCase() === activeCategory.trim().toLowerCase());

  // Simulate Best Sellers and New Arrivals by splitting the array
  const bestSellers = filteredProducts.slice(0, 4);
  const newArrivals = filteredProducts.slice(4, 12);

  const renderProductCard = (product: Product) => (
    <ProductCard 
      key={product.id} 
      product={product} 
      openProductDetails={openProductDetails} 
      handleAddToCart={handleAddToCart} 
    />
  );

  return (
    <main className="bg-background min-h-screen text-on-background font-sans selection:bg-primary selection:text-on-background pb-16">
      {/* Hero Section */}
      <section className="relative border-b border-outline-variant overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full object-cover opacity-30 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2574&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-16 pt-24 pb-32 min-h-[70vh] flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
          <div className="flex flex-col justify-end w-full md:w-1/2">
          <div className="relative mb-6 min-h-[120px] md:min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-on-background uppercase tracking-tighter leading-none drop-shadow-2xl flex flex-col w-full"
              >
                <span>{HERO_CONTENT[heroIndex].prefix}</span>
                <span className="text-primary mt-1 sm:mt-2">{HERO_CONTENT[heroIndex].highlight}</span>
              </motion.h1>
            </AnimatePresence>
          </div>
          <div className="relative mb-12 max-w-[650px] min-h-[80px] md:min-h-[100px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={heroIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="text-base md:text-xl text-on-surface-variant font-bold drop-shadow-lg leading-relaxed"
              >
                {HERO_CONTENT[heroIndex].description}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <a href="#shop" className="w-full sm:w-auto justify-center bg-primary text-on-primary px-8 py-4 text-sm md:text-base font-black uppercase tracking-widest shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 rounded-none">
              SHOP NEW DROPS <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#shop" className="w-full sm:w-auto justify-center bg-transparent border-2 border-primary text-primary px-8 py-4 text-sm md:text-base font-black uppercase tracking-widest shadow-[4px_4px_0px_#ff4e00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ff4e00] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 rounded-none">
              EXPLORE CATEGORIES
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center h-auto mt-8 md:mt-0">
          {heroVideos.length > 0 ? (
            <div className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[400px] aspect-[3/4] overflow-visible">
              <div className="absolute inset-0 bg-surface-container-lowest border-2 border-primary shadow-[12px_12px_0px_var(--color-primary)] overflow-hidden rounded-none z-10">
                <AnimatePresence mode="wait">
                  <motion.video 
                    key={currentVideoIndex}
                    src={heroVideos[currentVideoIndex].url}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Dots indicator for videos */}
                {heroVideos.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                    {heroVideos.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1.5 transition-all duration-300 ${idx === currentVideoIndex ? 'w-6 bg-primary' : 'w-2 bg-white/50'} rounded-none`} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:block w-full max-w-[500px] aspect-[4/5] border border-outline-variant/30 border-dashed opacity-20"></div>
          )}
        </div>
      </div>
      </section>

      {/* Category Navigation (Pills) */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-16 pt-16" id="shop">
        <div className="relative w-full">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex-1 md:block hidden"></div>
            {[ {id: 'all', name: 'All'}, ...categories ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 whitespace-nowrap px-6 py-2 rounded-full border border-outline-variant text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat.name 
                    ? 'bg-primary text-on-primary border-primary shadow-[0_0_15px_var(--color-primary)]' 
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-background hover:border-primary hover:shadow-[0_0_10px_var(--color-primary)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
            <div className="flex-1 md:block hidden"></div>
          </div>
        </div>
      </section>

      {/* Product Discovery: Best Sellers & New Arrivals */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-16 py-16 space-y-24">
        
        {/* Category View */}
        {activeCategory !== 'All' && filteredProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-10 border-b border-outline-variant pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-on-background uppercase tracking-tighter leading-none flex items-center gap-3">
                  {activeCategory}
                </h2>
                <p className="text-xs text-primary font-bold uppercase tracking-[0.1em] mt-2">Explore the collection</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(renderProductCard)}
            </div>
          </div>
        )}

        {/* Best Sellers (Only in All) */}
        {activeCategory === 'All' && bestSellers.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-10 border-b border-outline-variant pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-on-background uppercase tracking-tighter leading-none flex items-center gap-3">
                  🔥 Best Sellers
                </h2>
                <p className="text-xs text-primary font-bold uppercase tracking-[0.1em] mt-2">Most Wanted Drops</p>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                 {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col h-[400px] animate-pulse"></div>
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
        {activeCategory === 'All' && newArrivals.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-10 border-b border-outline-variant pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-on-background uppercase tracking-tighter leading-none flex items-center gap-3">
                  ✨ New Arrivals
                </h2>
                <p className="text-xs text-primary font-bold uppercase tracking-[0.1em] mt-2">Fresh From The Vault</p>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                 {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col h-[400px] animate-pulse"></div>
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
          <div className="text-center py-24 bg-surface-container-lowest border border-outline-variant">
            <p className="text-on-surface-variant font-bold uppercase tracking-widest mb-4">No drops found for this category.</p>
            <button onClick={() => setActiveCategory("All")} className="text-primary font-black uppercase tracking-widest hover:underline">
              View All Collections
            </button>
          </div>
        )}

      </section>

      {/* Social Proof: Customer Reviews */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-16 py-16 border-t border-outline-variant bg-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-on-background uppercase tracking-tighter leading-none mb-2">
            What Our Customers Say
          </h2>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Real Reviews from Real Ninjas</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(review => (
            <div key={review.id} className="bg-surface-container-lowest border border-outline-variant p-8 relative group hover:border-primary transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-16 h-16 text-primary fill-primary" />
              </div>
              <div className="flex items-center gap-1 mb-4">
                {Array(Math.floor(review.rating)).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                {review.rating % 1 !== 0 && <Star className="w-4 h-4 fill-primary/50 text-primary" />}
              </div>
              <p className="text-on-surface text-sm leading-relaxed mb-6 italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center font-black text-primary border border-outline-variant">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-on-background text-sm font-bold uppercase tracking-wider">{review.name}</h4>
                  <span className="text-on-surface-variant text-[10px] uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified Buyer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Flying Images Animation */}
      {flyingImages.map(img => (
        <motion.img
          key={img.id}
          src={img.src}
          className="fixed z-[100] w-16 h-16 object-cover rounded-none border border-primary"
          initial={{ top: img.startY - 32, left: img.startX - 32, scale: 1, opacity: 1 }}
          animate={{ 
            top: 20, 
            left: window.innerWidth - 60,
            scale: 0.1, 
            opacity: 0 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      ))}

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-surface-container-lowest border border-outline-variant w-full max-w-5xl max-h-[90vh] overflow-y-auto z-10 grid grid-cols-1 md:grid-cols-2 shadow-[8px_8px_0px_var(--color-primary)] scrollbar-hide"
            >
              <button 
                onClick={handleCopyLink}
                className="absolute top-4 right-16 z-20 h-10 px-3 bg-black/50 backdrop-blur text-on-background flex items-center justify-center border border-outline-variant hover:bg-primary transition-colors gap-2 text-xs font-bold uppercase tracking-widest"
                title="Copy product link"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur text-on-background flex items-center justify-center border border-outline-variant hover:bg-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Gallery */}
              <div className="bg-surface-container-low flex flex-col p-4 sm:p-8 gap-4 border-b md:border-b-0 md:border-r border-outline-variant">
                <div className="w-full aspect-[3/4] relative border border-outline-variant">
                  <img 
                    src={selectedProduct.imageUrls?.[activeImageIndex] || selectedProduct.imageUrl} 
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.imageUrls.map((url, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-24 flex-shrink-0 border transition-all ${activeImageIndex === idx ? 'border-primary opacity-100' : 'border-outline-variant opacity-50 hover:opacity-100'}`}
                      >
                        <img src={url} alt={`${selectedProduct.title} ${idx+1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 sm:p-10 flex flex-col">
                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
                  {selectedProduct.category}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-on-background mb-6 leading-tight">
                  {selectedProduct.title}
                </h2>
                <div className="text-3xl font-black text-on-background mb-8">
                  ৳{selectedProduct.price}
                </div>
                
                <div className="prose prose-invert max-w-none mb-10">
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {selectedProduct.description || "Premium quality product. Crafted with care and designed for the modern aesthetics. Stand out from the crowd."}
                  </p>
                </div>

                <div className="mt-auto pt-8 border-t border-outline-variant">
                  <div className="flex flex-col md:flex-row gap-4">
                    <button 
                      disabled={selectedProduct.stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice,
                          sizes: selectedProduct.sizes || [], imageUrls: selectedProduct.imageUrls || []
                        }, true);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-transparent border-2 border-[#ffffff] text-on-background py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      BUY NOW
                    </button>
                    <button 
                      disabled={selectedProduct.stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price: selectedProduct.price,
                          imageUrl: selectedProduct.imageUrl || '',
                          costPrice: selectedProduct.costPrice,
                          sizes: selectedProduct.sizes || [], imageUrls: selectedProduct.imageUrls || []
                        }, false);
                        toast.success(`${selectedProduct.title} added to cart`);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-primary text-on-primary py-5 text-sm font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {selectedProduct.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                  <p className="text-center text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-6">
                    Free shipping inside Dhaka
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
