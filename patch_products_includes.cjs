const fs = require('fs');
const file = 'src/pages/admin/ProductsManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix includes crash
code = code.replace(
  "p => targetTitles.includes(p.title) || p.title.includes(\"BARCELONA\") || p.title.includes(\"PREMIUM ACID WASH\") || p.title.includes(\"ACID WASH\\\" DROP\")",
  "p => p.title && (targetTitles.includes(p.title) || p.title.includes(\"BARCELONA\") || p.title.includes(\"PREMIUM ACID WASH\") || p.title.includes(\"ACID WASH\\\" DROP\"))"
);

// Fix openEdit sizes
code = code.replace(
  "videoUrl: product.videoUrl || '',\\n      showInBanner: product.showInBanner || false\\n    });",
  "videoUrl: product.videoUrl || '',\\n      showInBanner: product.showInBanner || false,\\n      sizes: product.sizes || []\\n    });"
);

// A more robust regex for openEdit
code = code.replace(/showInBanner: product\.showInBanner \|\| false\n\s*\}\);/, "showInBanner: product.showInBanner || false,\n      sizes: product.sizes || []\n    });");

fs.writeFileSync(file, code);
