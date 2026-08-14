import React from 'react';
import { useCartStore } from '../../../store/cartStore';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export default function ClassicGrid({ products, loading }: { products: Product[], loading: boolean }) {
  const { addToCart } = useCartStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
      {loading ? (
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col rounded-theme">
            <div className="w-full aspect-[3/4] bg-surface-container-highest mb-[24px] animate-pulse rounded-theme"></div>
            <div className="w-1/3 h-3 bg-surface-container-highest animate-pulse mb-[12px] rounded-theme"></div>
            <div className="w-3/4 h-5 bg-surface-container-highest animate-pulse mb-[16px] rounded-theme"></div>
            <div className="mt-auto flex items-center justify-between">
              <div className="w-1/2 h-8 bg-surface-container-highest animate-pulse rounded-theme"></div>
              <div className="w-[48px] h-[48px] bg-surface-container-highest animate-pulse rounded-theme"></div>
            </div>
          </div>
        ))
      ) : (
        products.map((product) => (
          <div key={product.id} className="group bg-surface-container-low border-2 border-surface-bright p-[16px] flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200 rounded-theme">
            <div className="w-full aspect-[3/4] bg-surface-container-highest mb-[24px] relative overflow-hidden rounded-theme">
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
              <h3 className="text-[20px] font-black text-on-surface uppercase leading-tight mb-[16px]">
                {product.title}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[24px] font-black text-on-surface">
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
                  className="w-[48px] h-[48px] bg-primary text-on-primary flex items-center justify-center shadow-[2px_2px_0px_var(--color-on-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_var(--color-on-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-theme"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
