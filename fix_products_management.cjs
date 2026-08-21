const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf8');

// I might have messed up the previous replace, let's fix it by searching for the actual checkbox div.
const checkboxTarget = `<div className="mt-4 flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="showInBanner"
                        checked={formData.showInBanner}
                        onChange={e => setFormData({...formData, showInBanner: e.target.checked})}
                        className="w-4 h-4 accent-primary"
                     />
                     <label htmlFor="showInBanner" className="text-sm font-bold uppercase text-on-background tracking-wider cursor-pointer">
                        Show in Homepage Banner
                     </label>
                  </div>`;

if (content.includes('Show in Homepage Banner')) {
   content = content.replace(
     /<div className="mt-4 flex items-center gap-2">[\s\S]*?Show in Homepage Banner[\s\S]*?<\/label>\s*<\/div>/,
     match => match + `\n                  <div className="mt-4 flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="noColorVariations"
                        checked={formData.noColorVariations || false}
                        onChange={e => setFormData({...formData, noColorVariations: e.target.checked})}
                        className="w-4 h-4 accent-primary"
                     />
                     <label htmlFor="noColorVariations" className="text-sm font-bold uppercase text-on-background tracking-wider cursor-pointer">
                        No Color Variations (Single Variant)
                     </label>
                  </div>`
   );
}
fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', content);
