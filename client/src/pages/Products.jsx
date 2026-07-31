import { useEffect, useState } from "react";
import { Search, Filter, Tv } from "lucide-react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then((res) => {
        // Handle both simple array structure and the advanced paginated object structure
        const productList = Array.isArray(res.data) 
          ? res.data 
          : (res.data.products || []);
        setProducts(productList);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute unique categories list
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean))
  ];

  // Perform search and category matching filters
  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || product.category === category;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-left min-h-[70vh]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
          Products Catalog
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Find your favorite smart TVs, assembled displays, and original repair spares.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-card-dark p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
        </div>

        {/* Category Select */}
        <div className="relative w-full sm:w-48 flex items-center">
          <select
            className="w-full pl-3 pr-8 py-3 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white font-semibold cursor-pointer appearance-none transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 h-96 rounded-3xl" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-card-dark">
          <Tv className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">No products found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            We couldn't find any products matching "{search}" under "{category}".
          </p>
        </div>
      )}

    </div>
  );
}

export default Products;
