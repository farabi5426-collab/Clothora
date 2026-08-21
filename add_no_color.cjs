const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf8');

// I also need to update the dataToSave and resetForm to include noColorVariations.
content = content.replace(
  /showInBanner: Boolean\(currentFormData\.showInBanner\),/,
  'showInBanner: Boolean(currentFormData.showInBanner),\n          noColorVariations: Boolean(currentFormData.noColorVariations),'
);

content = content.replace(
  /showInBanner: product\.showInBanner \|\| false,/,
  'showInBanner: product.showInBanner || false,\n      noColorVariations: product.noColorVariations || false,'
);

content = content.replace(
  /showInBanner: false \}\)/,
  'showInBanner: false, noColorVariations: false })'
);

const checkboxToAdd = `
              <div className="bg-surface-container-low border border-outline-variant p-4 mt-4">
                  <div className="flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="noColorVariations"
                        checked={formData.noColorVariations || false}
                        onChange={e => setFormData({...formData, noColorVariations: e.target.checked})}
                        className="w-4 h-4 accent-primary"
                     />
                     <label htmlFor="noColorVariations" className="text-xs uppercase tracking-widest text-on-background font-bold cursor-pointer">
                        No Color Variations (Single Variant Product)
                     </label>
                  </div>
              </div>
`;

content = content.replace(
  /<button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary p-4 text-xs font-bold uppercase tracking-widest mt-6 transition-colors flex items-center justify-center gap-2">/,
  match => checkboxToAdd + match
);

fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', content);
