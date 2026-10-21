import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';

export const Home = ({ onOpenAiChat }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const data = await apiRequest(`/products${query}`);
        setProducts(Array.isArray(data) ? data : (data.products || []));
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">
            Multi-Vendor AI Marketplace
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Shop Smart with <span className="text-orange-500">Grounded AI</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Live catalog validation, atomic escrow order splitting across independent verified sellers, and zero hallucinated pricing.
          </p>

          {/* Search & Prompt Box */}
          <div className="pt-6 max-w-xl mx-auto flex gap-2">
            <input
              id="hero-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by keyword or category..."
              className="flex-1 bg-white text-slate-900 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg"
            />
            <button
              id="hero-ask-ai-btn"
              onClick={onOpenAiChat}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3.5 rounded-xl text-sm shadow-lg transition flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Marketplace Catalog</h2>
            <p className="text-sm text-slate-500">Verified listings from approved independent vendors</p>
          </div>
          <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
            {products.length} Products Available
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-500 font-medium">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                {/* Product Image */}
                <Link to={`/products/${product._id}`} className="relative h-48 bg-slate-100 overflow-hidden block">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                    {product.category}
                  </span>
                </Link>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-orange-600 transition">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Price</p>
                      <p className="text-lg font-black text-slate-900">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      id={`add-to-cart-${product._id}`}
                      onClick={() => addToCart(product, 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
