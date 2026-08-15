const fs = require('fs');
const glob = require('glob');

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
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
  content = content.replace(/text-\[#f5f5f5\]/g, 'text-on-background');
  content = content.replace(/hover:text-white/g, 'hover:text-primary');
  
  content = content.replace(/shadow-\[0_0_15px_rgba\(255,78,0,0\.3\)\]/g, 'shadow-[0_0_15px_var(--color-primary)]');
  
  content = content.replace(/hover:bg-\[#ff4e00\]/g, 'hover:bg-primary');
  content = content.replace(/hover:bg-\[#e64600\]/g, 'hover:bg-primary-container');
  content = content.replace(/bg-\[#ff4e00\]\/10/g, 'bg-primary/10');
  content = content.replace(/hover:bg-\[#ff4e00\]\/10/g, 'hover:bg-primary/10');
  
  content = content.replace(/border-\[#ffffff0a\]/g, 'border-outline-variant/50');
  content = content.replace(/bg-\[#ffffff05\]/g, 'bg-surface-container/50');
  content = content.replace(/hover:bg-\[#ffffff05\]/g, 'hover:bg-surface-container/50');
  content = content.replace(/hover:bg-\[#ffffff0a\]/g, 'hover:bg-surface-container');
  content = content.replace(/hover:border-\[#ffffff40\]/g, 'hover:border-outline');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

const files = glob.sync('src/{pages,components}/admin/**/*.tsx');
files.forEach(replaceColors);

