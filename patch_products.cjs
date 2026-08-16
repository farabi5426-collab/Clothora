const fs = require('fs');
const file = 'src/pages/admin/ProductsManagement.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update Product Interface
code = code.replace(
  "imageUrl: string;\n  imageUrls?: string[];",
  "imageUrl: string;\n  imageUrls?: string[];\n  sizes?: string[];"
);

// 2. Update formData
code = code.replace(
  "title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [] as string[], videoUrl: '', showInBanner: false",
  "title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [] as string[], sizes: [] as string[], videoUrl: '', showInBanner: false"
);

// 3. Update dataToSave
code = code.replace(
  "showInBanner: Boolean(currentFormData.showInBanner)",
  "showInBanner: Boolean(currentFormData.showInBanner),\n          sizes: currentFormData.sizes || []"
);

// 4. Update openEdit to populate sizes
code = code.replace(
  "videoUrl: product.videoUrl || '', showInBanner: product.showInBanner || false",
  "videoUrl: product.videoUrl || '', showInBanner: product.showInBanner || false, sizes: product.sizes || []"
);

// 5. Add Size Selector UI in modal
const categoryUI = `<div className="col-span-2 md:col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                  <div className="flex gap-2">
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors ">
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="bg-surface-container-high border border-outline-variant px-4 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest shrink-0">
                      Manage
                    </button>
                  </div>
                </div>`;

const sizeUI = `
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => {
                       const isSelected = formData.sizes.includes(size);
                       return (
                         <button
                           key={size}
                           type="button"
                           onClick={() => {
                             if (isSelected) {
                               setFormData({...formData, sizes: formData.sizes.filter(s => s !== size)});
                             } else {
                               setFormData({...formData, sizes: [...formData.sizes, size]});
                             }
                           }}
                           className={\`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border transition-colors \${isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary'}\`}
                         >
                           {size}
                         </button>
                       )
                    })}
                  </div>
                </div>
`;

code = code.replace(
  `<div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                  <div className="flex gap-2">`,
  `<div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                  <div className="flex gap-2">`
);

code = code.replace(
  `Manage
                    </button>
                  </div>
                </div>`,
  `Manage
                    </button>
                  </div>
                </div>
                ${sizeUI}`
);


fs.writeFileSync(file, code);
