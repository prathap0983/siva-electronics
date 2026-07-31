import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Tag, Cpu, Loader2 } from 'lucide-react';
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

  // Dialog states
  const [isBrandFormOpen, setIsBrandFormOpen] = useState(false);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'brand'|'cat', data: obj }

  // Form Fields
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [catName, setCatName] = useState('');
  
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [savingBrand, setSavingBrand] = useState(false);
  const [savingCat, setSavingCat] = useState(false);

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
      addToast('Failed to load catalogs databases', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Brand Form
  const handleLogoUploaded = (urls) => {
    if (urls.length > 0) {
      setBrandLogo(urls[0]);
    }
  };

  const handleOpenAddBrand = () => {
    setBrandName('');
    setBrandLogo('');
    setEditingBrand(null);
    setIsBrandFormOpen(true);
  };

  const handleOpenEditBrand = (brand) => {
    setBrandName(brand.name);
    setBrandLogo(brand.logo_url || '');
    setEditingBrand(brand);
    setIsBrandFormOpen(true);
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandName) {
      addToast('Brand name is required', 'warning');
      return;
    }

    try {
      setSavingBrand(true);
      if (editingBrand) {
        await api.put(`/brands/${editingBrand.id}`, { name: brandName, logo_url: brandLogo });
        addToast('Brand details updated successfully', 'success');
      } else {
        await api.post('/brands', { name: brandName, logo_url: brandLogo });
        addToast('Brand successfully cataloged', 'success');
      }
      setIsBrandFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      addToast('Failed to save brand', 'error');
    } finally {
      setSavingBrand(false);
    }
  };

  // Handlers for Category Form
  const handleOpenAddCat = () => {
    setCatName('');
    setEditingCat(null);
    setIsCatFormOpen(true);
  };

  const handleOpenEditCat = (cat) => {
    setCatName(cat.name);
    setEditingCat(cat);
    setIsCatFormOpen(true);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    if (!catName) {
      addToast('Category name is required', 'warning');
      return;
    }

    try {
      setSavingCat(true);
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
      {isBrandFormOpen ? (
        <div className="max-w-2xl mx-auto space-y-6 animate-enter">
          <button
            onClick={() => setIsBrandFormOpen(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            ← Back to Catalog
          </button>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="h-10 w-10 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-xl flex-shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingBrand ? 'Edit Manufacturer Brand' : 'Add Manufacturer Brand'}
                </h3>
                <p className="text-xs text-slate-400">Manage device manufacturing partner names and assets.</p>
              </div>
            </div>

            <form onSubmit={handleBrandSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-455 uppercase">Brand Name *</label>
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
                <label className="text-xs font-bold text-slate-455 uppercase block">Brand Logo</label>
                <DragDropUpload
                  onUploadComplete={handleLogoUploaded}
                  existingImages={brandLogo ? [brandLogo] : []}
                  onRemoveImage={() => setBrandLogo('')}
                  multiple={false}
                  folder="brands"
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBrandFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow flex items-center gap-1.5 disabled:opacity-50"
                  disabled={savingBrand}
                >
                  {savingBrand ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Brand</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : isCatFormOpen ? (
        <div className="max-w-2xl mx-auto space-y-6 animate-enter">
          <button
            onClick={() => setIsCatFormOpen(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            ← Back to Catalog
          </button>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="h-10 w-10 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-xl flex-shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingCat ? 'Edit Store Category' : 'Add Store Category'}
                </h3>
                <p className="text-xs text-slate-400">Classify products and spare parts configurations.</p>
              </div>
            </div>

            <form onSubmit={handleCatSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-455 uppercase">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accessories, OLED Screens"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCatFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow flex items-center gap-1.5 disabled:opacity-50"
                  disabled={savingCat}
                >
                  {savingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Category</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Manufacturer Brands</h3>
                  <p className="text-xs text-slate-400">Configure brands mapped to television components.</p>
                </div>
                <button
                  onClick={handleOpenAddBrand}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Brand</span>
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <Skeleton variant="list-item" /><Skeleton variant="list-item" />
                </div>
              ) : brands.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[360px] overflow-y-auto pr-1">
                  {brands.map((brand) => (
                    <div key={brand.id} className="py-3 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
                          {brand.logo_url ? (
                            <img src={brand.logo_url} alt="" className="h-full w-full object-contain" />
                          ) : (
                            <Cpu className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className="font-semibold text-sm text-slate-850 dark:text-slate-200">{brand.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditBrand(brand)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded text-slate-500 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete('brand', brand)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-slate-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Store Categories</h3>
                  <p className="text-xs text-slate-400">Classify repair catalog segments and devices.</p>
                </div>
                <button
                  onClick={handleOpenAddCat}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <Skeleton variant="list-item" /><Skeleton variant="list-item" />
                </div>
              ) : categories.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[360px] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div key={cat.id} className="py-3 flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-sm text-slate-850 dark:text-slate-200">{cat.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditCat(cat)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-855 rounded text-slate-500 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete('cat', cat)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-slate-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        </>
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
