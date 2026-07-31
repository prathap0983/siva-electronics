import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("siva_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("siva_cart", JSON.stringify(cart));
  }, [cart]);

  // Add Item to Cart (Handles both Products and Spare Parts)
  const addToCart = (item, type = "product") => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (i) => i.id === item.id && i.type === type
      );

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].qty += 1;
        addToast(`Increased quantity of "${item.name}" in cart!`, "success");
        return newCart;
      } else {
        addToast(`Added "${item.name}" to cart!`, "success");
        return [
          ...prevCart,
          {
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            image_url: item.image_url,
            category: item.category || "Spare Part",
            type: type,
            qty: 1
          }
        ];
      }
    });
  };

  // Remove Item from Cart
  const removeFromCart = (id, type) => {
    setCart((prevCart) => prevCart.filter((i) => !(i.id === id && i.type === type)));
    addToast("Item removed from cart.", "info");
  };

  // Update Item Quantity
  const updateQty = (id, type, amount) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && item.type === type) {
            const newQty = item.qty + amount;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
