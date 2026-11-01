import React from 'react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product, onAddToCart, isAdded = false }) => {
  if (!product) return null;
  const pid = product._id || product.id;
  const seller = product.sellerName || product.sellerId?.storeName || 'Verified Merchant';

  return (
    <div className="bg-white rounded-xl border border-surface-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-surface-300 transition duration-200 flex flex-col group">
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

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-surface-500 mb-1">
            <span className="truncate text-forest-700 font-semibold">{seller}</span>
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

          {onAddToCart && (
            <button
              id={`add-to-cart-${pid}`}
              onClick={() => onAddToCart(product)}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition border flex items-center gap-1 shadow-2xs ${
                isAdded
                  ? 'bg-forest-850 text-white border-forest-850'
                  : 'bg-white hover:bg-forest-50 text-forest-900 hover:text-forest-800 border-surface-300 hover:border-forest-600'
              }`}
            >
              <span>{isAdded ? '✓ Added' : '+ Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
