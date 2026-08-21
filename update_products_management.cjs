const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf8');

content = content.replace(
  /showInBanner\?: boolean;/g,
  'showInBanner?: boolean;\n  noColorVariations?: boolean;'
);

content = content.replace(
  /const \[formData, setFormData\] = useState<Partial<Product>>\(\{/g,
  'const [formData, setFormData] = useState<Partial<Product>>({'
);

content = content.replace(
  /showInBanner: false/,
  'showInBanner: false,\n    noColorVariations: false'
);

content = content.replace(
  /className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Show in Homepage Banner<\/label>/g,
  `className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Show in Homepage Banner</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input 
                      type="checkbox" 
                      checked={formData.noColorVariations || false} 
                      onChange={e => setFormData({...formData, noColorVariations: e.target.checked})} 
                      className="w-4 h-4 text-primary bg-surface-container-low border-outline-variant focus:ring-primary focus:ring-2"
                    />
                    <span className="text-xs uppercase tracking-widest font-bold text-on-background">No Color Variations (Single Variant)</span>
                  </label>`
);

fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', content);
