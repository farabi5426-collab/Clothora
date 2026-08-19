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

export default function MagazineStyle({ products, loading }: { products: Product[], loading: boolean }) {
  const { addToCart } = useCartStore();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        <div className="md:col-span-2 md:row-span-2 bg-surface-container-low border-2 border-surface-bright p-[24px] flex flex-col min-h-[600px] rounded-theme">
          <div className="w-full flex-grow bg-surface-container-highest animate-pulse mb-[24px] rounded-theme"></div>
        </div>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-surface-container-low border-2 border-surface-bright p-[16px] h-[300px] rounded-theme">
            <div className="w-full h-full bg-surface-container-highest animate-pulse rounded-theme"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  const featured = products[0];
  const others = products.slice(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[24px]">
      {/* Featured Large Product */}
      <div className="md:col-span-2 lg:col-span-2 md:row-span-2 group bg-surface-container-low border-2 border-surface-bright p-[24px] flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_var(--color-primary)] duration-200 min-h-[600px] rounded-theme">
        <div className="w-full flex-grow bg-surface-container-highest mb-[32px] relative overflow-hidden rounded-theme">
          {featured.imageUrl ? (
            <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bold uppercase tracking-widest text-[16px]">
              NO IMAGE
            </div>
          )}
          {featured.stock <= 0 && (
            <div className="absolute top-[24px] right-[24px] bg-error text-on-error px-[16px] py-[8px] text-[14px] font-bold uppercase tracking-widest shadow-[4px_4px_0px_var(--color-on-error-container)] rounded-theme">
              SOLD OUT
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-[16px]">
            <div>
              <span className="text-[14px] text-primary font-bold uppercase tracking-[0.2em] mb-[12px] block">
                FEATURED • {featured.category}
              </span>
              <h3 className="text-[32px] md:text-[48px] font-black text-on-surface uppercase leading-none tracking-tighter">
                {featured.title}
              </h3>
            </div>
            <span className="text-[32px] md:text-[48px] font-black text-primary leading-none">
              ৳{featured.price}
            </span>
          </div>
          
          
          <button 
            disabled={featured.stock <= 0}
            onClick={(e) => {
                  e.preventDefault();
                  
                  addToCart({
                       id: featured.id,
                       title: featured.title,
                       price: featured.price,
                       imageUrl: featured.imageUrl || '',
                       sizes: featured.sizes || [], imageUrls: featured.imageUrls || []
                  }, true);
            }}
            className="w-full bg-primary text-on-primary py-[24px] text-[18px] font-black uppercase tracking-[0.1em] shadow-[6px_6px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_var(--color-on-primary)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-[16px] rounded-theme"
          >
            {featured.stock <= 0 ? 'SOLD OUT' : 'ADD TO CART'} <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>

      {/* Other Products in Smaller Grid */}
      {others.map((product) => (
        <div key={product.id} className="group bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200 rounded-theme">
          <div className="w-full aspect-square bg-surface-container-highest mb-[16px] relative overflow-hidden rounded-theme">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bold uppercase tracking-widest text-[12px]">NO IMAGE</div>
            )}
            
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
                className="w-[64px] h-[64px] bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[4px_4px_0px_var(--color-on-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-primary)] transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
              </button>
            </div>
          </div>
          
          <div className="mt-auto">
            <h3 className="text-[16px] font-black text-on-surface uppercase leading-tight line-clamp-1 mb-[4px]">
              {product.title}
            </h3>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-primary font-bold uppercase tracking-[0.1em]">
                {product.category}
              </span>
              <span className="text-[16px] font-black text-on-surface">
                ৳{product.price}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
