import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { ShoppingCart } from "lucide-react";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between text-left">
      
      <div>
        {/* Product Image */}
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50"
        />

        {/* Brand/Category Tag */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary-light mt-4">
          {product.category}
        </p>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
          {product.name}
        </h2>

        {/* Price Tag */}
        <p className="text-slate-950 dark:text-white font-extrabold text-xl mt-2">
          ₹ {parseFloat(product.price).toLocaleString('en-IN')}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <Link 
          to={`/products/${product.id}`}
          className="block text-center w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-705 dark:text-slate-200 font-bold py-3 rounded-xl transition-all active:scale-95 text-xs"
        >
          View Details
        </Link>
        <button 
          onClick={() => addToCart(product, "product")}
          className="flex items-center justify-center gap-1.5 w-full bg-primary hover:bg-primary-hover text-slate-950 font-bold py-3 rounded-xl transition-all active:scale-95 shadow-sm text-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>

    </div>
  );
}

export default ProductCard;
