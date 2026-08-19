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

export default function SplitScreen({ products, loading }: { products: Product[], loading: boolean }) {
  const { addToCart } = useCartStore();
  
  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-[24px]">
        <div className="hidden lg:block lg:w-1/2 h-[80vh] bg-surface-container-highest animate-pulse rounded-theme"></div>
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col rounded-theme">
              <div className="w-full aspect-square bg-surface-container-highest animate-pulse mb-[16px] rounded-theme"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-[48px] items-start">
      {/* Sticky Left Hero */}
      <div className="w-full lg:w-1/2 lg:sticky lg:top-[120px] h-[60vh] lg:h-[calc(100vh-160px)] bg-surface-container-low border-2 border-surface-bright rounded-theme overflow-hidden relative group">
        <img 
          src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2670&auto=format&fit=crop" 
          alt="Collection Showcase" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        
        <div className="absolute inset-0 p-[48px] flex flex-col justify-end">
          <span className="bg-primary text-on-primary text-[12px] font-black uppercase tracking-[0.2em] px-[16px] py-[8px] self-start mb-[16px] rounded-theme">
            CURATED COLLECTION
          </span>
          <h2 className="text-[48px] lg:text-[72px] font-black text-on-surface uppercase tracking-tighter leading-none mb-[16px] drop-shadow-xl">
            THE NEW<br/>STANDARD
          </h2>
          <p className="text-[16px] text-on-surface-variant font-bold uppercase tracking-widest max-w-md drop-shadow-md">
            Explore our latest drops featuring premium textiles and uncompromising silhouettes.
          </p>
        </div>
      </div>

      {/* Scrollable Right Grid */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
        {products.map((product) => (
          <div key={product.id} className="group bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200 rounded-theme">
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
              <h3 className="text-[20px] font-black text-on-surface uppercase leading-tight mb-[8px]">
                {product.title}
              </h3>
              <span className="text-[12px] text-primary font-bold uppercase tracking-[0.1em] mb-[16px]">
                {product.category}
              </span>
              
              <div className="mt-auto flex items-center justify-between border-t-2 border-surface-bright pt-[16px]">
                <span className="text-[20px] font-black text-on-surface">
                  ৳{product.price}
                </span>
                <button 
                  disabled={product.stock <= 0}
                  onClick={(e) => {
                  e.preventDefault();
                  
                  addToCart({
                       id: product.id,
                       title: product.title,
                       price: product.price,
                       imageUrl: product.imageUrl || '',
      costPrice: product.costPrice,
      sizes: product.sizes || [], imageUrls: product.imageUrls || []
                  }, true);
                }}
                  className="bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary w-[40px] h-[40px] flex items-center justify-center transition-colors border-2 border-surface-bright hover:border-primary rounded-theme"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
