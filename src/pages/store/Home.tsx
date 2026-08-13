import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, ChevronDown, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import NoticeBanner from '../../components/store/NoticeBanner';
import ChatWidget from '../../components/store/ChatWidget';
import CartDrawer from '../../components/store/CartDrawer';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export default function Home() {
  const { user, logout } = useAuthStore();
  const { items, toggleCart, addToCart } = useCartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans flex flex-col overflow-x-hidden">
      <NoticeBanner />
      <CartDrawer />
      <ChatWidget />

      <header className="h-20 border-b border-[#ffffff15] flex items-center justify-between px-6 md:px-10 flex-shrink-0 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic">
            Clothora
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-widest text-[#ffffff80]">
            <a href="#" className="text-[#ff4e00]">Home</a>
            <a href="#products" className="hover:text-white transition-colors">Shop All</a>
          </nav>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-[#ffffff0a] border border-[#ffffff15] hover:bg-[#ffffff15] transition-colors"
              >
                <User className="w-4 h-4 text-[#ff4e00]" />
                <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">
                  {user.displayName || user.email.split('@')[0]}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#111] border border-[#ffffff15] shadow-2xl z-50 flex flex-col">
                  <div className="px-4 py-3 border-b border-[#ffffff15]">
                    <p className="text-[10px] uppercase text-[#ffffff60] tracking-widest mb-1">Signed in as</p>
                    <p className="text-xs font-bold truncate">{user.email}</p>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#ff4e00] transition-colors"
                    >
                      <Shield className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#ffffff60] hover:text-[#ff4e00] hover:bg-[#ffffff0a] transition-colors text-left w-full"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-[#ff4e00] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#e64600] transition-colors">
              <ShoppingBag className="w-4 h-4" /> Sign In
            </Link>
          )}
          
          <div onClick={toggleCart} className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#ff4e00] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto overflow-x-hidden">
        <section className="flex-1 flex flex-col md:flex-row min-h-[600px]">
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-[#ff4e00] font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-4">
              Streetwear Essentials
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-6">
              Acid<br />Wash<br /><span className="text-[#ff4e00]">Shinobi</span>
            </h1>
            <p className="text-[#ffffff60] text-base md:text-lg max-w-sm mb-8 leading-relaxed italic">
              Premium heavyweight tees featuring hand-dyed acid wash textures and high-definition Naruto-themed graphics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-black px-8 md:px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#ff4e00] hover:text-white transition-colors">
                Shop Collection
              </button>
              <button className="border border-white text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors">
                View Lookup
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative bg-[#151515] flex items-center justify-center p-8 md:p-12 min-h-[400px]">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ff4e00 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative w-full max-w-md h-full min-h-[300px] bg-[#1c1c1c] border border-[#ffffff15] flex flex-col p-6 shadow-2xl">
              <div className="flex-1 bg-[#252525] flex items-center justify-center border border-[#ffffff05] relative overflow-hidden">
                <div className="text-center">
                  <div className="text-6xl md:text-[120px] leading-none opacity-10 font-black tracking-tighter">Uchiha</div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] md:border-[10px] border-[#ff4e00] opacity-50 blur-xl"></div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div>
                  <h3 className="text-lg md:text-xl font-bold uppercase">Hidden Leaf Tee</h3>
                  <p className="text-xs md:text-sm text-[#ffffff40]">Acid Wash Gray / 240GSM</p>
                </div>
                <div className="text-xl md:text-2xl font-black text-[#ff4e00]">$45.00</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section id="products" className="px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Latest Drops</h2>
            <p className="text-sm text-[#ffffff60] uppercase tracking-widest">Fresh from the vault</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#111] border border-[#ffffff15] overflow-hidden relative mb-4">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ffffff40]">
                    No Image
                  </div>
                )}
                
                {/* Overlay Add to cart button */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        imageUrl: product.imageUrl || ''
                      });
                    }}
                    disabled={product.stock <= 0}
                    className="w-full bg-[#ff4e00] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#e64600] disabled:opacity-50 disabled:bg-[#333] transition-colors"
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>

                {product.stock <= 0 && (
                  <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#ffffff15] backdrop-blur-sm">
                    Sold Out
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-[#ffffff60] tracking-widest">{product.category}</p>
                <h3 className="text-base font-bold uppercase tracking-tight">{product.title}</h3>
                <p className="text-[#ff4e00] font-bold">৳ {product.price}</p>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-24 text-[#ffffff60] uppercase tracking-widest text-xs font-bold border border-[#ffffff15] bg-[#111]">
            No products available yet.
          </div>
        )}
      </section>

      <footer className="border-t border-[#ffffff15] bg-[#000] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between text-[#ffffff40] text-[10px] uppercase tracking-widest">
        <p>© 2024 Clothora. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
        </div>
      </footer>
    </div>
  );
}
