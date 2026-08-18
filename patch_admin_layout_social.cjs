const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

if (!code.includes('social-links')) {
  const oldLinks = `<Link to="/admin/layouts" className={\`flex items-center gap-3 px-4 py-3 \${location.pathname === '/admin/layouts' ? 'bg-primary text-on-primary font-black shadow-[4px_4px_0px_var(--color-on-surface)]' : 'hover:bg-surface-bright'} transition-all\`} onClick={() => setSidebarOpen(false)}>
              <LayoutTemplate size={20} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Layouts</span>
            </Link>
          </nav>`;
          
  const newLinks = `<Link to="/admin/layouts" className={\`flex items-center gap-3 px-4 py-3 \${location.pathname === '/admin/layouts' ? 'bg-primary text-on-primary font-black shadow-[4px_4px_0px_var(--color-on-surface)]' : 'hover:bg-surface-bright'} transition-all\`} onClick={() => setSidebarOpen(false)}>
              <LayoutTemplate size={20} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Layouts</span>
            </Link>
            <Link to="/admin/social-links" className={\`flex items-center gap-3 px-4 py-3 \${location.pathname === '/admin/social-links' ? 'bg-primary text-on-primary font-black shadow-[4px_4px_0px_var(--color-on-surface)]' : 'hover:bg-surface-bright'} transition-all\`} onClick={() => setSidebarOpen(false)}>
              <LinkIcon size={20} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Social Links</span>
            </Link>
          </nav>`;
          
  code = code.replace(
    "import { LayoutDashboard, Package, ShoppingBag, MessageSquare, Bell, LogOut, Tag, Truck, Palette, LayoutTemplate, Menu, X, Image as ImageIcon } from 'lucide-react';",
    "import { LayoutDashboard, Package, ShoppingBag, MessageSquare, Bell, LogOut, Tag, Truck, Palette, LayoutTemplate, Menu, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';"
  );
  
  code = code.replace(oldLinks, newLinks);
  fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
  console.log('AdminLayout patched');
}
