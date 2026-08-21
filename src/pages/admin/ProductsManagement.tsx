import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  costPrice: number;
  stock: number;
  category: string;
  imageUrl: string;
  imageUrls?: string[];
  sizes?: string[];
  videoUrl?: string;
  showInBanner?: boolean;
  noColorVariations?: boolean;
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [] as string[], sizes: [] as string[], videoUrl: '', showInBanner: false,
    noColorVariations: false
  });

  useEffect(() => {
    const catQ = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubCat = onSnapshot(catQ, (snapshot) => {
      const cats: {id: string, name: string}[] = [];
      snapshot.forEach(doc => cats.push({id: doc.id, ...doc.data()} as any));
      setCategories(cats);
    });
    return () => unsubCat();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  // Temporary auto-fix for the 3 drop shoulder products
  useEffect(() => {
    const fixProducts = async () => {
      if (localStorage.getItem('fixed_categories_v4')) return;
      if (products.length === 0 || categories.length === 0) return;
      
      const targetCategory = "Drop Shoulder T-Shirt"; 
      
      // Ensure category exists
      if (!categories.find(c => c.name.toLowerCase() === targetCategory.toLowerCase())) {
         try {
           await addDoc(collection(db, 'categories'), { name: targetCategory, createdAt: serverTimestamp() });
         } catch(e) {}
      }

      const targetTitles = [
        "BARCELONA AND REAL MADRID STREETWEAR DROP IS HERE! ⚽🔥",
        "REAL MADRID \"ACID WASH\" DROP SHOULDER T-SHIRT! 👑⚽",
        "PREMIUM ACID WASH DROP SHOULDER TSHIRT"
      ];
      
      const prodsToFix = products.filter(p => p.title && (targetTitles.includes(p.title) || p.title.includes("BARCELONA") || p.title.includes("PREMIUM ACID WASH") || p.title.includes("ACID WASH\" DROP")));
      
      if (prodsToFix.length > 0) {
        let hasChanges = false;
        for (const p of prodsToFix) {
           if (p.category !== targetCategory) {
             try {
               await updateDoc(doc(db, 'products', p.id), { category: targetCategory });
               hasChanges = true;
             } catch(e) {}
           }
        }
        if (hasChanges) {
          toast.success("Products automatically moved to Drop Shoulder T-Shirt!");
        }
        localStorage.setItem('fixed_categories_v4', 'true');
      }
    };
    fixProducts();
  }, [products, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl && selectedFiles.length === 0 && formData.imageUrls.length === 0) {
      alert('Please provide an image URL or upload at least one image.');
      return;
    }

    // Capture values before closing the modal
    const currentFormData = { ...formData };
    const currentSelectedFiles = [...selectedFiles];
    const currentSelectedVideo = selectedVideo;
    const currentEditingId = editingId;

    // Instantly close the form and reset so the user isn't blocked
    setIsModalOpen(false);
    resetForm();

    // Run the actual save/upload process in the background
    (async () => {
      let finalImageUrls = [...currentFormData.imageUrls];
      let finalImageUrl = currentFormData.imageUrl;

      try {
        // 1. Upload to Cloudinary if files are selected
        if (currentSelectedFiles.length > 0) {
          const uploadPromises = currentSelectedFiles.map(async (file) => {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('upload_preset', 'kwxslhnw');
            
            const res = await fetch('https://api.cloudinary.com/v1_1/dzsiqw51v/image/upload', {
              method: 'POST',
              body: uploadData
            });
            const data = await res.json();
            
            if (!res.ok) {
              throw new Error(data.error?.message || 'Failed to upload image');
            }
            return data.secure_url;
          });

          const uploadedUrls = await Promise.all(uploadPromises);
          finalImageUrls = [...finalImageUrls, ...uploadedUrls];
          
          if (!finalImageUrl && uploadedUrls.length > 0) {
             finalImageUrl = uploadedUrls[0];
          }
        }

        if (finalImageUrls.length === 0 && finalImageUrl) {
           finalImageUrls = [finalImageUrl];
        } else if (finalImageUrls.length > 0 && !finalImageUrl) {
           finalImageUrl = finalImageUrls[0];
        }

        let finalVideoUrl = currentFormData.videoUrl;
        if (currentSelectedVideo) {
          const uploadData = new FormData();
          uploadData.append('file', currentSelectedVideo);
          uploadData.append('upload_preset', 'kwxslhnw');
          const res = await fetch('https://api.cloudinary.com/v1_1/dzsiqw51v/video/upload', {
            method: 'POST',
            body: uploadData
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || 'Failed to upload video');
          finalVideoUrl = data.secure_url;
        }

        // 2. Save to Firestore
        const dataToSave: any = {
          ...currentFormData,
          title: currentFormData.title || '',
          description: currentFormData.description || '',
          category: (currentFormData.category || '').trim(),
          price: Number(currentFormData.price) || 0,
          costPrice: Number(currentFormData.costPrice) || 0,
          stock: Number(currentFormData.stock) || 0,
          imageUrl: finalImageUrl || '',
          imageUrls: finalImageUrls || [],
          videoUrl: finalVideoUrl || '',
          showInBanner: Boolean(currentFormData.showInBanner),
          noColorVariations: Boolean(currentFormData.noColorVariations),
          sizes: currentFormData.sizes || []
        };
        
        // Remove undefined values to prevent Firestore crash
        Object.keys(dataToSave).forEach(key => dataToSave[key] === undefined && delete dataToSave[key]);

        if (currentEditingId) {
          await updateDoc(doc(db, 'products', currentEditingId), dataToSave);
        } else {
          dataToSave.createdAt = new Date();
          await addDoc(collection(db, 'products'), dataToSave);
        }
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product in the background.');
      }
    })();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const openEdit = (product: Product) => {
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price?.toString() || '0',
      costPrice: (product.costPrice || 0).toString(),
      stock: product.stock?.toString() || '0',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      imageUrls: product.imageUrls || (product.imageUrl ? [product.imageUrl] : []),
      videoUrl: product.videoUrl || '',
      showInBanner: product.showInBanner || false,
      noColorVariations: product.noColorVariations || false,
      sizes: product.sizes || []
    });
    setEditingId(product.id);
    setSelectedFiles([]);
    setSelectedVideo(null);
    setIsModalOpen(true);
  };


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

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [], sizes: [], videoUrl: '', showInBanner: false, noColorVariations: false });
    setEditingId(null);
    setSelectedVideo(null);
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Products</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Manage your inventory</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Product</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Stock</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors">
                <td className="p-4 flex items-center gap-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-12 h-12 object-cover border border-outline-variant" />
                  ) : (
                    <div className="w-12 h-12 bg-surface-container-low border border-outline-variant"></div>
                  )}
                  <span className="font-bold uppercase text-sm">{product.title}</span>
                </td>
                <td className="p-4 text-primary font-bold">৳ {product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 uppercase text-xs tracking-widest text-on-surface-variant">{product.category}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => openEdit(product)} className="text-on-surface-variant hover:text-on-background transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-on-surface-variant hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant uppercase tracking-widest text-xs">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-2xl p-4 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-background">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Price (৳)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Cost Price (৳)</label>
                  <input required type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
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
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => {
                       const isSelected = (formData.sizes || []).includes(size);
                       return (
                         <button
                           key={size}
                           type="button"
                           onClick={() => {
                             if (isSelected) {
                               setFormData({...formData, sizes: (formData.sizes || []).filter(s => s !== size)});
                             } else {
                               setFormData({...formData, sizes: [...(formData.sizes || []), size]});
                             }
                           }}
                           className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border transition-colors ${isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary'}`}
                         >
                           {size}
                         </button>
                       )
                    })}
                  </div>
                </div>

                <div className="col-span-2 border border-outline-variant p-4 bg-surface-container/50">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-4">Product Images</label>
                  
                  {formData.imageUrls && formData.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-6">
                      {formData.imageUrls.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-24 border border-outline-variant group bg-surface-container-lowest">
                          <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
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
                      <div className="flex flex-wrap gap-2">
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
                </div>

                {/* Video Upload Section */}
                <div className="col-span-2 border border-outline-variant p-4 bg-surface-container/50 mt-4">
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-4">Product Video</label>
                  
                  {formData.videoUrl && (
                    <div className="mb-4 relative w-32 h-20 border border-outline-variant group">
                       <video src={formData.videoUrl} className="w-full h-full object-cover" muted playsInline />
                       <button 
                          type="button" 
                          onClick={() => setFormData({...formData, videoUrl: ''})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Remove video"
                        >
                          <X className="w-3 h-3" />
                        </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Video URL (Optional)</label>
                      <input 
                        value={formData.videoUrl} 
                        onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                        placeholder="https://..." 
                        className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-background focus:border-primary outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">OR Upload Video File</label>
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={e => setSelectedVideo(e.target.files ? e.target.files[0] : null)}
                        className="w-full bg-surface-container-low border border-outline-variant p-2 text-on-background focus:border-primary outline-none transition-colors file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-surface-container file:text-on-background hover:file:bg-surface-container-high cursor-pointer" 
                      />
                      {selectedVideo && (
                        <p className="text-xs text-primary font-bold mt-2">
                          1 video selected (will be added on save)
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="showInBanner"
                        checked={formData.showInBanner}
                        onChange={e => setFormData({...formData, showInBanner: e.target.checked})}
                        className="w-4 h-4 accent-primary"
                     />
                     <label htmlFor="showInBanner" className="text-xs uppercase tracking-widest text-on-background font-bold cursor-pointer">
                       Show this video in Homepage Banner
                     </label>
                  </div>
                </div>
              </div>
              
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
<button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary p-4 text-xs font-bold uppercase tracking-widest mt-6 transition-colors flex items-center justify-center gap-2">
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant w-full max-w-md p-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
              <button type="button" onClick={handleAddCategory} className="bg-primary text-on-primary px-4 font-bold uppercase tracking-widest text-xs hover:bg-primary/90">Add</button>
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
}