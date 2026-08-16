import React, { useState } from 'react';
import toast from 'react-hot-toast';
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

export default function Lookbook({ products, loading }: { products: Product[], loading: boolean }) {
  const { addToCart } = useCartStore();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  if (loading) {
    return (
      <div className="space-y-[48px]">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="w-full h-[80vh] bg-surface-container-highest animate-pulse rounded-theme"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-[48px] w-full max-w-5xl mx-auto">
      {products.map((product) => (
        <div key={product.id} className="relative w-full h-[80vh] bg-surface-container-low rounded-theme overflow-hidden group">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant font-bold">NO IMAGE</div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-0 left-0 w-full p-[32px] md:p-[64px] flex flex-col md:flex-row md:items-end justify-between gap-[24px]">
            <div>
              <span className="text-[14px] text-primary font-bold uppercase tracking-[0.2em] mb-[12px] block">
                {product.category}
              </span>
              <h3 className="text-[48px] md:text-[64px] font-black text-on-surface uppercase leading-none tracking-tighter drop-shadow-lg">
                {product.title}
              </h3>
              <span className="text-[32px] font-black text-on-surface mt-[8px] block drop-shadow-md">
                ৳{product.price}
              </span>
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={(e) => { e.preventDefault(); setSelectedSizes(prev => ({...prev, [product.id]: size})); }}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-bold border transition-colors ${selectedSizes[product.id] === size ? 'bg-primary text-on-primary border-primary' : 'bg-surface/50 text-on-surface-variant border-surface-bright hover:border-primary backdrop-blur-md'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              disabled={product.stock <= 0}
              onClick={(e) => {
                  e.preventDefault();
                  if (product.sizes && product.sizes.length > 0 && !selectedSizes[product.id]) {
                     toast.error('Please select a size first');
                     return;
                  }
                  addToCart({
                       id: product.id,
                       title: product.title,
                       price: product.price,
                       imageUrl: product.imageUrl || '',
                       sizes: product.sizes || [],
                       selectedSize: selectedSizes[product.id] || undefined
                  }, true);
                }}
              className="bg-primary text-on-primary px-[48px] py-[24px] text-[18px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 rounded-theme"
            >
              {product.stock <= 0 ? 'SOLD OUT' : 'ADD TO CART'} <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
