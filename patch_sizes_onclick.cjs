const fs = require('fs');
const file = 'src/pages/admin/ProductsManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "setFormData({...formData, sizes: formData.sizes.filter(s => s !== size)});",
  "setFormData({...formData, sizes: (formData.sizes || []).filter(s => s !== size)});"
);

code = code.replace(
  "setFormData({...formData, sizes: [...formData.sizes, size]});",
  "setFormData({...formData, sizes: [...(formData.sizes || []), size]});"
);

fs.writeFileSync(file, code);
