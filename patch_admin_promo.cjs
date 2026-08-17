const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/PromoCodesManagement.tsx', 'utf8');

// 1. Add isActive to PromoCode interface
code = code.replace(
  "  expiryDate: string;\n  createdAt: any;\n}",
  "  expiryDate: string;\n  createdAt: any;\n  isActive?: boolean;\n}"
);

// 2. Add isActive: true when creating a new promo code
code = code.replace(
  "expiryDate: formData.expiryDate,\n        createdAt: new Date()\n      });",
  "expiryDate: formData.expiryDate,\n        createdAt: new Date(),\n        isActive: true\n      });"
);

// 3. Add handleToggleStatus function
const handleToggleStatus = `
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const promoRef = doc(db, 'promoCodes', id);
      const { updateDoc } = require('firebase/firestore'); // ensure import
      await updateDoc(promoRef, { isActive: !currentStatus });
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status.');
    }
  };
`;
// Let's insert it before handleDelete
code = code.replace(
  "const handleDelete = async (id: string) => {",
  `const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // updateDoc needs to be imported, but we can do it via firebase/firestore at the top
      await updateDoc(doc(db, 'promoCodes', id), { isActive: !currentStatus });
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {`
);

// Make sure updateDoc is imported
code = code.replace(
  "collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy",
  "collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc"
);

// 4. Update the table headers
code = code.replace(
  /<th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions<\/th>/,
  `<th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>`
);

// 5. Update the table rows
const oldTdActions = /<td className="p-4 flex justify-end">[\s\S]*?<\/td>/;
const newTdActions = `<td className="p-4 text-center">
                  <button 
                    onClick={() => handleToggleStatus(promo.id, promo.isActive !== false)} 
                    className={\`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors \${promo.isActive !== false ? 'bg-[#4ade80]/20 text-[#4ade80] hover:bg-[#4ade80]/30' : 'bg-error/20 text-error hover:bg-error/30'}\`}
                  >
                    {promo.isActive !== false ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => handleDelete(promo.id)} className="text-on-surface-variant hover:text-red-500 transition-colors p-2 bg-surface-container-low hover:bg-surface-container rounded-theme">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>`;

code = code.replace(oldTdActions, newTdActions);

// Update colspan for "No active promo codes"
code = code.replace(
  /<td colSpan=\{6\} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No active promo codes\.<\/td>/,
  `<td colSpan={7} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No promo codes found.</td>`
);


fs.writeFileSync('src/pages/admin/PromoCodesManagement.tsx', code);
console.log("Success admin patch");
