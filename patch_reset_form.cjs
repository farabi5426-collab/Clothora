const fs = require('fs');
const file = 'src/pages/admin/ProductsManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "setFormData({ title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [], videoUrl: '', showInBanner: false });",
  "setFormData({ title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [], sizes: [], videoUrl: '', showInBanner: false });"
);

code = code.replace(
  "const isSelected = formData.sizes.includes(size);",
  "const isSelected = (formData.sizes || []).includes(size);"
);

fs.writeFileSync(file, code);
