import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0e0e0e] border-t-2 border-[#353534] mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] px-[16px] md:px-[64px] py-[48px] w-full max-w-[1920px] mx-auto">
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="text-[48px] font-black tracking-tighter text-[#e5e2e1] uppercase leading-none">CLOTHORA</div>
          <p className="text-[16px] text-[#ffb59c] uppercase tracking-widest mt-auto mb-4 md:mb-0">
            © 2024 CLOTHORA. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="md:col-span-8 flex justify-start md:justify-end gap-[48px]">
          <div className="flex flex-col gap-4">
            <a href="#" className="text-[16px] text-[#e3bfb3] hover:text-[#e5e2e1] uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffb59c]">Terms</a>
            <a href="#" className="text-[16px] text-[#e3bfb3] hover:text-[#e5e2e1] uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffb59c]">Shipping</a>
            <a href="#" className="text-[16px] text-[#e3bfb3] hover:text-[#e5e2e1] uppercase font-bold tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffb59c]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
