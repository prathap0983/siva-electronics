import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  PlusCircle, Edit3, Trash2, Search, Loader2, Image as ImageIcon, Box, AlertTriangle, ArrowRight 
} from "lucide-react";
import API from "../api/api";
import { useToast } from "../context/ToastContext.jsx";

function AdminProducts() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // Lists and loading states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Deletion modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch product catalog
  const fetchProducts = () => {
    setLoading(true);
    API.get("/products")
      .then((res) => {
        const productList = Array.isArray(res.data) 
          ? res.data 
          : (res.data.products || []);
        setProducts(productList);
      })
      .catch((err) => {
        console.error(err);
        addToast("Error fetching products from database.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Navigate to edit details page
  const handleEditClick = (product) => {
    navigate(`/admin/edit/${product.id}`);
  };

  // Open delete validation modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  // Confirm delete operation
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/products/${productToDelete.id}`);
      addToast("Product Deleted Successfully!", "success");
      setIsDeleteOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast("Failed to delete product.", "error");
    } finally {
      setDeleting(false);
      setProductToDelete(null);
    }
  };

  // Search filter
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-left min-h-[70vh] transition-colors duration-300">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
            Admin Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, modify, and delete products inside Siva Electronics database.
          </p>
        </div>
        <Link
          to="/admin/add-product"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-slate-950 px-5 py-3 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-card-dark p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products by title or category..."
            className="w-full pl-10 pr-4 py-3 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
        </div>
      </div>

      {/* Main Grid / Tables */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 h-16 rounded-2xl" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          {/* Desktop view Table */}
          <div className="hidden md:block bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    
                    {/* Image */}
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-xl border border-slate-250 dark:border-slate-700 overflow-hidden flex items-center justify-center bg-slate-50">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt="" 
                            className="h-full w-full object-cover" 
                            onError={(e) => { e.target.src = "https://placehold.co/100?text=No+Image"; }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {product.name}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-right font-extrabold text-slate-950 dark:text-white">
                      ₹{parseFloat(product.price).toLocaleString('en-IN')}
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-4 text-center font-bold text-slate-655 dark:text-slate-350">
                      {product.stock_qty !== undefined ? product.stock_qty : 25}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary rounded-xl transition-colors"
                          title="Edit Details"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view List Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl border border-slate-250 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-50">
                    <img 
                      src={product.image_url || "https://placehold.co/100?text=No+Image"} 
                      alt="" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{product.name}</h3>
                    <p className="text-[10px] text-primary font-extrabold uppercase mt-0.5">{product.category}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-extrabold text-slate-950 dark:text-white">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-semibold text-slate-400">Qty: {product.stock_qty !== undefined ? product.stock_qty : 25}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="p-2 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-card-dark max-w-lg mx-auto space-y-4">
          <div className="h-16 w-16 bg-slate-50 dark:bg-slate-850 text-slate-400 dark:text-slate-500 flex items-center justify-center rounded-2xl mx-auto shadow-inner">
            <Box className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Products Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {search ? `We couldn't find items matching "${search}".` : "Your inventory products catalog is currently empty."}
            </p>
          </div>
          {!search && (
            <Link
              to="/admin/add-product"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-hover text-slate-950 font-bold rounded-xl text-xs transition-all active:scale-95 shadow"
            >
              <span>Add Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal dialog */}
      {isDeleteOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-left">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-lg font-bold">Delete Product?</h2>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{productToDelete.name}"</strong>? 
              This operation purges the Supabase record and purges all media resources inside your Cloudinary account.
            </p>
            
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-650"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminProducts;
