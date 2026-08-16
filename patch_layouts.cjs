const fs = require('fs');

const files = [
  'src/components/store/layouts/MagazineStyle.tsx',
  'src/components/store/layouts/ClassicGrid.tsx',
  'src/components/store/layouts/HorizontalGallery.tsx',
  'src/components/store/layouts/Lookbook.tsx',
  'src/components/store/layouts/SplitScreen.tsx',
  'src/components/store/layouts/MasonryGrid.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes("import { useState }")) {
    code = code.replace("import React from 'react';", "import React, { useState } from 'react';\nimport toast from 'react-hot-toast';");
  }

  if (!code.includes("const [selectedSizes")) {
    code = code.replace("const { addToCart } = useCartStore();", "const { addToCart } = useCartStore();\n  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});");
  }
  
  fs.writeFileSync(file, code);
}
