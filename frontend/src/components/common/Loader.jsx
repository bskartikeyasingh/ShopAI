import React from 'react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-surface-500 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-forest-800 border-t-transparent animate-spin"></div>
      <p className="text-xs font-medium">{message}</p>
    </div>
  );
};

export default Loader;
