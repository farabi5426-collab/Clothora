import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t-2 border-outline mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] px-4 md:px-16 py-[48px] w-full max-w-[1920px] mx-auto">
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-start"><img src="/homepagelogo-removebg-preview.png" alt="Clothora" className="h-10 md:h-12 w-auto object-contain" /></div>
          <p className="text-[16px] text-primary uppercase tracking-widest mt-auto mb-4 md:mb-0">
            © 2024 CLOTHORA. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="md:col-span-8 flex justify-start md:justify-end gap-[48px]">
          <div className="flex flex-col gap-4 text-left md:text-right">
            <Link to="/policies/refund-policy" className="text-[14px] text-on-surface-variant hover:text-primary uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none">Refund Policy</Link>
            <Link to="/policies/privacy-policy" className="text-[14px] text-on-surface-variant hover:text-primary uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none">Privacy Policy</Link>
            <Link to="/policies/terms-conditions" className="text-[14px] text-on-surface-variant hover:text-primary uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
