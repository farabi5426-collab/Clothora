import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import { useLayoutStore } from '../../store/layoutStore';

import ClassicGrid from '../../components/store/layouts/ClassicGrid';
import Lookbook from '../../components/store/layouts/Lookbook';
import MasonryGrid from '../../components/store/layouts/MasonryGrid';
import HorizontalGallery from '../../components/store/layouts/HorizontalGallery';
import MagazineStyle from '../../components/store/layouts/MagazineStyle';
import SplitScreen from '../../components/store/layouts/SplitScreen';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export default function Home() {
  const { addToCart } = useCartStore();
  const { activeLayout } = useLayoutStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12)); // Increased limit to 12 for better masonry/magazine layouts
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderLayout = () => {
    switch (activeLayout) {
      case 'layout-lookbook':
        return <Lookbook products={products} loading={loading} />;
      case 'layout-masonry':
        return <MasonryGrid products={products} loading={loading} />;
      case 'layout-horizontal':
        return <HorizontalGallery products={products} loading={loading} />;
      case 'layout-magazine':
        return <MagazineStyle products={products} loading={loading} />;
      case 'layout-splitscreen':
        return <SplitScreen products={products} loading={loading} />;
      case 'layout-classic':
      default:
        return <ClassicGrid products={products} loading={loading} />;
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-surface relative border-b-2 border-surface-bright overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full object-cover opacity-50 bg-[url('https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-[16px] md:px-[64px] pt-[80px] pb-[120px] flex flex-col justify-end min-h-[70vh]">
          <h1 className="text-[64px] md:text-[120px] font-black text-on-surface uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
            ACID <span className="text-primary">WASH</span><br />
            SHINOBI
          </h1>
          <p className="text-[18px] md:text-[24px] text-on-surface-variant max-w-[600px] mb-[48px] font-bold drop-shadow-lg">
            PREMIUM HEAVYWEIGHT TEES FEATURING HAND-DYED ACID WASH TEXTURES AND HIGH-DEFINITION GRAPHICS.
          </p>
          <div className="flex flex-wrap gap-[24px]">
            <a href="#new-arrivals" className="bg-primary text-on-primary px-[48px] py-[24px] text-[16px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 rounded-theme">
              SHOP COLLECTION <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="new-arrivals" className="w-full max-w-[1920px] mx-auto px-[16px] md:px-[64px] py-[120px]">
        <div className="flex justify-between items-end mb-[64px]">
          <div>
            <h2 className="text-[48px] font-black text-on-surface uppercase tracking-tighter leading-none">NEW ARRIVALS</h2>
            <p className="text-[16px] text-primary font-bold uppercase tracking-[0.1em] mt-2">FRESH FROM THE VAULT</p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-on-surface hover:text-primary transition-colors text-[14px] font-bold uppercase tracking-[0.1em]">
            VIEW ALL <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>

        {renderLayout()}

      </section>

      {/* Sectors / Categories */}
      <section className="w-full max-w-[1920px] mx-auto px-[16px] md:px-[64px] py-[120px] border-t-2 border-surface-bright">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <a href="#" className="group relative h-[400px] md:h-[600px] bg-surface-container-low border-2 border-surface-bright overflow-hidden rounded-theme">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 mix-blend-overlay"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center p-[48px] text-center">
               <h3 className="text-[48px] md:text-[64px] font-black text-on-surface uppercase tracking-tighter leading-none mb-[16px] drop-shadow-lg">
                 MENSWEAR
               </h3>
               <span className="bg-primary text-on-primary px-[24px] py-[12px] font-bold uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] rounded-theme">
                 EXPLORE
               </span>
             </div>
          </a>
          <a href="#" className="group relative h-[400px] md:h-[600px] bg-surface-container-low border-2 border-surface-bright overflow-hidden rounded-theme">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621072156002-e2f5dc6b19a3?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 mix-blend-overlay"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center p-[48px] text-center">
               <h3 className="text-[48px] md:text-[64px] font-black text-on-surface uppercase tracking-tighter leading-none mb-[16px] drop-shadow-lg">
                 ACCESSORIES
               </h3>
               <span className="bg-primary text-on-primary px-[24px] py-[12px] font-bold uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] rounded-theme">
                 EXPLORE
               </span>
             </div>
          </a>
        </div>
      </section>
    </main>
  );
}
