const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/ProductsManagement.tsx', 'utf-8');

const targetStr = `<div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-outline-variant p-4 bg-surface-container/50">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Image URL</label>
                    <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">OR Upload Image(s)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={e => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
                      className="w-full bg-surface-container-low border border-outline-variant p-2 text-on-background focus:border-primary outline-none transition-colors file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-surface-container file:text-on-background hover:file:bg-surface-container-high cursor-pointer" 
                    />
                    {selectedFiles.length > 0 && (
                      <p className="text-xs text-on-surface-variant mt-2">{selectedFiles.length} file(s) selected</p>
                    )}
                  </div>
                </div>`;

const newStr = `<div className="col-span-2 border border-outline-variant p-4 bg-surface-container/50">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-4">Product Images</label>
                  
                  {formData.imageUrls && formData.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-6">
                      {formData.imageUrls.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-24 border border-outline-variant group bg-surface-container-lowest">
                          <img src={url} alt={\`Preview \${idx}\`} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => {
                              const newUrls = [...formData.imageUrls];
                              newUrls.splice(idx, 1);
                              setFormData({...formData, imageUrls: newUrls, imageUrl: newUrls.length > 0 ? newUrls[0] : ''});
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Add Image via URL</label>
                      <div className="flex gap-2">
                        <input 
                          id="addUrlInput" 
                          placeholder="https://..." 
                          className="flex-1 bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('addUrlInput') as HTMLInputElement;
                            if (input && input.value) {
                              const newUrls = [...formData.imageUrls, input.value];
                              setFormData({...formData, imageUrls: newUrls, imageUrl: formData.imageUrl || input.value});
                              input.value = '';
                            }
                          }} 
                          className="bg-surface-container border border-outline-variant px-4 text-xs font-bold uppercase hover:text-primary transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Upload New Image(s)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={e => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
                        className="w-full bg-surface-container-low border border-outline-variant p-2 text-on-background focus:border-primary outline-none transition-colors file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-surface-container file:text-on-background hover:file:bg-surface-container-high cursor-pointer" 
                      />
                      {selectedFiles.length > 0 && (
                        <p className="text-xs text-primary font-bold mt-2">
                          {selectedFiles.length} new file(s) selected (will be added on save)
                        </p>
                      )}
                    </div>
                  </div>
                </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/pages/admin/ProductsManagement.tsx', content);
  console.log('Successfully patched images UI');
} else {
  console.log('Target string not found');
}
