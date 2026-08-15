import React from 'react';
import { Outlet } from 'react-router-dom';
import { Truck, CreditCard, RefreshCw } from 'lucide-react';
import TopNavBar from '../../components/store/TopNavBar';
import Footer from '../../components/store/Footer';
import CartDrawer from '../../components/store/CartDrawer';
import NoticeBanner from '../../components/store/NoticeBanner';
import ChatWidget from '../../components/store/ChatWidget';

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-background bg-background selection:bg-primary-container selection:text-black overflow-x-hidden">
      <NoticeBanner />
      <TopNavBar />
      <div className="flex-grow">
        <Outlet />
      </div>
      
      {/* Trust Signals */}
      <section className="border-t border-b border-outline-variant bg-surface-container-lowest">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-16 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#ffffff15]">
            <div className="flex items-center justify-center gap-4 py-4 md:py-0">
              <Truck className="w-8 h-8 text-primary" />
              <div className="text-left">
                <h4 className="font-black uppercase tracking-widest text-sm text-on-background">Fast Delivery</h4>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">All Over Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-4 md:py-0">
              <CreditCard className="w-8 h-8 text-primary" />
              <div className="text-left">
                <h4 className="font-black uppercase tracking-widest text-sm text-on-background">Secure Payment</h4>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">100% Safe Checkout</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-4 md:py-0">
              <RefreshCw className="w-8 h-8 text-primary" />
              <div className="text-left">
                <h4 className="font-black uppercase tracking-widest text-sm text-on-background">7-Days Return</h4>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Easy Exchange Policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}
