import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import DragDropUpload from '../../components/DragDropUpload.jsx';

export const GalleryManagement = () => {
  const { addToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form / Dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Shop');
  const [imageUrl, setImageUrl] = useState('');

  const categories = ['Shop', 'Products', 'Repair', 'Installation', 'Spare Parts'];

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gallery');
      setItems(response.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageUploaded = (urls) => {
    if (urls.length > 0) {
      setImageUrl(urls[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const handleOpenAddForm = () => {
    setTitle('');
    setCategory('Shop');
    setImageUrl('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageUrl || !category) {
      addToast('Title, Category, and Image are required', 'warning');
      return;
    }

    try {
      setSaving(true);
      await api.post('/gallery', { title, category, image_url: imageUrl });
      addToast('Gallery photo posted successfully', 'success');
      setIsFormOpen(false);
      fetchGallery();
    } catch (err) {
      console.error(err);
      addToast('Failed to save gallery photo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/gallery/${itemToDelete.id}`);
      addToast('Gallery item deleted successfully', 'success');
      setIsDeleteOpen(false);
      fetchGallery();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete gallery item', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left animate-enter-up">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-205 dark:border-slate-800 pb-4">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-400">Media Curation</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Shop Gallery</h2>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl text-sm font-semibold shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 rounded-2xl animate-pulse" />
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 rounded-2xl animate-pulse" />
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 rounded-2xl animate-pulse" />
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 rounded-2xl animate-pulse" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <div 
              key={item.id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-850"
            >
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                <span className="self-end bg-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
                
                <div className="flex items-end justify-between gap-2">
                  <div className="text-left space-y-0.5 max-w-[70%]">
                    <h4 className="font-bold text-xs truncate">{item.title}</h4>
                    <span className="text-[9px] text-slate-350 block">Posted {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <button
                    onClick={() => handleOpenDelete(item)}
                    className="p-1.5 bg-red-650 hover:bg-red-750 rounded-lg text-white transition-colors flex-shrink-0"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 max-w-lg mx-auto">
          <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-pulse" />
          <h3 className="font-bold text-lg mb-1">Gallery is empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Upload workshop service checks or wall mount install screenshots to display them on the main customer website.
          </p>
          <button
            onClick={handleOpenAddForm}
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-hover transition-colors"
          >
            Upload First Photo
          </button>
        </div>
      )}

      {/* Upload Photos form Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-8 shadow-2xl z-10 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Gallery Photo</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backlight Assembly Repair Sony 43\"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase">Gallery Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-450 uppercase block">Media File (Cloudinary stream)</label>
                  <DragDropUpload
                    onUploadComplete={handleImageUploaded}
                    existingImages={imageUrl ? [imageUrl] : []}
                    onRemoveImage={handleRemoveImage}
                    multiple={false}
                    folder="gallery"
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
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Publish Image</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Gallery Photo?"
        message={`Are you sure you want to delete "${itemToDelete?.title}"? The image will be deleted from Siva Electronics database and Cloudinary storage.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

    </div>
  );
};

export default GalleryManagement;
