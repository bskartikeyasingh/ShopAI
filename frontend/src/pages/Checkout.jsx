import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';

export const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: '123 Tech Park Avenue',
    city: 'Guntur',
    postalCode: '522213',
    phone: '+91 98765 43210'
  });

  const [paymentMethod, setPaymentMethod] = useState('card_sandbox');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  // Bulletproof currency formatter
  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num) || num === null || num === undefined) return '0';
    return num.toLocaleString('en-IN');
  };

  const safeCart = cart || [];

  // Group items by vendor to show transparent multi-vendor sub-orders
  const vendorBreakdown = safeCart.reduce((acc, item) => {
    const vName = item.sellerName || 'Verified Seller';
    if (!acc[vName]) acc[vName] = [];
    acc[vName].push(item);
    return acc;
  }, {});

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();
    setError(null);

    // Guard: Prevent unauthenticated submission
    if (!token && !localStorage.getItem('shopagent_token')) {
      setError('You must be logged in to complete your checkout. Please sign in below.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: cart.map(item => ({
          productId: item._id || item.productId,
          nameSnapshot: item.name || item.nameSnapshot,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          zipCode: shippingAddress.postalCode,
          postalCode: shippingAddress.postalCode,
          state: 'AP',
          country: 'India'
        }
      };

      const result = await apiRequest('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setSuccessOrder(result);
      clearCart();
    } catch (err) {
      setError(err.message || 'Checkout failed. Please check item stock levels.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE
  if (successOrder) {
    const orderIdDisplay = successOrder.parentOrderId || successOrder.orderId;
    const subOrdersCountDisplay = successOrder.subOrdersCreated || successOrder.subOrdersCount || 1;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          ✓
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Parent Order ID: <span className="font-mono font-semibold text-gray-800">{orderIdDisplay}</span>
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 text-left">
          <h4 className="font-bold text-emerald-800 text-sm mb-3">
            Multi-Vendor Splitting Successful ({subOrdersCountDisplay} Sub-Orders Created):
          </h4>
          <p className="text-xs text-emerald-700 leading-relaxed mb-4">
            Our atomic MongoDB transaction split your checkout into independent sub-orders for each vendor. Each seller will pack and ship their respective items separately.
          </p>
          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Total Paid:</strong> ₹{successOrder.totalAmount?.toLocaleString('en-IN')}</p>
            <p><strong>Payment Status:</strong> {successOrder.paymentStatus || 'Escrow Hold'}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  // AUTH GUARD: User Not Signed In
  if (!token && !localStorage.getItem('shopagent_token')) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            🔒
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Sign In to Continue</h2>
          <p className="text-gray-500 text-sm mb-6">
            To secure your multi-vendor sub-orders and link escrow tracking, please sign in to your customer account.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition text-sm"
            >
              Return to Catalog
            </Link>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            Demo credentials: <code>customer@shopagent.com</code> / <code>Password@123</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Checkout & Order Routing</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your delivery details and multi-vendor sub-order breakdown.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Shipping & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm font-black">1</span>
              Shipping Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="Rahul Verma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="123 Tech Park Avenue"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  placeholder="Guntur"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  placeholder="522213"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm font-black">2</span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'card_sandbox', label: 'Card Sandbox', sub: 'Instant Test Token' },
                { id: 'upi_qr', label: 'UPI / QR', sub: 'GooglePay / PhonePe' },
                { id: 'cod', label: 'Cash on Delivery', sub: 'Pay on arrival' }
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === method.id
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-900">{method.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{method.sub}</p>
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              🔒 <strong>Sandbox Mode:</strong> Real card data is never stored. All payments use server-validated tokens with atomic escrow holding.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Vendor Sub-Order Breakdown & Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Vendor Package Allocation
            </h2>

            {/* Split Packages */}
            <div className="space-y-4 mb-6">
              {Object.entries(vendorBreakdown).map(([vendorName, items], index) => (
                <div key={vendorName} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                      Package {index + 1}
                    </span>
                    <span className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                      Seller: {vendorName}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-200/50">
                    {items.map(item => (
                      <div key={item._id || item.productId} className="py-2 flex justify-between text-xs text-gray-800">
                        <span className="truncate max-w-[200px]">{item.name || item.nameSnapshot} × {item.quantity}</span>
                        <span className="font-semibold">₹{formatCurrency((item.price || item.unitPrice || 0) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({safeCart.length} items)</span>
                <span className="font-bold text-gray-900">₹{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                <span>Total Amount</span>
                <span className="text-2xl text-orange-600">₹{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span>Processing Atomic Order Split...</span>
              ) : (
                <>
                  <span>Pay & Split Orders</span>
                  <span>(₹{formatCurrency(cartTotal)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
