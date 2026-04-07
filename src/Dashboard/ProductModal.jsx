import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Save } from 'lucide-react';

export const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state if editing an existing product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        price: product.price || '',
        description: product.description || '',
      });
      setImagePreview(product.image_url || null);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({ name: '', brand: '', category: '', subcategory: '', price: '', description: '' });
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Using FormData is required for file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('category', formData.category);
    data.append('subcategory', formData.subcategory);
    data.append('price', formData.price);
    data.append('description', formData.description);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    onSave(data);
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm fi">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ border: "1px solid #e2e8f0" }}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-base">{product ? 'Edit Product' : 'Add New Product'}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to update your inventory</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 grid grid-cols-12 gap-6 sb">
          
          {/* Left Column: Image Upload Area */}
          <div className="col-span-5 space-y-3">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Product Photo</label>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-colors cursor-pointer
                ${isDragging ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}
                ${imagePreview ? 'border-none' : ''}`}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-full group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-white rounded-lg text-slate-700 hover:text-indigo-600 transition-colors">
                      <Upload size={16} />
                    </button>
                    <button type="button" onClick={handleRemoveImage} className="p-2 bg-white rounded-lg text-slate-700 hover:text-rose-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Drop your image here</p>
                  <p className="text-xs text-slate-500 mt-1">or click to browse files</p>
                  <p className="text-[10px] text-slate-400 mt-3">PNG, JPG or WEBP up to 5MB</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* Right Column: Form Fields */}
          <div className="col-span-7 space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow" placeholder="e.g. Mechanical Keyboard" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow" placeholder="e.g. Logitech" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Price (PHP)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow" placeholder="0.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow" placeholder="e.g. Electronics" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Subcategory</label>
                <input type="text" name="subcategory" value={formData.subcategory} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow" placeholder="e.g. Accessories" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow resize-none" placeholder="Add a short product description..."></textarea>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="col-span-12 border-t border-slate-100 pt-4 mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-indigo-100">
              <Save size={16} />
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};