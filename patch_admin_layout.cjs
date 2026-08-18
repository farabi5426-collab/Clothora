const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

const navCode = `  const navigation = [
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
  ];`;

const newNavCode = `  const navigation = [
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
  ];`;

if (code.includes(navCode)) {
  code = code.replace(
    "import { Package, LayoutDashboard, ShoppingCart, LogOut, MessageSquare, Bell, Ticket, Truck, Palette, Video } from 'lucide-react';",
    "import { Package, LayoutDashboard, ShoppingCart, LogOut, MessageSquare, Bell, Ticket, Truck, Palette, Video, Link as LinkIcon } from 'lucide-react';"
  );
  code = code.replace(navCode, newNavCode);
  fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
  console.log("Admin layout nav fixed");
} else {
  console.log("Could not find navCode");
}
