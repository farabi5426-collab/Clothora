import React, { useRef } from 'react';
import { useCartStore } from '../../../store/cartStore';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  sizes?: string[];
}

export default function HorizontalGallery({ products, loading }: { products: Product[], loading: boolean }) {
  const { addToCart } = useCartStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex gap-[24px] overflow-hidden py-[24px]">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="min-w-[300px] md:min-w-[400px] h-[600px] bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col rounded-theme">
            <div className="w-full flex-grow bg-surface-container-highest animate-pulse rounded-theme mb-[16px]"></div>
            <div className="w-1/2 h-8 bg-surface-container-highest animate-pulse rounded-theme"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Scroll Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-[64px] h-[64px] bg-primary text-on-primary border-2 border-on-primary shadow-[4px_4px_0px_var(--color-on-primary)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 rounded-theme"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-[64px] h-[64px] bg-primary text-on-primary border-2 border-on-primary shadow-[4px_4px_0px_var(--color-on-primary)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-theme"
      >
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      {/* Gallery Container - hide scrollbar but allow scroll */}
      <div 
        ref={scrollRef}
        className="flex gap-[24px] overflow-x-auto py-[24px] px-[16px] -mx-[16px] snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="snap-center shrink-0 w-[300px] md:w-[450px] bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200 rounded-theme"
          >
            <div className="w-full aspect-[4/5] bg-surface-container-highest mb-[24px] relative overflow-hidden rounded-theme">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bold uppercase tracking-widest text-[12px]">
                  NO IMAGE
                </div>
              )}
              {product.stock <= 0 && (
                <div className="absolute top-[16px] right-[16px] bg-error text-on-error px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_var(--color-on-error-container)] rounded-theme">
                  SOLD OUT
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-grow">
              <span className="text-[12px] text-primary font-bold uppercase tracking-[0.1em] mb-[8px]">
                {product.category}
              </span>
              <h3 className="text-[24px] font-black text-on-surface uppercase leading-tight mb-[16px]">
                {product.title}
              </h3>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[28px] font-black text-on-surface">
                  ৳{product.price}
                </span>
                <button 
                  disabled={product.stock <= 0}
                  onClick={(e) => {
                  e.preventDefault();
                  if (product.sizes && product.sizes.length > 0) {
                     window.location.href = `/product/${product.id}`;
                  } else {
                     addToCart({
                       id: product.id,
                       title: product.title,
                       price: product.price,
                       imageUrl: product.imageUrl || ''
                     });
                  }
                }}
                  className="w-[56px] h-[56px] bg-primary text-on-primary flex items-center justify-center shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-theme"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
