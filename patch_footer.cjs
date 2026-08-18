const fs = require('fs');
let code = fs.readFileSync('src/components/store/Footer.tsx', 'utf8');

// replace anchor tags with Link
code = code.replace(
  "import React from 'react';",
  "import React from 'react';\nimport { Link } from 'react-router-dom';"
);

const oldLinks = `<div className="flex flex-col gap-4">
            <a href="#" className="text-[16px] text-on-surface-variant hover:text-on-surface uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Terms</a>
            <a href="#" className="text-[16px] text-on-surface-variant hover:text-on-surface uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Shipping</a>
            <a href="#" className="text-[16px] text-on-surface-variant hover:text-on-surface uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Contact</a>
          </div>`;

const newLinks = `<div className="flex flex-col gap-4 text-left md:text-right">
            <Link to="/policies/refund-policy" className="text-[14px] text-on-surface-variant hover:text-primary uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none">Refund Policy</Link>
            <Link to="/policies/privacy-policy" className="text-[14px] text-on-surface-variant hover:text-primary uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none">Privacy Policy</Link>
            <Link to="/policies/terms-conditions" className="text-[14px] text-on-surface-variant hover:text-primary uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none">Terms & Conditions</Link>
          </div>`;

code = code.replace(oldLinks, newLinks);

fs.writeFileSync('src/components/store/Footer.tsx', code);
console.log('Footer Patched');
