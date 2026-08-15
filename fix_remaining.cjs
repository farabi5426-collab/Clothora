const fs = require('fs');

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/hover:bg-\[#e64600\]/g, 'hover:bg-primary-container');
  content = content.replace(/shadow-\[4px_4px_0px_#5c1900\]/g, 'shadow-[4px_4px_0px_var(--color-on-background)]');
  content = content.replace(/hover:shadow-\[2px_2px_0px_#5c1900\]/g, 'hover:shadow-[2px_2px_0px_var(--color-on-background)]');
  content = content.replace(/bg-\[#4ade80\]\/10/g, 'bg-green-500/10');
  content = content.replace(/text-\[#4ade80\]/g, 'text-green-500');
  content = content.replace(/border-\[#4ade80\]/g, 'border-green-500');
  content = content.replace(/bg-\[#60a5fa\]\/10/g, 'bg-blue-500/10');
  content = content.replace(/text-\[#60a5fa\]/g, 'text-blue-500');
  content = content.replace(/border-\[#60a5fa\]/g, 'border-blue-500');
  content = content.replace(/bg-\[#333\]/g, 'bg-surface-container');
  content = content.replace(/hover:file:bg-\[#444\]/g, 'hover:file:bg-surface-container-high');
  fs.writeFileSync(filePath, content);
}

replaceColors('src/components/auth/Login.tsx');
replaceColors('src/pages/store/CustomerDashboard.tsx');
replaceColors('src/pages/admin/ProductsManagement.tsx');

