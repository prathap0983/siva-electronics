import React, { useCallback, useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export const DragDropUpload = ({ 
  onUploadComplete, 
  existingImages = [], 
  onRemoveImage,
  multiple = true,
  folder = 'products'
}) => {
  const { addToast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(async (filesList) => {
    const validFiles = Array.from(filesList).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      addToast('Please upload image files only (PNG, JPG, WebP)', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('folder', folder);
    validFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const uploadedUrls = response.data.urls;
      onUploadComplete(uploadedUrls);
      addToast(`Uploaded ${uploadedUrls.length} image(s) successfully`, 'success');
    } catch (error) {
      console.error('File upload failed:', error);
      const errMsg = error.response?.data?.error || 'Failed to upload images. Please check server connection.';
      addToast(errMsg, 'error');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, folder, addToast]);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-primary bg-primary/5 dark:bg-primary-light/5' 
            : 'border-slate-350 dark:border-slate-700 hover:border-primary dark:hover:border-slate-500'
        }`}
        onClick={() => document.getElementById('file-upload-input').click()}
      >
        <input
          id="file-upload-input"
          type="file"
          className="hidden"
          multiple={multiple}
          accept="image/*"
          onChange={onFileInputChange}
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-primary dark:text-primary-light animate-spin" />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Uploading images to Cloudinary...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-650 dark:text-slate-300">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Drag and drop your images here, or <span className="text-primary dark:text-primary-light hover:underline">browse</span>
              </p>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
                Supports PNG, JPG, JPEG, WEBP (Max 5MB each)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails Preview Grid */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Uploaded Images ({existingImages.length})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {existingImages.map((url, index) => (
              <div 
                key={url} 
                className="group relative aspect-square bg-slate-100 dark:bg-slate-850 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                <img 
                  src={url} 
                  alt={`Preview ${index}`} 
                  className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105" 
                />
                
                {/* Image Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRemoveImage(url)}
                    className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow"
                    title="Delete Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Primary Image Indicator */}
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary dark:bg-primary-light text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
