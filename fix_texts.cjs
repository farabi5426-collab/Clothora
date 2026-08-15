const fs = require('fs');

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/text-\[#ffffff50\]/g, 'text-on-surface-variant');
  content = content.replace(/text-\[#e5e2e1\]/g, 'text-on-surface');
  content = content.replace(/text-\[#ffb59c\]/g, 'text-primary');
  content = content.replace(/text-\[#e3bfb3\]/g, 'text-on-surface-variant');
  content = content.replace(/hover:text-\[#e5e2e1\]/g, 'hover:text-on-surface');
  content = content.replace(/ring-\[#ffb59c\]/g, 'ring-primary');
  fs.writeFileSync(filePath, content);
}

replaceColors('src/components/store/ChatWidget.tsx');
replaceColors('src/components/store/Footer.tsx');
