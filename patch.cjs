const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/PromoCodesManagement.tsx', 'utf8');

// Interface
code = code.replace(
  "discountPercent: number;",
  "discountPercent?: number;\n  discountAmount?: number;"
);

// State
code = code.replace(
  "code: '', discountPercent: '', minOrderAmount: '', maxUsers: '', expiryDate: ''",
  "code: '', discountPercent: '', discountAmount: '', minOrderAmount: '', maxUsers: '', expiryDate: ''"
);

// Handle Submit
code = code.replace(
  /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?try \{[\s\S]*?await addDoc\(collection\(db, 'promoCodes'\), \{/,
  `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.discountPercent && !formData.discountAmount) {
      alert('Please provide either a discount percentage or a flat discount amount.');
      return;
    }
    try {
      await addDoc(collection(db, 'promoCodes'), {`
);

code = code.replace(
  "discountPercent: Number(formData.discountPercent),",
  "discountPercent: formData.discountPercent ? Number(formData.discountPercent) : 0,\n        discountAmount: formData.discountAmount ? Number(formData.discountAmount) : 0,"
);

code = code.replace(
  "setFormData({ code: '', discountPercent: '', minOrderAmount: '', maxUsers: '', expiryDate: '' });",
  "setFormData({ code: '', discountPercent: '', discountAmount: '', minOrderAmount: '', maxUsers: '', expiryDate: '' });"
);

// Table Render
code = code.replace(
  '<td className="p-4 font-bold">{promo.discountPercent}%</td>',
  '<td className="p-4 font-bold">{promo.discountPercent && promo.discountPercent > 0 ? `${promo.discountPercent}%` : `৳ ${promo.discountAmount}`}</td>'
);

// Form
const oldForm = `              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Discount (%)</label>
                  <input required type="number" min="1" max="100" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Min Order (৳)</label>
                  <input required type="number" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Max Users</label>
                  <input required type="number" min="1" value={formData.maxUsers} onChange={e => setFormData({...formData, maxUsers: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Expiry Date</label>
                  <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>`;

const newForm = `              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Discount (%)</label>
                  <input type="number" min="1" max="100" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value, discountAmount: ''})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" placeholder="e.g. 10" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Discount Amount (৳)</label>
                  <input type="number" min="1" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: e.target.value, discountPercent: ''})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" placeholder="e.g. 100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Min Order (৳)</label>
                  <input required type="number" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Max Users</label>
                  <input required type="number" min="1" value={formData.maxUsers} onChange={e => setFormData({...formData, maxUsers: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Expiry Date</label>
                  <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none" />
                </div>
              </div>`;

code = code.replace(oldForm, newForm);

fs.writeFileSync('src/pages/admin/PromoCodesManagement.tsx', code);
