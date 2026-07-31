import React, { useEffect, useState } from 'react';
import { LayoutGrid, Wrench, Tv, ChevronLeft, ChevronRight, X, Heart, Maximize } from 'lucide-react';
import api from '../services/api.js';
import Skeleton from '../components/Skeleton.jsx';

export const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Lightbox State
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const categories = ['All', 'Shop', 'Products', 'Repair', 'Installation', 'Spare Parts'];

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const url = activeCategory === 'All' ? '/gallery' : `/gallery?category=${activeCategory}`;
      const response = await api.get(url);
      setItems(response.data);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [activeCategory]);

  const openLightbox = (index) => {
    setLightboxIdx(index);
  };

  const closeLightbox = () => {
    setLightboxIdx(null);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-8 py-4 text-left">
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shop Gallery</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A visual showcase of our workshop setups, custom wall mounts, panel diagnostic repair labs, and smart products.
        </p>
      </div>

      {/* Category Tabs list */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 animate-pulse rounded-2xl" />
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 animate-pulse rounded-2xl" />
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 animate-pulse rounded-2xl" />
          <div className="aspect-square bg-slate-200 dark:bg-slate-850 animate-pulse rounded-2xl" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800/80 cursor-pointer bg-slate-100 dark:bg-slate-850"
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <span className="self-end bg-primary/80 backdrop-blur-sm text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-xs line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-slate-300 text-[10px]">
                    <Maximize className="w-3 h-3" />
                    <span>Expand view</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 max-w-md mx-auto">
          <LayoutGrid className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-pulse" />
          <h3 className="font-bold text-lg mb-1">Gallery is empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No images have been uploaded to this category yet.
          </p>
        </div>
      )}

      {/* Lightbox Popup Dialog */}
      {lightboxIdx !== null && items[lightboxIdx] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-4 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image Pane */}
          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4 relative">
            <img
              src={items[lightboxIdx].image_url}
              alt={items[lightboxIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            {/* Title / Description */}
            <div className="text-center space-y-1 text-white">
              <span className="inline-block bg-primary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                {items[lightboxIdx].category}
              </span>
              <h3 className="text-base font-bold tracking-wide">{items[lightboxIdx].title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
