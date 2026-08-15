import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

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
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [] as string[]
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl && selectedFiles.length === 0 && formData.imageUrls.length === 0) {
      alert('Please provide an image URL or upload at least one image.');
      return;
    }

    // Capture values before closing the modal
    const currentFormData = { ...formData };
    const currentSelectedFiles = [...selectedFiles];
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

        // 2. Save to Firestore
        const dataToSave: any = {
          ...currentFormData,
          price: Number(currentFormData.price),
          costPrice: Number(currentFormData.costPrice),
          stock: Number(currentFormData.stock),
          imageUrl: finalImageUrl,
          imageUrls: finalImageUrls
        };

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
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      costPrice: (product.costPrice || 0).toString(),
      stock: product.stock.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      imageUrls: product.imageUrls || (product.imageUrl ? [product.imageUrl] : [])
    });
    setEditingId(product.id);
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', costPrice: '', stock: '', category: '', imageUrl: '', imageUrls: [] });
    setEditingId(null);
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Products</h1>
          <p className="text-xs text-[#ffffff60] uppercase tracking-widest">Manage your inventory</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#ff4e00] hover:bg-[#e64600] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-[#111] border border-[#ffffff15] overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#ffffff15]">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Product</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Price</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Stock</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60]">Category</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#ffffff60] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#ffffff0a] hover:bg-[#ffffff05] transition-colors">
                <td className="p-4 flex items-center gap-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-12 h-12 object-cover border border-[#ffffff15]" />
                  ) : (
                    <div className="w-12 h-12 bg-[#1a1a1a] border border-[#ffffff15]"></div>
                  )}
                  <span className="font-bold uppercase text-sm">{product.title}</span>
                </td>
                <td className="p-4 text-[#ff4e00] font-bold">৳ {product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 uppercase text-xs tracking-widest text-[#ffffff80]">{product.category}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => openEdit(product)} className="text-[#ffffff60] hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-[#ffffff60] hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#ffffff60] uppercase tracking-widest text-xs">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#ffffff15] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#ffffff60] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Price (৳)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Cost Price (৳)</label>
                  <input required type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Category</label>
                  <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. T-Shirts" className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none transition-colors" />
                </div>
                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#ffffff15] p-4 bg-[#ffffff05]">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">Image URL</label>
                    <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-3 text-white focus:border-[#ff4e00] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#ffffff60] mb-2">OR Upload Image(s)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={e => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
                      className="w-full bg-[#1a1a1a] border border-[#ffffff15] p-2 text-white focus:border-[#ff4e00] outline-none transition-colors file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-[#333] file:text-white hover:file:bg-[#444] cursor-pointer" 
                    />
                    {selectedFiles.length > 0 && (
                      <p className="text-xs text-[#ffffff80] mt-2">{selectedFiles.length} file(s) selected</p>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#ff4e00] hover:bg-[#e64600] text-white p-4 text-xs font-bold uppercase tracking-widest mt-6 transition-colors flex items-center justify-center gap-2">
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
