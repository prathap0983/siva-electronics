import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Wrench, Check, X, 
  ArrowUpDown, Image as ImageIcon, Loader2, Cpu
} from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import DragDropUpload from '../../components/DragDropUpload.jsx';

export const SparePartsManagement = () => {
  const { addToast } = useToast();

  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Dialog / Form Drawer States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [compatibleModels, setCompatibleModels] = useState(''); // comma-separated input
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState('');
  const [stockQty, setStockQty] = useState('10');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const fetchParts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedBrand) params.append('brand', selectedBrand);

      const response = await api.get(`/spare-parts?${params.toString()}`);
      setParts(response.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load spare parts database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/brands');
        setBrands(response.data);
      } catch (err) {
        console.error('Failed to load brands:', err);
      }
    };
    fetchBrands();
    fetchParts();
  }, [selectedBrand]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchParts();
  };

  // Image upload callback
  const handleImageUploaded = (urls) => {
    // For spare parts, we only allow a single image, so grab the first URL
    if (urls.length > 0) {
      setImageUrl(urls[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  // Forms opening triggers
  const handleOpenAddForm = () => {
    setEditingPart(null);
    setName('');
    setCompatibleModels('');
    setBrandId('');
    setPrice('');
    setStockQty('15');
    setLowStockThreshold('5');
    setIsAvailable(true);
    setImageUrl('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (part) => {
    setEditingPart(part);
    setName(part.name);
    setCompatibleModels(part.compatible_models?.join(', ') || '');
    setBrandId(part.brand_id || '');
    setPrice(part.price.toString());
    setStockQty(part.stock_qty.toString());
    setLowStockThreshold(part.low_stock_threshold?.toString() || '5');
    setIsAvailable(part.is_available);
    setImageUrl(part.image_url || '');
    setIsFormOpen(true);
  };

  // Submission handler
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      addToast('Name and Price are required fields', 'warning');
      return;
    }

    setSaving(true);

    // Format compatible models text to array
    const modelsArr = compatibleModels
      .split(',')
      .map(m => m.trim())
      .filter(m => m !== '');

    const payload = {
      name,
      compatible_models: modelsArr,
      brand_id: brandId || null,
      price: parseFloat(price),
      stock_qty: parseInt(stockQty) || 0,
      low_stock_threshold: parseInt(lowStockThreshold) || 5,
      is_available: isAvailable,
      image_url: imageUrl || null
    };

    try {
      if (editingPart) {
        await api.put(`/spare-parts/${editingPart.id}`, payload);
        addToast('Spare part updated successfully', 'success');
      } else {
        await api.post('/spare-parts', payload);
        addToast('New spare part cataloged successfully', 'success');
      }
      setIsFormOpen(false);
      fetchParts();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to save spare part details', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Action
  const handleOpenDelete = (part) => {
    setPartToDelete(part);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!partToDelete) return;
    try {
      await api.delete(`/spare-parts/${partToDelete.id}`);
      addToast('Spare part successfully deleted', 'success');
      setIsDeleteOpen(false);
      fetchParts();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete spare part', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-400">Inventory Curation</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Spare Parts Stock</h2>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl text-sm font-semibold shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Spare Part</span>
        </button>
      </div>

      {/* Search & Brand Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search spare parts or compatible models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
        </form>

        <div className="w-full md:w-auto">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary w-full sm:w-48"
          >
            <option value="">All Brands</option>
            {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          </select>
        </div>
      </div>

      {/* Spare Parts Table List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="table-row" /><Skeleton variant="table-row" /><Skeleton variant="table-row" />
        </div>
      ) : parts.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Part Name</th>
                  <th className="px-6 py-4">Compatibility</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-855">
                {parts.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800">
                        {part.image_url ? (
                          <img src={part.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Wrench className="w-5 h-5" />
                        )}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{part.name}</span>
                    </td>

                    {/* Compatibility Models tags */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {part.compatible_models && part.compatible_models.length > 0 ? (
                          part.compatible_models.map((model, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-medium px-2 py-0.5 rounded">
                              {model}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Universal compatibility</span>
                        )}
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-350 font-semibold">
                      {part.brand?.name || '-'}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{parseFloat(part.price).toLocaleString('en-IN')}
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                        part.stock_qty === 0 
                          ? 'bg-red-50 text-red-600 dark:bg-red-950/20' 
                          : (part.stock_qty <= part.low_stock_threshold ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350')
                      }`}>
                        {part.stock_qty} qty
                      </span>
                    </td>

                    {/* Status availability badge */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        part.is_available && part.stock_qty > 0
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/20' 
                          : 'bg-red-50 text-red-750 dark:bg-red-950/20'
                      }`}>
                        {part.is_available && part.stock_qty > 0 ? (
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
                          onClick={() => handleOpenEditForm(part)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary rounded-lg transition-colors"
                          title="Edit Part"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(part)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete Part"
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
          <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-1">No parts found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            There are no spare parts currently logged in our databases.
          </p>
          <button
            onClick={handleOpenAddForm}
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-hover transition-colors"
          >
            Catalog First Spare Part
          </button>
        </div>
      )}

      {/* Form Drawer sidebar */}
      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="fixed inset-0 bg-transparent" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-8 shadow-2xl z-10 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingPart ? 'Edit Spare Part Details' : 'Add New Spare Part'}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-6">
                
                {/* Name & Brand */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase">Part Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samsung Backlight LED strip 32 inch"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-450 uppercase">Compatible Brand</label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">Universal / Generic</option>
                      {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-450 uppercase">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1200"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Compatibility Models List */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase">Compatible Models (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 32LN5100, 32LN5200, 32LN5700"
                    value={compatibleModels}
                    onChange={(e) => setCompatibleModels(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Allows matching search queries by target television chassis.</span>
                </div>

                {/* Initial stock settings (On creation only) */}
                {!editingPart && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-450 uppercase">Initial Quantity</label>
                      <input
                        type="number"
                        value={stockQty}
                        onChange={(e) => setStockQty(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-450 uppercase">Low Stock Alert at</label>
                      <input
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Status check */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4.5 h-4.5 border-slate-350 dark:border-slate-750"
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Part is Available for Orders</span>
                </label>

                {/* Single Image Drag and Drop */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-455 uppercase tracking-wider block">Part Image</label>
                  <DragDropUpload
                    onUploadComplete={handleImageUploaded}
                    existingImages={imageUrl ? [imageUrl] : []}
                    onRemoveImage={handleRemoveImage}
                    multiple={false}
                    folder="spare_parts"
                  />
                </div>

              </form>
            </div>

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
                  <span>Save Component</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Spare Part?"
        message={`Are you sure you want to delete "${partToDelete?.name}"? All associated inventory logs will be permanently deleted from databases.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

    </div>
  );
};

export default SparePartsManagement;
