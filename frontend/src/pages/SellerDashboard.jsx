import React, { useState, useEffect } from 'react';
import { api } from '../api/client.js';

export const SellerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'electronics',
    price: '',
    stock: '',
    imageUrl: ''
  });

  const loadData = async () => {
    try {
      const [profData, prodData, ordData] = await Promise.all([
        api.get('/seller/profile'),
        api.get('/seller/products'),
        api.get('/seller/orders')
      ]);
      setProfile(profData);
      setProducts(Array.isArray(prodData) ? prodData : (prodData?.products || []));
      setOrders(Array.isArray(ordData) ? ordData : []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to load seller records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAutoApprove = async () => {
    try {
      await api.post('/seller/auto-approve', {});
      setMessage({ type: 'success', text: 'Account auto-approved! You can now publish products.' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.name || form.price === '' || form.stock === '') {
      setMessage({ type: 'error', text: 'Please fill in Name, Price, and Stock.' });
      return;
    }

    try {
      await api.post('/seller/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setMessage({ type: 'success', text: `Product "${form.name}" published successfully!` });
      setForm({
        name: '',
        description: '',
        category: 'electronics',
        price: '',
        stock: '',
        imageUrl: ''
      });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to publish product.' });
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Seller Portal...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Pending Account Notice with Auto-Approve Action */}
      {profile?.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-amber-800 text-sm">
            ⚠️ <strong>Pending Approval:</strong> Your seller account is awaiting verification.
          </div>
          <button
            id="seller-auto-approve-btn"
            onClick={handleAutoApprove}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
          >
            ⚡ Auto-Approve My Store (Demo)
          </button>
        </div>
      )}

      {/* Status Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Product Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Product</h2>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name *</label>
              <input
                id="seller-prod-name-input"
                type="text"
                placeholder="e.g. Mechanical Gaming Keyboard"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
              <textarea
                id="seller-prod-desc-input"
                placeholder="Product details, material, warranty..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                id="seller-prod-cat-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio</option>
                <option value="sports">Sports</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Kitchen</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Price (₹) *</label>
                <input
                  id="seller-prod-price-input"
                  type="number"
                  placeholder="3999"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Stock *</label>
                <input
                  id="seller-prod-stock-input"
                  type="number"
                  placeholder="15"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL (Optional)</label>
              <input
                id="seller-prod-img-input"
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              id="seller-publish-btn"
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm transition"
            >
              Publish Product
            </button>
          </form>
        </div>

        {/* Right Column: Active Listings & Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              My Active Listings ({products.length})
            </h2>

            {products.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No products published yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                {products.map((p) => (
                  <div key={p._id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                      <p className="text-xs text-slate-500">
                        ₹{Number(p.price).toLocaleString('en-IN')} | Stock: {p.stock} | Cat: {p.category}
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Vendor Sub-Orders ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No incoming orders yet.</p>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto">
                {orders.map((o) => {
                  const oid = o.orderId || o._id || 'Order';
                  const dispId = typeof oid === 'string' ? oid.slice(-6) : String(oid).slice(-6);
                  return (
                    <div key={o._id || o.orderId} className="p-3 border border-slate-100 rounded-xl bg-slate-50 text-xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Order #{dispId}</span>
                        <span>₹{Number(o.subtotal || o.payoutAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-slate-500 mt-1">Status: {o.fulfillmentStatus || o.status || 'processing'}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
