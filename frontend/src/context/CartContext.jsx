import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopagent_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Clean and sanitize any corrupted items from legacy runs
      return Array.isArray(parsed)
        ? parsed
            .filter((item) => item && (item._id || item.id || item.productId) && typeof (item.price ?? item.unitPrice) !== 'undefined')
            .map((item) => {
              const pid = item._id || item.id || item.productId;
              const safePrice = Number(item.price ?? item.unitPrice ?? 0);
              return {
                ...item,
                _id: pid,
                id: pid,
                productId: pid,
                name: item.name || item.nameSnapshot || 'Product',
                price: isNaN(safePrice) ? 0 : safePrice,
                unitPrice: isNaN(safePrice) ? 0 : safePrice,
                quantity: Math.max(1, Number(item.quantity) || 1),
                sellerId: item.sellerId || null,
                sellerName: item.sellerName || 'Verified Merchant',
                imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                category: item.category || 'General',
                stock: Number(item.stock ?? 99)
              };
            })
        : [];
    } catch (e) {
      console.error('Failed to parse cart cache:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shopagent_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const prodId = product._id || product.id || product.productId;
    if (!prodId) return;

    // Normalize price to a safe number
    const rawPrice = product.price ?? product.unitPrice ?? 0;
    const safePrice = Number(rawPrice);

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => (item._id || item.id) === prodId);
      if (existing) {
        return prevItems.map((item) =>
          (item._id || item.id) === prodId
            ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
            : item
        );
      }
      return [
        ...prevItems,
        {
          _id: prodId,
          id: prodId,
          productId: prodId,
          name: product.name || product.nameSnapshot || 'Unnamed Product',
          price: isNaN(safePrice) ? 0 : safePrice,
          unitPrice: isNaN(safePrice) ? 0 : safePrice,
          category: product.category || 'General',
          imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          sellerId: product.sellerId?._id || product.sellerId || null,
          sellerName: product.sellerId?.storeName || product.sellerName || 'Verified Seller',
          stock: Number(product.stock ?? 99),
          quantity: Math.max(1, quantity)
        }
      ];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id || item.productId) === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id || item.productId) !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('shopagent_cart');
    } catch (e) {
      console.error('Failed to clear cart storage:', e);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const p = Number(item?.price ?? item?.unitPrice ?? 0);
    const q = Number(item?.quantity || 1);
    return sum + (isNaN(p) ? 0 : p) * (isNaN(q) ? 1 : q);
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
