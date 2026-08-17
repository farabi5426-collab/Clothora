const fs = require('fs');
let code = fs.readFileSync('src/components/store/TopNavBar.tsx', 'utf8');

if (!code.includes('useLocation')) {
    code = code.replace(
      "import { Link } from 'react-router-dom';",
      "import { Link, useLocation } from 'react-router-dom';"
    );
}

// Add location hook
code = code.replace(
  "export default function TopNavBar() {\n  const { user, logout } = useAuthStore();",
  "export default function TopNavBar() {\n  const location = useLocation();\n  const { user, logout } = useAuthStore();"
);

// Desktop Navigation
code = code.replace(
  /<nav className="hidden md:flex gap-6 items-center h-full">([\s\S]*?)<\/nav>/,
  `<nav className="hidden md:flex gap-6 items-center h-full">
          <Link to="/" className={\`text-sm font-bold uppercase tracking-[0.1em] h-full flex items-center pt-1 \${location.pathname === '/' && location.hash !== '#gadgets' && location.hash !== '#about' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors duration-200'}\`}>
            Clothes
          </Link>
          <a href="/#gadgets" className={\`text-sm font-bold uppercase tracking-[0.1em] h-full flex items-center pt-1 \${location.pathname === '/' && location.hash === '#gadgets' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors duration-200'}\`}>
            Gadgets
          </a>
          <Link to="/track-order" className={\`text-sm font-bold uppercase tracking-[0.1em] h-full flex items-center pt-1 \${location.pathname === '/track-order' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors duration-200'}\`}>
            Track Order
          </Link>
          <a href="/#about" className={\`text-sm font-bold uppercase tracking-[0.1em] h-full flex items-center pt-1 \${location.pathname === '/' && location.hash === '#about' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors duration-200'}\`}>
            About
          </a>
        </nav>`
);

// Mobile Navigation
code = code.replace(
  /<nav className="flex flex-col p-4 gap-4">([\s\S]*?)<\/nav>/,
  `<nav className="flex flex-col p-4 gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={\`text-sm font-bold uppercase tracking-[0.1em] p-2 \${location.pathname === '/' && location.hash !== '#gadgets' && location.hash !== '#about' ? 'text-primary border-l-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}\`}>
                Clothes
              </Link>
              <a href="/#gadgets" onClick={() => setIsMobileMenuOpen(false)} className={\`text-sm font-bold uppercase tracking-[0.1em] p-2 \${location.pathname === '/' && location.hash === '#gadgets' ? 'text-primary border-l-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}\`}>
                Gadgets
              </a>
              <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className={\`text-sm font-bold uppercase tracking-[0.1em] p-2 \${location.pathname === '/track-order' ? 'text-primary border-l-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}\`}>
                Track Order
              </Link>
              <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className={\`text-sm font-bold uppercase tracking-[0.1em] p-2 \${location.pathname === '/' && location.hash === '#about' ? 'text-primary border-l-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}\`}>
                About
              </a>
              {!user && (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary p-2 transition-colors">
                  Login / Register
                </Link>
              )}
            </nav>`
);

fs.writeFileSync('src/components/store/TopNavBar.tsx', code);
