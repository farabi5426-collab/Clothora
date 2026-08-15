/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useLayoutStore } from './store/layoutStore';

// Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import MessagesManagement from './pages/admin/MessagesManagement';
import NoticesManagement from './pages/admin/NoticesManagement';
import PromoCodesManagement from './pages/admin/PromoCodesManagement';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import ThemeManagement from './pages/admin/ThemeManagement';
import LayoutManagement from './pages/admin/LayoutManagement';
import BannersManagement from './pages/admin/BannersManagement';
import Login from './components/auth/Login';
import Home from './pages/store/Home';
import ProductPage from './pages/store/ProductPage';
import { Toaster } from 'react-hot-toast';
import CustomerDashboard from './pages/store/CustomerDashboard';
import StoreLayout from './layouts/store/StoreLayout';

export default function App() {
  const { checkAuth } = useAuthStore();
  const { initTheme } = useThemeStore();
  const { initLayout } = useLayoutStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const unsubscribeTheme = initTheme();
    const unsubscribeLayout = initLayout();
  }, [initTheme, initLayout]);

  return (
    <BrowserRouter>
      <Toaster position="bottom-center" toastOptions={{ style: { background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)', border: '2px solid var(--color-surface-bright)', borderRadius: 'var(--radius-theme)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', boxShadow: '4px 4px 0px rgba(0,0,0,1)' } }} />
      <Routes>
        {/* Public Storefront */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<CustomerDashboard />} />
        </Route>

        {/* Admin Secured Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="messages" element={<MessagesManagement />} />
          <Route path="notices" element={<NoticesManagement />} />
          <Route path="promo-codes" element={<PromoCodesManagement />} />
          <Route path="delivery" element={<DeliveryManagement />} />
          <Route path="themes" element={<ThemeManagement />} />
          <Route path="layouts" element={<LayoutManagement />} />
          <Route path="banners" element={<BannersManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
