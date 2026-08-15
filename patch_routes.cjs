const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('BannersManagement')) {
  appContent = appContent.replace(
    "import LayoutManagement from './pages/admin/LayoutManagement';",
    "import LayoutManagement from './pages/admin/LayoutManagement';\nimport BannersManagement from './pages/admin/BannersManagement';"
  );
  appContent = appContent.replace(
    '<Route path="layouts" element={<LayoutManagement />} />',
    '<Route path="layouts" element={<LayoutManagement />} />\n          <Route path="banners" element={<BannersManagement />} />'
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

// Patch AdminLayout.tsx
let layoutContent = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf-8');
if (!layoutContent.includes('banners')) {
  layoutContent = layoutContent.replace(
    "import { Package, LayoutDashboard, ShoppingCart, LogOut, MessageSquare, Bell, Ticket, Truck, Palette } from 'lucide-react';",
    "import { Package, LayoutDashboard, ShoppingCart, LogOut, MessageSquare, Bell, Ticket, Truck, Palette, Video } from 'lucide-react';"
  );
  layoutContent = layoutContent.replace(
    "{ name: 'Themes', href: '/admin/themes', icon: Palette },",
    "{ name: 'Themes', href: '/admin/themes', icon: Palette },\n    { name: 'Banners', href: '/admin/banners', icon: Video },"
  );
  fs.writeFileSync('src/components/admin/AdminLayout.tsx', layoutContent);
}
