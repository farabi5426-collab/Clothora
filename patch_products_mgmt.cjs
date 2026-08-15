const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf-8');

// Add categories state
code = code.replace(
  'const [products, setProducts] = useState<Product[]>([]);',
  `const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');`
);

// Add fetch categories effect
code = code.replace(
  `  useEffect(() => {
    const q = query(collection(db, 'products')`,
  `  useEffect(() => {
    const catQ = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubCat = onSnapshot(catQ, (snapshot) => {
      const cats: {id: string, name: string}[] = [];
      snapshot.forEach(doc => cats.push({id: doc.id, ...doc.data()} as any));
      setCategories(cats);
    });
    return () => unsubCat();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'products')`
);

// Category Add & Delete Handlers
const handlers = `
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await addDoc(collection(db, 'categories'), { name: newCategoryName.trim(), createdAt: serverTimestamp() });
      setNewCategoryName('');
      toast.success('Category added');
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {`;

code = code.replace('  const resetForm = () => {', handlers);

// Replace category input with select and manage button
const inputCategory = `<input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. T-Shirts" className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" />`;

const newCategoryInput = `<div className="flex gap-2">
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors appearance-none">
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="bg-surface-container-high border border-outline-variant px-4 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest shrink-0">
                      Manage
                    </button>
                  </div>`;

code = code.replace(inputCategory, newCategoryInput);

// Category Modal UI
const modalRegex = /(<div className="fixed inset-0 bg-black\/80[^]+?<\/div>\s*<\/div>\s*)}/;
const match = code.match(modalRegex);
if (match) {
  const categoryModalUI = `
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">Manage Categories</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-on-surface-variant hover:text-on-background">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name" 
                className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-sm focus:border-primary outline-none uppercase font-bold tracking-wider" 
              />
              <button type="submit" className="bg-primary text-on-background px-4 font-bold uppercase tracking-widest text-xs hover:bg-primary/90">Add</button>
            </form>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center bg-surface-container-low border border-outline-variant p-3">
                  <span className="uppercase font-bold text-sm">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-center text-on-surface-variant text-sm uppercase tracking-widest py-4">No categories found</p>
              )}
            </div>
          </div>
        </div>
      )}`;
  code = code.replace(match[0], match[0] + categoryModalUI);
}

fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', code);
