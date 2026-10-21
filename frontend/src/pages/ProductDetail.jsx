import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useCart } from '../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('detail');
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiRequest(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400 font-medium">Loading Product Details...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="text-emerald-400">✓</span>
          <span>Added {quantity} unit(s) to Cart!</span>
        </div>
      )}

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Product Showcase & Image */}
          <div className="relative">
            <div className="relative bg-slate-50 rounded-2xl overflow-hidden p-8 flex items-center justify-center">
              {/* Discount / Deal Badge */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
                30% OFF
              </div>
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                alt={product.name}
                className="w-full max-h-[380px] object-contain transition-transform hover:scale-105 duration-300"
              />
            </div>
          </div>

          {/* Right: Metadata & Actions */}
          <div className="space-y-6">
            {/* Breadcrumb / Category */}
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {product.category || 'General'} / In Stock: {product.stock} Units
            </div>

            <div>
              <p className="text-xs font-mono text-gray-400 mb-1">SKU: {product._id?.slice(-8).toUpperCase()}</p>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-orange-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <div className="flex items-center text-amber-400 text-sm">
                ★★★★★
                <span className="ml-2 text-xs font-semibold text-gray-500">17 reviews</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-gray-700 uppercase">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                >
                  -
                </button>
                <span className="px-5 py-2 text-sm font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                id="product-detail-add-btn"
                onClick={handleAdd}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
              >
                ADD TO CART
              </button>
              <Link
                id="product-detail-buy-btn"
                to="/cart"
                onClick={handleAdd}
                className="flex-1 bg-gray-900 hover:bg-black text-white font-extrabold py-3.5 px-6 rounded-xl text-center shadow-lg transition"
              >
                BUY NOW
              </Link>
            </div>

            <div className="text-xs text-gray-400 pt-2 flex items-center gap-2">
              <span>🚚</span>
              <span>Free delivery available on this order. Dispatched via verified seller.</span>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications */}
        <div className="mt-14 border-t border-gray-100 pt-8">
          <div className="flex gap-8 border-b border-gray-100 pb-3">
            {[
              { id: 'detail', label: 'SPECIFICATIONS' },
              { id: 'seller', label: 'SELLER INFO' },
              { id: 'policy', label: 'RETURN POLICY' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-extrabold tracking-wider transition ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600 pb-3'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm">
            {activeTab === 'detail' && (
              <div className="grid grid-cols-2 max-w-lg gap-y-3">
                <span className="text-gray-400 font-medium">Category</span>
                <span className="text-gray-800 font-semibold">{product.category}</span>
                <span className="text-gray-400 font-medium">Stock Status</span>
                <span className="text-emerald-600 font-semibold">{product.stock > 0 ? 'Available' : 'Out of Stock'}</span>
                <span className="text-gray-400 font-medium">Verified Authentic</span>
                <span className="text-gray-800 font-semibold">Yes (Catalog Grounded)</span>
              </div>
            )}
            {activeTab === 'seller' && (
              <p className="text-gray-600 leading-relaxed">
                This item is fulfilled directly by a verified independent vendor ({product.sellerId?.storeName || 'Verified Merchant'}). Payouts are protected by platform escrow until customer delivery is verified.
              </p>
            )}
            {activeTab === 'policy' && (
              <p className="text-gray-600 leading-relaxed">
                7-day replacement warranty supported by ShopAgent. Fast dispute resolution via platform administrator moderation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
