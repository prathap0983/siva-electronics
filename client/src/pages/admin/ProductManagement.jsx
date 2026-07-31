import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Tv, Check, X, 
  ArrowUpDown, Image as ImageIcon, Sparkles, Loader2, ListPlus
} from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import DragDropUpload from '../../components/DragDropUpload.jsx';

export const ProductManagement = () => {
  const { addToast } = useToast();

  // Lists state
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Dialog / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState([]); // Cloudinary URLs
  const [stockQty, setStockQty] = useState('10'); // For initial setup
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  
  // Specifications Builder State
  const [specifications, setSpecifications] = useState([{ key: '', val: '' }]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('limit', '50'); // Fetch ample for management listing

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load products database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          api.get('/brands'),
          api.get('/categories')
        ]);
        setBrands(brandRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load metadata dropdowns:', err);
      }
    };
    fetchMetadata();
    fetchProducts();
  }, [selectedBrand, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // Specs Builder Handlers
  const handleSpecChange = (index, field, val) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = val;
    setSpecifications(newSpecs);
  };

  const addSpecRow = () => {
    setSpecifications([...specifications, { key: '', val: '' }]);
  };

  const removeSpecRow = (index) => {
    setSpecifications(specifications.filter((_, idx) => idx !== index));
  };

  // Image Upload Callback
  const handleImagesUploaded = (urls) => {
    setImages(prev => [...prev, ...urls]);
  };

  const handleRemoveImage = (url) => {
    setImages(prev => prev.filter(img => img !== url));
  };

  // Open Form Drawer for creating new product
  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setName('');
    setBrandId('');
    setCategoryId('');
    setPrice('');
    setDescription('');
    setIsFeatured(false);
    setIsAvailable(true);
    setImages([]);
    setStockQty('10');
    setLowStockThreshold('5');
    setSpecifications([{ key: 'Screen Size', val: '43 inch' }, { key: 'Resolution', val: '4K Ultra HD' }, { key: 'Smart TV OS', val: 'Android TV' }]);
    setIsFormOpen(true);
  };

  // Open Form Drawer for editing product
  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setBrandId(product.brand_id || '');
    setCategoryId(product.category_id || '');
    setPrice(product.price.toString());
    setDescription(product.description);
    setIsFeatured(product.is_featured);
    setIsAvailable(product.is_available);
    setImages(product.product_images?.map(img => img.image_url) || []);
    setStockQty(product.stock_qty.toString());
    setLowStockThreshold(product.low_stock_threshold.toString());

    // Map JSON Specifications to builder format
    if (product.specifications && Object.keys(product.specifications).length > 0) {
      const mappedSpecs = Object.entries(product.specifications).map(([key, val]) => ({ key, val }));
      setSpecifications(mappedSpecs);
    } else {
      setSpecifications([{ key: '', val: '' }]);
    }
    
    setIsFormOpen(true);
  };

  // Form submission handler (create or update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      addToast('Please fill in Name, Price, and Description', 'warning');
      return;
    }

    setSaving(true);

    // Format Specifications array back into JSON Object
    const specsObj = {};
    specifications.forEach(spec => {
      if (spec.key.trim() && spec.val.trim()) {
        specsObj[spec.key.trim()] = spec.val.trim();
      }
    });

    const payload = {
      name,
      brand_id: brandId || null,
      category_id: categoryId || null,
      price: parseFloat(price),
      description,
      specifications: specsObj,
      is_featured: isFeatured,
      is_available: isAvailable,
      images,
      stock_qty: parseInt(stockQty) || 0,
      low_stock_threshold: parseInt(lowStockThreshold) || 5
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        addToast('Product details updated successfully', 'success');
      } else {
        await api.post('/products', payload);
        addToast('New product added to catalog successfully', 'success');
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to save product details', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Action triggers
  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete.id}`);
      addToast('Product successfully deleted', 'success');
      setIsDeleteOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-400">Inventory Curation</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Catalog</h2>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl text-sm font-semibold shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
        </form>

        <div className="flex gap-4 w-full md:w-auto flex-shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary w-full sm:w-40"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary w-full sm:w-40"
          >
            <option value="">All Brands</option>
            {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table Pane */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="table-row" /><Skeleton variant="table-row" /><Skeleton variant="table-row" />
        </div>
      ) : products.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    {/* Image & Title */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800">
                        {prod.product_images?.[0]?.image_url ? (
                          <img src={prod.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Tv className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{prod.name}</span>
                        <span className="text-[10px] text-slate-450 line-clamp-1 italic">{prod.slug}</span>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-semibold">
                      {prod.brand?.name || '-'}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-semibold">
                      {prod.category?.name || '-'}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{parseFloat(prod.price).toLocaleString('en-IN')}
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                        prod.stock_qty === 0 
                          ? 'bg-red-50 text-red-650 dark:bg-red-950/20' 
                          : (prod.stock_qty <= prod.low_stock_threshold ? 'bg-orange-50 text-orange-655 dark:bg-orange-950/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350')
                      }`}>
                        {prod.stock_qty} qty
                      </span>
                    </td>

                    {/* Availability toggle view */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        prod.is_available && prod.stock_qty > 0
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/20' 
                          : 'bg-red-50 text-red-700 dark:bg-red-950/20'
                      }`}>
                        {prod.is_available && prod.stock_qty > 0 ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            <span>Unavailable</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditForm(prod)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(prod)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
          <Tv className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-bounce" />
          <h3 className="font-bold text-lg mb-1">No products found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            There are no products cataloged yet. Tap the button below to add your first smart TV screen!
          </p>
          <button
            onClick={handleOpenAddForm}
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-hover transition-colors"
          >
            Catalog First Product
          </button>
        </div>
      )}

      {/* Add / Edit Form Drawer overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFormOpen(false)} />
          
          {/* Form Content Side Drawer */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-8 shadow-2xl z-10 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-6">
                
                {/* 1. Base details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-450 uppercase">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siva Smart 4K Ultra HD TV 55 inch"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-450 uppercase">Retail Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 29999"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* 2. Brand & Category select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-450 uppercase">Brand</label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">Unbranded / Custom</option>
                      {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-450 uppercase">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* 3. Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-455 uppercase">Product Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide an overview of the display panels, Smart interface features, inputs/outputs..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                {/* 4. Stock Settings (On Creation) */}
                {!editingProduct && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-450 uppercase">Initial Stock Quantity</label>
                      <input
                        type="number"
                        value={stockQty}
                        onChange={(e) => setStockQty(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-450 uppercase">Low Stock Threshold</label>
                      <input
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4.5 h-4.5 border-slate-300 dark:border-slate-750"
                    />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Featured (Highlight on Home)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4.5 h-4.5 border-slate-300 dark:border-slate-750"
                    />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Available Stock Active</span>
                  </label>
                </div>

                {/* 6. Dynamic Specifications Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Specifications Specification Builder</span>
                    </label>
                    <button
                      type="button"
                      onClick={addSpecRow}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                      <span>Add Specification</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {specifications.map((spec, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="e.g. Panel Type"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                          className="w-1/2 p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="e.g. IPS Panel"
                          value={spec.val}
                          onChange={(e) => handleSpecChange(idx, 'val', e.target.value)}
                          className="w-1/2 p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecRow(idx)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-550 rounded"
                          disabled={specifications.length === 1}
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Image Uploader Component */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Images (Cloudinary upload)</label>
                  <DragDropUpload
                    onUploadComplete={handleImagesUploaded}
                    existingImages={images}
                    onRemoveImage={handleRemoveImage}
                    multiple={true}
                    folder="products"
                  />
                </div>

              </form>
            </div>

            {/* Bottom Actions Drawer Panel footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitForm}
                disabled={saving}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.name}"? All associated image links and inventory logs will be permanently deleted from Siva Electronics database.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

    </div>
  );
};

export default ProductManagement;
