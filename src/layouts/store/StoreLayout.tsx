import React from 'react';
import { Outlet } from 'react-router-dom';
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
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}
