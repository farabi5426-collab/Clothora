import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../../store/cartStore';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string; imageUrls?: string[];
  category: string;
  stock: number;
  sizes?: string[];
}

export default function MasonryGrid({ products, loading }: { products: Product[], loading: boolean }) {
  const { addToCart } = useCartStore();
  
  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-[24px] space-y-[24px]">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className={`bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col rounded-theme ${i % 2 === 0 ? 'h-[400px]' : 'h-[300px]'}`}>
            <div className="w-full flex-grow bg-surface-container-highest mb-[16px] animate-pulse rounded-theme"></div>
            <div className="w-2/3 h-6 bg-surface-container-highest animate-pulse mb-[8px] rounded-theme"></div>
            <div className="w-1/3 h-4 bg-surface-container-highest animate-pulse rounded-theme"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-[24px] space-y-[24px]">
      {products.map((product, i) => (
        <div key={product.id} className="break-inside-avoid group bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200 rounded-theme">
          {/* Make alternate items taller for a masonry effect */}
          <div className={`w-full bg-surface-container-highest mb-[16px] relative overflow-hidden rounded-theme ${i % 3 === 0 ? 'aspect-[3/5]' : i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
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
            
            {/* Quick add overlay */}
            <div className="absolute inset-0 bg-surface-container-lowest/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
                disabled={product.stock <= 0}
                onClick={(e) => {
                  e.preventDefault();
                  
                  addToCart({
                       id: product.id,
                       title: product.title,
                       price: product.price,
                       imageUrl: product.imageUrl || '',
                       sizes: product.sizes || [], imageUrls: product.imageUrls || []
                  }, true);
                }}
                className="bg-primary text-on-primary px-[24px] py-[16px] text-[14px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] transition-all disabled:opacity-50 flex items-center gap-2 rounded-theme"
              >
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-[18px] font-black text-on-surface uppercase leading-tight mb-[4px]">
              {product.title}
            </h3>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-[12px] text-primary font-bold uppercase tracking-[0.1em]">
                {product.category}
              </span>
              <span className="text-[18px] font-black text-on-surface">
                ৳{product.price}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
