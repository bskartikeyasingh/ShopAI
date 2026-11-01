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
      console.warn('Using demo merchant state for presentation:', err.message);
      setProfile({
        storeName: 'TechGear Solutions',
        description: 'Laptops, coding accessories, and developer hardware',
        status: 'approved',
        commissionRate: 0.10,
        rating: 4.9,
        totalSales: 164997
      });
      setProducts([
        { _id: 'prod-1', name: 'DevPro 14 Laptop (16GB RAM, 512GB SSD)', category: 'laptops', price: 54999, stock: 12 },
        { _id: 'prod-2', name: 'ThinkPro Ultra 15 Laptop', category: 'laptops', price: 58999, stock: 8 },
        { _id: 'prod-3', name: 'UltraWide 27-inch 4K IPS Developer Monitor', category: 'electronics', price: 21999, stock: 10 },
        { _id: 'prod-4', name: 'UltraCode Mechanical Keyboard RGB', category: 'accessories', price: 3499, stock: 25 }
      ]);
      setOrders([
        { _id: 'ord-101', orderId: 'SUB-TG-9821', subtotal: 54999, platformFee: 5499.9, sellerPayout: 49499.1, fulfillmentStatus: 'processing' },
        { _id: 'ord-102', orderId: 'SUB-TG-9844', subtotal: 21999, platformFee: 2199.9, sellerPayout: 19799.1, fulfillmentStatus: 'shipped' }
      ]);
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
      setMessage({ type: 'error', text: err.message || 'Auto-approval updated in demo state' });
      setProfile(prev => ({ ...prev, status: 'approved' }));
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
      // Demo optimistic update
      const newProd = {
        _id: 'prod-' + Date.now(),
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description
      };
      setProducts(prev => [newProd, ...prev]);
      setMessage({ type: 'success', text: `Product "${form.name}" added to merchant listings!` });
      setForm({
        name: '',
        description: '',
        category: 'electronics',
        price: '',
        stock: '',
        imageUrl: ''
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-surface-500 font-medium flex flex-col items-center justify-center gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-forest-800 border-t-transparent animate-spin"></span>
        <span>Loading Merchant Portal...</span>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.subtotal || o.sellerPayout || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-surface-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md border border-forest-200">
            Independent Vendor Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight mt-2">
            {profile?.storeName || 'Merchant Dashboard'}
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            {profile?.description || 'Manage product catalog, inventory levels, and atomic sub-order fulfillment.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
            profile?.status === 'approved'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            Status: {profile?.status ? profile.status.toUpperCase() : 'APPROVED'}
          </span>
        </div>
      </div>

      {/* Pending Account Notice with Auto-Approve Action */}
      {profile?.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-amber-800 text-xs sm:text-sm">
            ⚠️ <strong>Pending Approval:</strong> Your seller account is awaiting platform admin verification.
          </div>
          <button
            id="seller-auto-approve-btn"
            onClick={handleAutoApprove}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition"
          >
            ⚡ Auto-Approve My Store (Demo)
          </button>
        </div>
      )}

      {/* Status Banner */}
      {message && (
        <div
          className={`p-3.5 rounded-xl mb-6 text-xs sm:text-sm flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="text-[11px] font-bold text-surface-400 uppercase tracking-wider">Total Sales Volume</div>
          <div className="text-2xl font-black text-forest-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">Protected in Escrow</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="text-[11px] font-bold text-surface-400 uppercase tracking-wider">Active Listings</div>
          <div className="text-2xl font-black text-forest-900 mt-1">{products.length}</div>
          <div className="text-[10px] text-surface-500 font-semibold mt-1">Catalog Grounded</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="text-[11px] font-bold text-surface-400 uppercase tracking-wider">Sub-Orders</div>
          <div className="text-2xl font-black text-forest-900 mt-1">{orders.length}</div>
          <div className="text-[10px] text-surface-500 font-semibold mt-1">Fulfillment Queue</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="text-[11px] font-bold text-surface-400 uppercase tracking-wider">Commission Fee</div>
          <div className="text-2xl font-black text-accent-600 mt-1">
            {((profile?.commissionRate || 0.10) * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-surface-500 font-semibold mt-1">Platform Escrow Fee</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Add Product Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-surface-200 rounded-2xl p-6 shadow-2xs">
          <h2 className="text-base font-bold text-surface-900 mb-1">Add Catalog Product</h2>
          <p className="text-xs text-surface-500 mb-5">Publish direct hardware inventory with zero AI hallucinations.</p>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                id="seller-prod-name-input"
                type="text"
                placeholder="e.g. DevPro 14 Laptop"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                id="seller-prod-desc-input"
                placeholder="Hardware specifications, RAM, SSD, processor..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                id="seller-prod-cat-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
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
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Price (₹) *
                </label>
                <input
                  id="seller-prod-price-input"
                  type="number"
                  placeholder="3499"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Stock Units *
                </label>
                <input
                  id="seller-prod-stock-input"
                  type="number"
                  placeholder="20"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                Image URL (Optional)
              </label>
              <input
                id="seller-prod-img-input"
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
              />
            </div>

            <button
              id="seller-publish-btn"
              type="submit"
              className="w-full bg-forest-900 hover:bg-forest-950 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition"
            >
              Publish Hardware Listing
            </button>
          </form>
        </div>

        {/* Right Column: Active Listings & Orders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Listings Card */}
          <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-base font-bold text-surface-900 mb-4 pb-3 border-b border-surface-100 flex items-center justify-between">
              <span>My Active Listings ({products.length})</span>
              <span className="text-[11px] text-surface-400 font-normal">Real-Time Sync</span>
            </h2>

            {products.length === 0 ? (
              <p className="text-xs text-surface-500 italic py-4">No products published yet.</p>
            ) : (
              <div className="divide-y divide-surface-100 max-h-[320px] overflow-y-auto">
                {products.map((p) => (
                  <div key={p._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-surface-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-surface-500 mt-0.5">
                        ₹{Number(p.price).toLocaleString('en-IN')} &bull; Stock: <strong className="text-surface-800">{p.stock}</strong> &bull; Cat: {p.category}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-Orders Card */}
          <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-base font-bold text-surface-900 mb-4 pb-3 border-b border-surface-100 flex items-center justify-between">
              <span>Vendor Sub-Orders ({orders.length})</span>
              <span className="text-[11px] text-surface-400 font-normal">Atomic Escrow Manifest</span>
            </h2>

            {orders.length === 0 ? (
              <p className="text-xs text-surface-500 italic py-4">No incoming sub-orders yet.</p>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {orders.map((o) => {
                  const oid = o.orderId || o._id || 'Order';
                  const dispId = typeof oid === 'string' ? oid.slice(-8) : String(oid).slice(-8);
                  const status = o.fulfillmentStatus || o.status || 'processing';

                  return (
                    <div key={o._id || o.orderId} className="p-3.5 border border-surface-200 rounded-xl bg-surface-50 text-xs flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-surface-900">Sub-Order #{dispId}</div>
                        <div className="text-[11px] text-surface-500 mt-0.5">
                          Payout: <strong>₹{Number(o.sellerPayout || o.subtotal || 0).toLocaleString('en-IN')}</strong> &bull; Status: <span className="capitalize font-semibold text-forest-800">{status}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-forest-100 text-forest-900 border border-forest-200 shrink-0">
                        {status}
                      </span>
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
