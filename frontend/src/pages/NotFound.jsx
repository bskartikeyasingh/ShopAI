import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto text-3xl font-black mb-6 border border-forest-200">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm text-surface-500 max-w-md mx-auto leading-relaxed">
        The destination you are looking for does not exist or has been relocated within the marketplace.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/"
          className="bg-forest-850 hover:bg-forest-900 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-xs"
        >
          Return to Marketplace Catalog
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
