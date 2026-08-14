import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { motion, AnimatePresence } from 'motion/react';

export default function TopNavBar() {
  const { user, logout } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 w-full z-50 border-b-2 border-surface-bright bg-surface/90 backdrop-blur-md">
      <div className="flex justify-between items-center h-20 px-[16px] md:px-[64px] w-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-[24px] md:text-[32px] font-black tracking-tighter text-on-surface flex items-center gap-2">
            CLOTHORA
          </Link>
        </div>

        <nav className="hidden md:flex gap-[24px] items-center h-full">
          <Link to="/" className="text-[14px] font-bold uppercase tracking-[0.1em] text-primary border-b-2 border-primary h-full flex items-center pt-1">
            Shop
          </Link>
          <a href="/#new-arrivals" className="text-[14px] font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            New Arrivals
          </a>
          <a href="/#naruto" className="text-[14px] font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            Naruto Collection
          </a>
          <a href="/#about" className="text-[14px] font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            About
          </a>
        </nav>

        <div className="flex items-center gap-6">
          <button aria-label="search" className="text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="person" 
                className={`text-on-surface hover:text-primary transition-colors flex items-center ${isDropdownOpen ? 'text-primary' : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </button>
              
              <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-4 w-48 bg-surface border-2 border-surface-bright shadow-[4px_4px_0px_rgba(0,0,0,1)] py-2 flex flex-col z-50 origin-top-right"
                >
                  <Link 
                    to="/account" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-3 text-[12px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright hover:text-primary transition-colors text-left"
                  >
                    Order History
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-4 py-3 text-[12px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright hover:text-primary transition-colors text-left"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-3 text-[12px] font-bold uppercase tracking-widest text-error hover:bg-error-container hover:text-on-error-container transition-colors text-left w-full"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" aria-label="person" className="text-on-surface hover:text-primary transition-colors">
              <span className="material-symbols-outlined">person</span>
            </Link>
          )}
          <button 
            onClick={toggleCart} 
            aria-label="shopping_bag" 
            className="text-on-surface hover:text-primary transition-colors relative group"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">shopping_bag</span>
            {cartItemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartItemCount}
                className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface"
              >
                {cartItemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
