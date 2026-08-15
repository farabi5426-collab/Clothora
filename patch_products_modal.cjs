const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf-8');

const modalUI = `      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">Manage Categories</h2>
              <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="text-on-surface-variant hover:text-on-background">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name" 
                className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-sm focus:border-primary outline-none uppercase font-bold tracking-wider" 
              />
              <button type="button" onClick={handleAddCategory} className="bg-primary text-on-background px-4 font-bold uppercase tracking-widest text-xs hover:bg-primary/90">Add</button>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center bg-surface-container-low border border-outline-variant p-3">
                  <span className="uppercase font-bold text-sm">{cat.name}</span>
                  <button type="button" onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-400">
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
      )}
    </div>
  );
}`;

code = code.replace(/    <\/div>\s*  \);\s*}\s*$/, modalUI);

fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', code);
