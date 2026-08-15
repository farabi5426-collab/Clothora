import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function TopNavBar() {
  const { user, logout } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-on-surface hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter text-on-surface flex items-center gap-2">
            CLOTHORA
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center h-full">
          <Link to="/" className="text-sm font-bold uppercase tracking-[0.1em] text-primary border-b-2 border-primary h-full flex items-center pt-1">
            Shop
          </Link>
          <a href="/#new-arrivals" className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            New Arrivals
          </a>
          <a href="/#naruto" className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            Naruto Collection
          </a>
          <a href="/#about" className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            About
          </a>
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
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
                    className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright hover:text-primary transition-colors text-left"
                  >
                    Order History
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright hover:text-primary transition-colors text-left"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-error hover:bg-error-container hover:text-on-error-container transition-colors text-left w-full"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" aria-label="person" className="text-on-surface hover:text-primary transition-colors hidden sm:block">
              <span className="material-symbols-outlined">person</span>
            </Link>
          )}

          <button 
            id="cart-icon"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-2 border-surface-bright bg-surface overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-primary p-2 border-l-2 border-primary">
                Shop
              </Link>
              <a href="/#new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary p-2 transition-colors">
                New Arrivals
              </a>
              <a href="/#naruto" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary p-2 transition-colors">
                Naruto Collection
              </a>
              <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary p-2 transition-colors">
                About
              </a>
              {!user && (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary p-2 transition-colors">
                  Login / Register
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
