const fs = require('fs');
let code = fs.readFileSync('src/components/store/TopNavBar.tsx', 'utf8');

// Desktop Navigation
code = code.replace(
  /<Link to="\/" className="text-sm font-bold uppercase tracking-\[0\.1em\] text-primary border-b-2 border-primary h-full flex items-center pt-1">\s*Shop\s*<\/Link>/,
  `<Link to="/" className="text-sm font-bold uppercase tracking-[0.1em] text-primary border-b-2 border-primary h-full flex items-center pt-1">
            Clothes
          </Link>`
);

code = code.replace(
  /<a href="\/#new-arrivals" className="text-sm font-bold uppercase tracking-\[0\.1em\] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">\s*New Arrivals\s*<\/a>/,
  `<a href="/#gadgets" className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            Gadgets
          </a>`
);

code = code.replace(
  /<a href="\/#naruto" className="text-sm font-bold uppercase tracking-\[0\.1em\] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">\s*Naruto Collection\s*<\/a>/,
  `<Link to="/track-order" className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-200 h-full flex items-center">
            Track Order
          </Link>`
);

// Mobile Navigation
code = code.replace(
  /<Link to="\/" onClick=\{\(\) => setIsMobileMenuOpen\(false\)\} className="text-sm font-bold uppercase tracking-\[0\.1em\] text-primary p-2">\s*Shop\s*<\/Link>/,
  `<Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-primary p-2">
                Clothes
              </Link>`
);

code = code.replace(
  /<a href="\/#new-arrivals" onClick=\{\(\) => setIsMobileMenuOpen\(false\)\} className="text-sm font-bold uppercase tracking-\[0\.1em\] text-on-surface-variant hover:text-primary p-2 transition-colors">\s*New Arrivals\s*<\/a>/,
  `<a href="/#gadgets" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary p-2 transition-colors">
                Gadgets
              </a>`
);

code = code.replace(
  /<a href="\/#naruto" onClick=\{\(\) => setIsMobileMenuOpen\(false\)\} className="text-sm font-bold uppercase tracking-\[0\.1em\] text-on-surface-variant hover:text-primary p-2 transition-colors">\s*Naruto Collection\s*<\/a>/,
  `<Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary p-2 transition-colors">
                Track Order
              </Link>`
);

fs.writeFileSync('src/components/store/TopNavBar.tsx', code);
