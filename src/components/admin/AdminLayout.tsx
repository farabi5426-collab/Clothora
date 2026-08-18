import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Package, LayoutDashboard, ShoppingCart, LogOut, MessageSquare, Bell, Ticket, Truck, Palette, Video, Link as LinkIcon } from 'lucide-react';

export default function AdminLayout() {
  const { user, loading, logout } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Notices', href: '/admin/notices', icon: Bell },
    { name: 'Promo Codes', href: '/admin/promo-codes', icon: Ticket },
    { name: 'Delivery', href: '/admin/delivery', icon: Truck },
    { name: 'Themes', href: '/admin/themes', icon: Palette },
    { name: 'Banners', href: '/admin/banners', icon: Video },
    { name: 'Layouts', href: '/admin/layouts', icon: LayoutDashboard },
    { name: 'Social Links', href: '/admin/social-links', icon: LinkIcon },
  ];

  return (
    <div className="h-screen w-full bg-background text-on-background font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-background md:bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant flex flex-col flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-outline-variant">
          <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic text-on-background flex items-center">
            Clothora <span className="text-primary text-[10px] uppercase tracking-[0.3em] ml-3 mt-1 not-italic">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-none uppercase text-xs font-bold tracking-widest transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-background hover:bg-surface-container'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-outline-variant hidden md:block">
          <div className="mb-4">
            <p className="text-xs uppercase font-bold tracking-widest text-on-background mb-1">{user.displayName}</p>
            <p className="text-[10px] text-on-surface-variant truncate tracking-wider">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left uppercase text-xs font-bold tracking-widest text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
