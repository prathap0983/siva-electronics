import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Wrench, ChevronRight, Phone, MessageSquare, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import api from '../api/api.js';
import Skeleton from '../components/Skeleton.jsx';

export const SpareParts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('available') === 'true');

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
  }, []);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (availableOnly) params.append('available', 'true');

      setSearchParams(params);

      const response = await api.get(`/spare-parts?${params.toString()}`);
      setParts(response.data);
    } catch (err) {
      console.error('Failed to load spare parts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, [selectedBrand, availableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSpareParts();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setAvailableOnly(false);
    setSearchParams({});
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  return (
    <div className="space-y-8 py-4 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Genuine Spare Parts</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search high-grade TV screens, backlight strips, logic boards, and power supplies.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="font-bold text-sm tracking-wider uppercase text-slate-400">Filters</span>
            <button onClick={clearFilters} className="text-xs font-semibold text-primary dark:text-primary-light hover:underline">Reset</button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Search Parts / Models</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search backlights, LG..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </form>

          {/* Brand */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Compatible Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Availability check */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-850">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-primary border-slate-350 dark:border-slate-700 focus:ring-primary w-4 h-4"
            />
            <span className="text-sm font-semibold text-slate-750 dark:text-slate-300">Available Stock Only</span>
          </label>
        </aside>

        {/* Spare Parts Grid */}
        <div className="flex-grow w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Skeleton /><Skeleton /><Skeleton />
            </div>
          ) : parts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {parts.map((part) => (
                <div key={part.id} className="premium-card flex flex-col overflow-hidden text-left bg-white dark:bg-card-dark justify-between">
                  <div className="aspect-square bg-slate-100 dark:bg-slate-850 overflow-hidden relative border-b border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400">
                    {part.image_url ? (
                      <img src={part.image_url} alt={part.name} className="w-full h-full object-cover" />
                    ) : (
                      <Wrench className="w-16 h-16" />
                    )}
                    <span className={`absolute top-3 right-3 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow ${
                      part.stock_qty > 0 
                        ? 'bg-green-150 text-green-700 dark:bg-green-950/20 dark:text-green-300' 
                        : 'bg-red-150 text-red-750 dark:bg-red-950/20 dark:text-red-300'
                    }`}>
                      {part.stock_qty > 0 ? `${part.stock_qty} In Stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider">{part.brand?.name || 'OEM Parts'}</span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{part.name}</h3>
                      
                      {/* Compatible Models list tags */}
                      {part.compatible_models && part.compatible_models.length > 0 && (
                        <div className="pt-1.5">
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Compatible Models</span>
                          <div className="flex flex-wrap gap-1">
                            {part.compatible_models.map((model, idx) => (
                              <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] px-2 py-0.5 rounded">
                                {model}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex items-center justify-between">
                      <span className="font-extrabold text-base text-slate-950 dark:text-white">
                        ₹{parseFloat(part.price).toLocaleString('en-IN')}
                      </span>
                      
                      <div className="flex items-center gap-2 flex-grow justify-end max-w-[70%]">
                        {/* Add to Cart */}
                        <button
                          onClick={() => addToCart(part, "spare_part")}
                          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl transition-all active:scale-95 text-[11px] shadow-sm flex-grow"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        {/* Inquiry CTA */}
                        <button
                          type="button"
                          onClick={() => {
                            const rawWhatsapp = import.meta.env.VITE_WHATSAPP || '8072300191';
                            const clean = rawWhatsapp.replace(/[^0-9]/g, '');
                            const whatsappNum = clean.length === 10 ? `91${clean}` : clean;
                            const message = `Hi Siva Electronics,\n\nI am inquiring about the spare part: *${part.name}* priced at ₹${part.price}. Is it compatible with my TV model details?`;
                            window.location.href = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
                          }}
                          className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm transition-colors flex items-center justify-center flex-shrink-0"
                          title="Inquire WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
              <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">No components found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                We couldn't find any spare parts catalog entries matching your selected parameters.
              </p>
              <button onClick={clearFilters} className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-full transition-colors">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpareParts;
