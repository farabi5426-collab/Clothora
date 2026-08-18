import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { printInvoice, downloadInvoiceImage } from '../../lib/printInvoice';
import { FileText, Plus, Minus, Trash2, Search, Image as ImageIcon, Printer, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvoiceGenerator() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [orderId, setOrderId] = useState(`INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [status, setStatus] = useState('pending');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const prods: any[] = [];
        querySnapshot.forEach((doc) => {
          prods.push({ id: doc.id, ...doc.data() });
        });
        setProducts(prods);
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product: any) => {
    setSelectedItems(prev => [
      ...prev, 
      {
        ...product,
        cartItemId: Math.random().toString(36).substring(2, 9),
        quantity: 1,
        selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
        selectedColor: product.colors && product.colors.length > 0 ? product.colors[0].name : '',
        imageUrl: product.imageUrl || (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : ''),
        allImages: [
          ...(product.imageUrl ? [product.imageUrl] : []),
          ...(product.imageUrls || [])
        ].filter((v, i, a) => a.indexOf(v) === i)
      }
    ]);
    toast.success("Added to invoice");
  };

  const removeItem = (cartItemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateItem = (cartItemId: string, field: string, value: any) => {
    setSelectedItems(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, [field]: value } : item
    ));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const totalAmount = subtotal - Number(discount) + Number(deliveryCharge);

  const generateOrderObject = () => {
    return {
      id: orderId,
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
      status: status,
      customerDetails: {
        name: customerName || 'N/A',
        phone: customerPhone || 'N/A',
        address: customerAddress || 'N/A',
      },
      items: selectedItems.map(item => ({
        id: item.id,
        title: item.title,
        price: Number(item.price),
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      })),
      subtotal: subtotal,
      discount: Number(discount),
      deliveryCharge: Number(deliveryCharge),
      totalAmount: totalAmount
    };
  };

  const handleDownloadImage = async () => {
    if (selectedItems.length === 0) return toast.error("Add at least one item");
    try {
      setIsGenerating(true);
      await downloadInvoiceImage(generateOrderObject());
      toast.success("Image downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to download image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (selectedItems.length === 0) return toast.error("Add at least one item");
    printInvoice(generateOrderObject());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Invoice Generator</h1>
        <p className="text-on-surface-variant text-sm">Manually create custom invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN - FORM */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 border-2 border-surface-bright">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-surface-bright pb-2">Invoice Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Order ID</label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors uppercase"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Customer Phone</label>
                <input
                  type="text"
                  placeholder="e.g. 01700000000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Customer Address</label>
                <textarea
                  placeholder="Full Delivery Address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Delivery Charge (৳)</label>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                    className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Discount (৳)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-surface border-2 border-surface-bright p-3 text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT SELECTOR */}
          <div className="bg-surface-container-lowest p-6 border-2 border-surface-bright">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-surface-bright pb-2 flex items-center justify-between">
              Select Products
            </h2>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border-2 border-surface-bright p-3 pl-10 text-sm focus:border-primary outline-none transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {isLoading ? (
                <div className="p-4 text-center text-on-surface-variant text-sm">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant text-sm">No products found</div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border-2 border-surface-bright bg-surface hover:border-primary transition-colors cursor-pointer" onClick={() => addItem(product)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-surface-container-highest overflow-hidden shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        ) : product.imageUrls && product.imageUrls.length > 0 ? (
                          <img src={product.imageUrls[0]} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-2 text-on-surface-variant opacity-50" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[150px] sm:max-w-[200px]">{product.title}</p>
                        <p className="text-xs text-primary font-bold">৳{product.price}</p>
                      </div>
                    </div>
                    <button className="p-2 bg-surface-container-high hover:bg-primary hover:text-on-primary transition-colors rounded-none">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SELECTED ITEMS & TOTALS */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 border-2 border-surface-bright flex flex-col h-full">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-surface-bright pb-2 flex items-center justify-between">
              <span>Invoice Items ({selectedItems.length})</span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 min-h-[300px]">
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant p-8">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm uppercase tracking-widest font-bold">No items added</p>
                  <p className="text-xs mt-2">Select products from the left to add them to the invoice</p>
                </div>
              ) : (
                selectedItems.map((item, index) => (
                  <div key={item.cartItemId} className="p-4 border-2 border-surface-bright bg-surface relative">
                    <button 
                      onClick={() => removeItem(item.cartItemId)}
                      className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex gap-4">
                      <div className="w-16 h-20 bg-surface-container-highest overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-4 text-on-surface-variant opacity-50" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold pr-6">{item.title}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <input 
                            type="text" 
                            placeholder="Size" 
                            value={item.selectedSize}
                            onChange={(e) => updateItem(item.cartItemId, 'selectedSize', e.target.value)}
                            className="bg-surface border border-surface-bright p-1 text-xs outline-none focus:border-primary"
                          />
                          <input 
                            type="text" 
                            placeholder="Color" 
                            value={item.selectedColor}
                            onChange={(e) => updateItem(item.cartItemId, 'selectedColor', e.target.value)}
                            className="bg-surface border border-surface-bright p-1 text-xs outline-none focus:border-primary"
                          />
                        </div>
                        {item.allImages && item.allImages.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {item.allImages.map((img: string, i: number) => (
                                <img 
                                  key={i} 
                                  src={img} 
                                  onClick={() => updateItem(item.cartItemId, 'imageUrl', img)}
                                  className={`w-8 h-8 object-cover cursor-pointer border-2 transition-all ${item.imageUrl === img ? 'border-primary' : 'border-surface-bright hover:border-primary/50'}`}
                                  alt=""
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border-2 border-surface-bright bg-background">
                            <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1 hover:bg-surface-bright transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1 hover:bg-surface-bright transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-on-surface-variant">৳</span>
                            <span className="text-sm font-bold text-primary">{(Number(item.price) * item.quantity).toLocaleString()}</span>
                            <span className="text-[10px] text-on-surface-variant ml-1">(৳{item.price} x {item.quantity})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-surface-bright space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant uppercase tracking-widest font-bold">Subtotal</span>
                <span className="font-bold">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant uppercase tracking-widest font-bold">Discount</span>
                <span className="font-bold text-error">-৳{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant uppercase tracking-widest font-bold">Delivery</span>
                <span className="font-bold">৳{deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg mt-4 pt-4 border-t border-surface-bright">
                <span className="uppercase tracking-widest font-black">Total</span>
                <span className="font-black text-primary">৳{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                onClick={handleDownloadImage}
                disabled={isGenerating || selectedItems.length === 0}
                className="p-4 bg-surface-container-highest text-on-surface border-2 border-surface-bright hover:bg-surface-bright transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4" /> 
                {isGenerating ? 'Generating...' : 'Download Image'}
              </button>
              <button 
                onClick={handleDownloadPdf}
                disabled={selectedItems.length === 0}
                className="p-4 bg-primary text-on-primary border-2 border-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
              >
                <Printer className="w-4 h-4" /> 
                Download PDF
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
