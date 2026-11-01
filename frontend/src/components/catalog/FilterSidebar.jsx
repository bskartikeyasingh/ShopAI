import React from 'react';

export const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange
}) => {
  return (
    <aside className="w-full bg-white rounded-2xl border border-surface-200 p-5 shadow-2xs space-y-6">
      <div>
        <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider mb-3">
          Categories
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg font-semibold transition flex items-center justify-between ${
                selectedCategory === cat.id
                  ? 'bg-forest-900 text-white shadow-2xs'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {onPriceChange && (
        <div className="pt-4 border-t border-surface-100">
          <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider mb-3">
            Max Budget (₹)
          </h4>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={priceRange || 100000}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-forest-900 cursor-pointer"
          />
          <div className="text-xs font-bold text-forest-900 mt-2">
            Up to ₹{Number(priceRange || 100000).toLocaleString('en-IN')}
          </div>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
