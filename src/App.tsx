/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import MessagesManagement from './pages/admin/MessagesManagement';
import NoticesManagement from './pages/admin/NoticesManagement';
import PromoCodesManagement from './pages/admin/PromoCodesManagement';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import Login from './components/auth/Login';
import Home from './pages/store/Home';

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Storefront */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Secured Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="messages" element={<MessagesManagement />} />
          <Route path="notices" element={<NoticesManagement />} />
          <Route path="promo-codes" element={<PromoCodesManagement />} />
          <Route path="delivery" element={<DeliveryManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
