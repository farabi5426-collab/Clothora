const fs = require('fs');

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace hardcoded colors with theme variables
  content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-background');
  content = content.replace(/bg-\[#111\]/g, 'bg-surface-container-lowest');
  content = content.replace(/bg-\[#1a1a1a\]/g, 'bg-surface-container-low');
  content = content.replace(/text-\[#ff4e00\]/g, 'text-primary');
  content = content.replace(/bg-\[#ff4e00\]/g, 'bg-primary');
  content = content.replace(/border-\[#ff4e00\]/g, 'border-primary');
  content = content.replace(/fill-\[#ff4e00\]/g, 'fill-primary');
  content = content.replace(/border-\[#ffffff15\]/g, 'border-outline-variant');
  content = content.replace(/text-white/g, 'text-on-background');
  content = content.replace(/text-\[#ffffff80\]/g, 'text-on-surface-variant');
  content = content.replace(/text-\[#ffffff60\]/g, 'text-on-surface-variant');
  content = content.replace(/text-\[#ffffff40\]/g, 'text-on-surface-variant');
  content = content.replace(/text-\[#ffffff90\]/g, 'text-on-surface');
  content = content.replace(/hover:text-white/g, 'hover:text-primary');
  
  // For shadows with hardcoded colors
  content = content.replace(/shadow-\[8px_8px_0px_#ff4e00\]/g, 'shadow-[8px_8px_0px_var(--color-primary)]');
  content = content.replace(/shadow-\[2px_2px_0px_#fff\]/g, 'shadow-[2px_2px_0px_var(--color-on-background)]');
  content = content.replace(/shadow-\[4px_4px_0px_#ffffff\]/g, 'shadow-[4px_4px_0px_var(--color-on-background)]');
  content = content.replace(/shadow-\[2px_2px_0px_#ffffff\]/g, 'shadow-[2px_2px_0px_var(--color-on-background)]');
  content = content.replace(/shadow-\[1px_1px_0px_#ffffff\]/g, 'shadow-[1px_1px_0px_var(--color-on-background)]');
  content = content.replace(/shadow-\[0_0_15px_rgba\(255,78,0,0\.4\)\]/g, 'shadow-[0_0_15px_var(--color-primary)]');
  content = content.replace(/shadow-\[0_0_10px_rgba\(255,78,0,0\.2\)\]/g, 'shadow-[0_0_10px_var(--color-primary)]');

  // specific text replacements
  content = content.replace(/hover:bg-\[#ff4e00\]/g, 'hover:bg-primary');
  content = content.replace(/hover:border-\[#ff4e00\]/g, 'hover:border-primary');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

replaceColors('src/pages/store/Home.tsx');
replaceColors('src/pages/store/ProductPage.tsx');

