import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag, Layers, X, Check, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import DragDropUpload from '../../components/DragDropUpload.jsx';

export const BrandManagement = () => {
  const { addToast } = useToast();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states (Brands)
  const [isBrandFormOpen, setIsBrandFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [savingBrand, setSavingBrand] = useState(false);

  // Form states (Categories)
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catName, setCatName] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  // Delete Dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'brand'|'category', data: obj }

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brandRes, catRes] = await Promise.all([
        api.get('/brands'),
        api.get('/categories')
      ]);
      setBrands(brandRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load catalog configurations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Brands CRUD
  const handleOpenBrandAdd = () => {
    setEditingBrand(null);
    setBrandName('');
    setBrandLogo('');
    setIsBrandFormOpen(true);
  };

  const handleOpenBrandEdit = (brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setBrandLogo(brand.logo_url || '');
    setIsBrandFormOpen(true);
  };

  const handleLogoUploaded = (urls) => {
    if (urls.length > 0) {
      setBrandLogo(urls[0]);
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandName) {
      addToast('Brand name is required', 'warning');
      return;
    }

    setSavingBrand(true);
    try {
      if (editingBrand) {
        await api.put(`/brands/${editingBrand.id}`, { name: brandName, logo_url: brandLogo || null });
        addToast('Brand details updated successfully', 'success');
      } else {
        await api.post('/brands', { name: brandName, logo_url: brandLogo || null });
        addToast('Brand created successfully', 'success');
      }
      setIsBrandFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to save brand', 'error');
    } finally {
      setSavingBrand(false);
    }
  };

  // Categories CRUD
  const handleOpenCatAdd = () => {
    setEditingCat(null);
    setCatName('');
    setIsCatFormOpen(true);
  };

  const handleOpenCatEdit = (cat) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setIsCatFormOpen(true);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    if (!catName) {
      addToast('Category name is required', 'warning');
      return;
    }

    setSavingCat(true);
    try {
      if (editingCat) {
        await api.put(`/categories/${editingCat.id}`, { name: catName });
        addToast('Category details updated successfully', 'success');
      } else {
        await api.post('/categories', { name: catName });
        addToast('Category created successfully', 'success');
      }
      setIsCatFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to save category', 'error');
    } finally {
      setSavingCat(false);
    }
  };

  // Deletions
  const handleOpenDelete = (type, data) => {
    setDeleteTarget({ type, data });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, data } = deleteTarget;
    
    try {
      if (type === 'brand') {
        await api.delete(`/brands/${data.id}`);
        addToast('Brand successfully removed', 'success');
      } else {
        await api.delete(`/categories/${data.id}`);
        addToast('Category successfully removed', 'success');
      }
      setIsDeleteOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete item. Ensure no catalog products are linked to it.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left animate-enter-up">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-400 font-medium">Metadata Curation</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Brands & Categories</h2>
        </div>
      </div>

      {/* Main Two Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Brand Management */}
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-805 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Manufacturer Brands</h3>
            </div>
            <button
              onClick={handleOpenBrandAdd}
              className="text-xs font-bold text-primary dark:text-primary-light hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Brand</span>
            </button>
          </div>

          {loading ? (
            <Skeleton variant="text" />
          ) : brands.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {brands.map(brand => (
                <div key={brand.id} className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl flex items-center justify-between border border-slate-150 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded overflow-hidden flex items-center justify-center text-slate-400">
                      {brand.logo_url ? (
                        <img src={brand.logo_url} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Tag className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{brand.name}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenBrandEdit(brand)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete('brand', brand)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-550 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No brands cataloged.</p>
          )}
        </div>

        {/* Right Column: Category Management */}
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-805 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Store Categories</h3>
            </div>
            <button
              onClick={handleOpenCatAdd}
              className="text-xs font-bold text-primary dark:text-primary-light hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          {loading ? (
            <Skeleton variant="text" />
          ) : categories.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {categories.map(cat => (
                <div key={cat.id} className="p-3 bg-slate-50 dark:bg-slate-855/50 rounded-xl flex items-center justify-between border border-slate-150 dark:border-slate-800">
                  <span className="font-bold text-sm text-slate-850 dark:text-slate-200">{cat.name}</span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenCatEdit(cat)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete('category', cat)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-550 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No categories cataloged.</p>
          )}
        </div>

      </div>

      {/* Brand Dialog Form Modal (Centered) */}
      {isBrandFormOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBrandFormOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingBrand ? 'Edit Manufacturer Brand' : 'Add Manufacturer Brand'}
                </h3>
                <button onClick={() => setIsBrandFormOpen(false)} className="text-slate-550">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleBrandSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony, Samsung, LG"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-450 uppercase block">Brand Logo</label>
                  <DragDropUpload
                    onUploadComplete={handleLogoUploaded}
                    existingImages={brandLogo ? [brandLogo] : []}
                    onRemoveImage={() => setBrandLogo('')}
                    multiple={false}
                    folder="brands"
                  />
                </div>
              </form>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBrandFormOpen(false)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBrandSubmit}
                disabled={savingBrand}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingBrand ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Brand</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Dialog Form Modal (Centered) */}
      {isCatFormOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCatFormOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingCat ? 'Edit Store Category' : 'Add Store Category'}
                </h3>
                <button onClick={() => setIsCatFormOpen(false)} className="text-slate-550">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCatSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accessories, OLED Screens"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </form>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCatFormOpen(false)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-750 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCatSubmit}
                disabled={savingCat}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Category</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title={`Delete ${deleteTarget?.type === 'brand' ? 'Brand' : 'Category'}?`}
        message={`Are you sure you want to delete "${deleteTarget?.data?.name}"? You cannot delete configurations that are currently mapped to products or spare parts in the catalog.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

    </div>
  );
};

export default BrandManagement;
