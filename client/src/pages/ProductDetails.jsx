import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, PhoneCall, CheckCircle, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import API from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setErrorMsg("");
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to retrieve product details. The ID might be incorrect or database table is missing.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{errorMsg || "Product not found."}</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-primary hover:bg-primary-hover text-slate-950 font-bold rounded-xl text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-left space-y-6">
      
      {/* Back Button */}
      <Link 
        to="/products" 
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      {/* Details Container */}
      <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Column: Image wrapper */}
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Information */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <h2 className="text-2xl sm:text-3xl text-primary font-extrabold tracking-tight">
              ₹ {parseFloat(product.price).toLocaleString('en-IN')}
            </h2>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block">Description</span>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => addToCart(product, "product")}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-slate-950 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => window.location.href = "https://wa.me/918072300191"}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Seller (WhatsApp)</span>
            </button>
            <button
              onClick={() => window.location.href = "tel:+918072300191"}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-850 text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Shop</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;
