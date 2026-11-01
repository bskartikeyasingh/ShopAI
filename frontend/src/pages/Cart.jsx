import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export const Cart = () => {
  const { cartItems, cart, updateQuantity, removeFromCart, clearCart, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num) || num === null || num === undefined) return '0';
    return num.toLocaleString('en-IN');
  };

  const items = cartItems || cart || [];

  if (!items || items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-forest-50 text-forest-800 rounded-2xl flex items-center justify-center mx-auto text-3xl mb-5 border border-forest-200 shadow-2xs">
          🛒
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-surface-500 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Explore our marketplace catalog or consult the ShopAgent AI Copilot for grounded hardware bundle recommendations!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            id="start-shopping-btn"
            to="/"
            className="bg-forest-900 hover:bg-forest-950 text-white font-bold px-6 py-3 rounded-xl transition text-xs sm:text-sm shadow-xs"
          >
            Explore Marketplace Catalog
          </Link>
        </div>
      </div>
    );
  }

  const effectiveItemCount = itemCount !== undefined 
    ? itemCount 
    : items.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0);

  // Group items by vendor store
  const vendorGroups = items.reduce((acc, item) => {
    const vName = item.sellerName || item.sellerId?.storeName || 'Verified Merchant';
    if (!acc[vName]) acc[vName] = [];
    acc[vName].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-surface-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md border border-forest-200">
            Escrow Protected Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight mt-2">
            Shopping Cart
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Reviewing {effectiveItemCount} {effectiveItemCount === 1 ? 'item' : 'items'} across {Object.keys(vendorGroups).length} independent {Object.keys(vendorGroups).length === 1 ? 'vendor' : 'vendors'}.
          </p>
        </div>
        <button
          id="clear-cart-btn"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold border border-rose-200 bg-rose-50/50 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
        >
          🗑️ Clear Cart
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(vendorGroups).map(([vendorName, vendorItems]) => (
            <div key={vendorName} className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-2xs">
              {/* Vendor Group Header */}
              <div className="bg-surface-100/60 px-5 py-3 border-b border-surface-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏪</span>
                  <span className="text-xs font-extrabold text-surface-900">{vendorName}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded font-semibold">
                    Verified Seller
                  </span>
                </div>
                <span className="text-[11px] text-surface-400">
                  Direct Dispatch Package
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-surface-100 p-2 sm:p-4">
                {vendorItems.map((item, index) => {
                  const itemId = item._id || item.id || item.productId || `item-${index}`;
                  const unitPrice = Number(item.price ?? item.unitPrice ?? 0);
                  const qty = Number(item.quantity || 1);
                  const lineTotal = (isNaN(unitPrice) ? 0 : unitPrice) * (isNaN(qty) ? 1 : qty);

                  return (
                    <div
                      key={itemId}
                      className="p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-5"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name || 'Product'}
                        className="w-20 h-20 rounded-xl object-cover bg-surface-100 border border-surface-200 shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-50 px-2 py-0.5 rounded-md inline-block mb-1 border border-forest-100">
                          {item.category || 'General'}
                        </span>
                        <h3 className="text-sm font-bold text-surface-900 truncate">
                          {item.name || 'Catalog Item'}
                        </h3>
                        <p className="text-xs font-bold text-surface-800 mt-1">
                          ₹{formatCurrency(unitPrice)}{' '}
                          <span className="text-[11px] text-surface-400 font-normal">/ unit</span>
                        </p>
                      </div>

                      {/* Quantity Controls & Line Total */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                        <div className="flex items-center border border-surface-300 rounded-lg overflow-hidden bg-surface-50">
                          <button
                            id={`cart-decrease-${itemId}`}
                            onClick={() => updateQuantity(itemId, qty - 1)}
                            className="px-2.5 py-1 text-surface-700 hover:bg-surface-200 font-bold text-xs transition"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-bold text-xs text-surface-900 bg-white min-w-[2rem] text-center">
                            {qty}
                          </span>
                          <button
                            id={`cart-increase-${itemId}`}
                            onClick={() => updateQuantity(itemId, qty + 1)}
                            className="px-2.5 py-1 text-surface-700 hover:bg-surface-200 font-bold text-xs transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm sm:text-base font-extrabold text-forest-900">
                            ₹{formatCurrency(lineTotal)}
                          </div>
                          <button
                            id={`cart-remove-${itemId}`}
                            onClick={() => removeFromCart(itemId)}
                            className="text-[11px] text-surface-400 hover:text-rose-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-xs sticky top-24 space-y-5">
            <h2 className="text-base font-extrabold text-surface-900 pb-3 border-b border-surface-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
                Escrow Protected
              </span>
            </h2>

            <div className="space-y-3 text-xs text-surface-600">
              <div className="flex justify-between">
                <span>Subtotal ({effectiveItemCount} items)</span>
                <span className="font-bold text-surface-900">₹{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Shipping</span>
                <span className="text-emerald-700 font-bold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Escrow Fee</span>
                <span className="text-emerald-700 font-bold">₹0 (Zero Fee)</span>
              </div>
              <div className="pt-3 border-t border-surface-200 flex justify-between text-base font-black text-surface-900">
                <span>Total Amount</span>
                <span className="text-forest-900 text-lg">
                  ₹{formatCurrency(cartTotal)}
                </span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/checkout')}
              className="w-full bg-forest-900 hover:bg-forest-950 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <span>Proceed to Checkout</span>
              <span className="text-accent-500">→</span>
            </button>

            {/* Escrow guarantee note */}
            <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 text-[11px] text-surface-600 space-y-1">
              <div className="font-bold text-forest-900 flex items-center gap-1">
                <span>🛡️</span>
                <span>Atomic Multi-Vendor Routing</span>
              </div>
              <p className="text-surface-500 leading-relaxed">
                When you proceed, our backend automatically splits payment into isolated vendor sub-orders held in escrow.
              </p>
            </div>

            <div className="text-center pt-1">
              <Link to="/" className="text-xs text-surface-500 hover:text-forest-800 transition font-semibold">
                ← Continue Browsing Catalog
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
