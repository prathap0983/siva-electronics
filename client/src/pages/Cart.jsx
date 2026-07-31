import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, MessageSquare } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

function Cart() {
  const { cart, updateQty, removeFromCart, totalPrice, totalItems, clearCart } = useCart();

  const handleCheckout = () => {
    let text = "Hi Siva Electronics,\n\nI would like to order the following items from your website:\n\n";
    cart.forEach((item) => {
      text += `* ${item.name} (${item.category})\n  Qty: ${item.qty} | Price: ₹${(item.price * item.qty).toLocaleString("en-IN")}\n\n`;
    });
    text += `*Total Items:* ${totalItems}\n`;
    text += `*Total Order Value:* ₹${totalPrice.toLocaleString("en-IN")}\n\n`;
    text += "Please verify availability and confirm my order. Thanks!";

    const encoded = encodeURIComponent(text);
    window.location.href = `https://wa.me/918072300191?text=${encoded}`;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="h-20 w-20 bg-slate-55/10 dark:bg-slate-850/50 text-slate-400 flex items-center justify-center rounded-3xl mx-auto shadow-inner">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your Cart is Empty</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            You haven't added any Smart TVs, spare parts, or display repair items to your shopping cart yet.
          </p>
        </div>
        <div className="pt-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-slate-950 px-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-left space-y-8 min-h-[70vh]">
      
      {/* Title */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Shopping Cart</h1>
        <p className="text-sm text-slate-500">Review your products and spare parts before ordering on WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.type}`}
              className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Thumbnail */}
                <div className="h-16 w-16 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-50">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ShoppingCart className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                
                {/* Meta details */}
                <div className="text-left">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-primary font-bold uppercase mt-0.5 tracking-wider">
                    {item.category}
                  </p>
                  <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold mt-1">
                    ₹{item.price.toLocaleString("en-IN")} each
                  </p>
                </div>
              </div>

              {/* Action Counters & Totals */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-xl p-1">
                  <button
                    onClick={() => updateQty(item.id, item.type, -1)}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-450 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-extrabold text-sm text-slate-950 dark:text-white">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.type, 1)}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-450 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-extrabold text-base text-slate-950 dark:text-white w-24 text-right">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </span>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.id, item.type)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-450 hover:text-red-600 rounded-xl transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-6 text-left">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Total Items</span>
                <span className="font-bold text-slate-800 dark:text-white">{totalItems}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Service/Delivery</span>
                <span className="font-bold text-green-600 dark:text-green-400">FREE</span>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex justify-between text-base font-extrabold text-slate-950 dark:text-white">
                <span>Total Value</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all active:scale-98 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>Checkout via WhatsApp</span>
            </button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full text-center text-xs font-bold text-slate-450 hover:text-slate-600 transition-colors"
            >
              Clear All Items
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Cart;
