import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { INITIAL_PRODUCTS } from '../data/mockData.js';

export const Home = ({ onOpenAiChat }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [addedItemMap, setAddedItemMap] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const data = await apiRequest(`/products${query}`);
        if (isMounted) {
          const list = Array.isArray(data) ? data : (data?.products || []);
          if (list && list.length > 0) {
            setProducts(list);
          } else if (!searchTerm) {
            setProducts(INITIAL_PRODUCTS);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn('API Catalog unavailable, fallback to verified seed catalog:', err.message);
        if (isMounted && INITIAL_PRODUCTS) {
          if (searchTerm) {
            const filtered = INITIAL_PRODUCTS.filter(p =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setProducts(filtered);
          } else {
            setProducts(INITIAL_PRODUCTS);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();
    return () => { isMounted = false; };
  }, [searchTerm]);

  const handleAddToCartWithFeedback = (product) => {
    addToCart(product, 1);
    const pid = product._id || product.id;
    setAddedItemMap(prev => ({ ...prev, [pid]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [pid]: false }));
    }, 1800);
  };

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'audio', label: 'Audio & Acoustics' },
    { id: 'electronics', label: 'Monitors & Desks' },
    { id: 'accessories', label: 'Peripherals & Accessories' }
  ];

  const displayedProducts = products.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      {/* Deep Forest-Green Hero Section */}
      <section className="bg-forest-900 border-b border-forest-800 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background ambient overlay */}
        <div className="absolute inset-0 bg-radial from-forest-800/40 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-forest-800/80 text-forest-200 px-3.5 py-1 rounded-full border border-forest-700/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span>
            <span>Enterprise Multi-Vendor Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Curated Hardware. Grounded <span className="text-accent-500">AI Intelligence.</span>
          </h1>

          <p className="text-sm sm:text-base text-forest-200 max-w-2xl mx-auto leading-relaxed">
            Live catalog stock validation, automated escrow routing across independent verified merchants, and conversational AI bundle configuration.
          </p>

          {/* Search & Prompt Box */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-surface-200 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center px-3">
                <span className="text-surface-400 mr-2">🔍</span>
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search laptops, headphones, 4K monitors, standing desks..."
                  className="w-full bg-transparent text-surface-900 text-sm focus:outline-none placeholder:text-surface-400 py-2"
                />
              </div>
              <button
                id="hero-ask-ai-btn"
                onClick={onOpenAiChat}
                className="bg-forest-850 hover:bg-forest-900 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 shrink-0 border border-forest-700"
              >
                <span className="text-accent-500">✨</span>
                <span>Ask AI Copilot</span>
              </button>
            </div>
          </div>

          {/* Quick value props pill bar */}
          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs text-forest-300">
            <span className="inline-flex items-center gap-1.5 bg-forest-800/50 px-3 py-1 rounded-lg border border-forest-700/50">
              <span className="text-emerald-400">✓</span> 100% In-Stock Verification
            </span>
            <span className="inline-flex items-center gap-1.5 bg-forest-800/50 px-3 py-1 rounded-lg border border-forest-700/50">
              <span className="text-emerald-400">✓</span> Zero Price Hallucination
            </span>
            <span className="inline-flex items-center gap-1.5 bg-forest-800/50 px-3 py-1 rounded-lg border border-forest-700/50">
              <span className="text-emerald-400">✓</span> Atomic Escrow Order Splitting
            </span>
          </div>
        </div>
      </section>

      {/* Trust & Metrics Strip */}
      <section className="bg-white border-b border-surface-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl font-black text-forest-900">4 Verified</div>
            <div className="text-xs text-surface-500 font-medium mt-0.5">Independent Merchants</div>
          </div>
          <div className="p-3 border-l border-surface-200">
            <div className="text-2xl font-black text-forest-900">16+ Hardware</div>
            <div className="text-xs text-surface-500 font-medium mt-0.5">Direct Developer Listings</div>
          </div>
          <div className="p-3 border-l border-surface-200">
            <div className="text-2xl font-black text-forest-900">Atomic Escrow</div>
            <div className="text-xs text-surface-500 font-medium mt-0.5">MongoDB 2-Phase Routing</div>
          </div>
          <div className="p-3 border-l border-surface-200">
            <div className="text-2xl font-black text-accent-600">Grounded AI</div>
            <div className="text-xs text-surface-500 font-medium mt-0.5">Strict Real-Time Retrieval</div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header & Category Chips */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-surface-200">
          <div>
            <div className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">
              Verified Marketplace
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">
              Hardware Catalog & Listings
            </h2>
            <p className="text-xs sm:text-sm text-surface-500 mt-1">
              Fulfilled directly by approved independent vendor stores with escrow guarantee.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border transition ${
                  selectedCategory === cat.id
                    ? 'bg-forest-900 text-white border-forest-900 shadow-xs'
                    : 'bg-white text-surface-700 hover:text-forest-900 border-surface-200 hover:border-surface-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="text-center py-20 text-surface-400 font-medium flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-forest-800 border-t-transparent animate-spin"></span>
            <span>Loading verified catalog...</span>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-200 p-8 max-w-md mx-auto">
            <div className="text-3xl mb-3">🔍</div>
            <p className="text-surface-800 font-bold">No products match your criteria.</p>
            <p className="text-xs text-surface-500 mt-1">Try resetting the category filter or searching a different keyword.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 text-xs font-bold text-forest-800 bg-forest-50 px-4 py-2 rounded-lg border border-forest-200 hover:bg-forest-100 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const pid = product._id || product.id;
              const isAdded = !!addedItemMap[pid];
              const sellerName = product.sellerName || product.sellerId?.storeName || 'Verified Merchant';

              return (
                <div
                  key={pid}
                  className="bg-white rounded-xl border border-surface-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-surface-300 transition duration-200 flex flex-col group"
                >
                  {/* Product Image */}
                  <Link to={`/products/${pid}`} className="relative h-48 bg-surface-100 overflow-hidden block">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-white/95 backdrop-blur-xs text-forest-900 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border border-surface-200 shadow-2xs">
                        {product.category}
                      </span>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-surface-500 mb-1">
                        <span className="truncate text-forest-700 font-semibold">{sellerName}</span>
                        <span className="text-amber-500 font-bold shrink-0">★ {product.rating || '4.9'}</span>
                      </div>

                      <Link to={`/products/${pid}`}>
                        <h3 className="font-bold text-surface-900 text-sm leading-snug line-clamp-2 group-hover:text-forest-800 transition">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-surface-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-surface-400">Price</p>
                        <p className="text-base font-extrabold text-surface-900">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <button
                        id={`add-to-cart-${pid}`}
                        onClick={() => handleAddToCartWithFeedback(product)}
                        className={`text-xs font-bold px-3.5 py-2 rounded-lg transition border flex items-center gap-1 shadow-2xs ${
                          isAdded
                            ? 'bg-forest-850 text-white border-forest-850'
                            : 'bg-white hover:bg-forest-50 text-forest-900 hover:text-forest-800 border-surface-300 hover:border-forest-600'
                        }`}
                      >
                        <span>{isAdded ? '✓ Added' : '+ Add'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature Callout in Deep Forest Green */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-forest-900 rounded-2xl border border-forest-800 p-8 sm:p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-accent-500 text-white px-2.5 py-0.5 rounded">
              AI Bundle Architect
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Need a Complete Developer Workstation Setup?
            </h3>
            <p className="text-xs sm:text-sm text-forest-200 leading-relaxed">
              Tell our autonomous copilot your budget (e.g. "Coding setup under ₹70,000") and receive an orchestrated, verified bundle split across multiple vendors.
            </p>
          </div>
          <button
            onClick={onOpenAiChat}
            className="bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition shrink-0"
          >
            Launch Setup Architect ✨
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
