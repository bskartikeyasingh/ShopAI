import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export const Cart = () => {
  const { cartItems, cart, updateQuantity, removeFromCart, clearCart, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();

  // Bulletproof currency formatter: never crashes on undefined, null, NaN
  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num) || num === null || num === undefined) return '0';
    return num.toLocaleString('en-IN');
  };

  const items = cartItems || cart || [];

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto text-4xl mb-6 shadow-xs">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          Explore our marketplace catalog or consult the ShopAgent AI Copilot to find products and bundles!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            id="start-shopping-btn"
            to="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm text-sm"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const effectiveItemCount = itemCount !== undefined 
    ? itemCount 
    : items.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Cart</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reviewing {effectiveItemCount} {effectiveItemCount === 1 ? 'item' : 'items'} from independent sellers
          </p>
        </div>
        <button
          id="clear-cart-btn"
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-700 font-semibold border border-rose-200 hover:border-rose-300 px-3 py-1.5 rounded-lg transition"
        >
          🗑️ Clear Cart
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const itemId = item._id || item.id || item.productId || `item-${index}`;
            const unitPrice = Number(item.price ?? item.unitPrice ?? 0);
            const qty = Number(item.quantity || 1);
            const lineTotal = (isNaN(unitPrice) ? 0 : unitPrice) * (isNaN(qty) ? 1 : qty);

            return (
              <div
                key={itemId}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs hover:border-slate-300 transition"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                  alt={item.name || 'Product'}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block mb-1">
                    {item.category || 'General'}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {item.name || 'Catalog Item'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Seller: <span className="text-slate-600 font-medium">{item.sellerName || 'Verified Vendor'}</span>
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-2">
                    ₹{formatCurrency(unitPrice)}{' '}
                    <span className="text-xs text-slate-400 font-normal">each</span>
                  </p>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      id={`cart-decrease-${itemId}`}
                      onClick={() => updateQuantity(itemId, qty - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm transition"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold text-xs sm:text-sm text-slate-800 bg-white min-w-[2rem] text-center">
                      {qty}
                    </span>
                    <button
                      id={`cart-increase-${itemId}`}
                      onClick={() => updateQuantity(itemId, qty + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-orange-600">
                      ₹{formatCurrency(lineTotal)}
                    </div>
                    <button
                      id={`cart-remove-${itemId}`}
                      onClick={() => removeFromCart(itemId)}
                      className="text-[11px] text-slate-400 hover:text-rose-600 mt-1 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({effectiveItemCount} items)</span>
                <span className="font-semibold text-slate-900">₹{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Escrow Protection</span>
                <span className="text-emerald-600 font-medium">Active</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-orange-600 text-lg font-extrabold">
                  ₹{formatCurrency(cartTotal)}
                </span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>

            <div className="mt-4 text-center">
              <Link to="/" className="text-xs text-slate-500 hover:text-orange-600 transition font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
