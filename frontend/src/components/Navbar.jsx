import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = ({ onOpenAiChat }) => {
  const { cart, itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const totalCartCount = itemCount !== undefined 
    ? itemCount 
    : (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition">
            Shop<span className="text-orange-500">Agent</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
            Multi-Vendor AI
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Ask AI Trigger */}
          <button
            id="nav-ask-ai-btn"
            onClick={onOpenAiChat}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>✨</span>
            <span>Ask AI</span>
          </button>

          {/* Cart Pill */}
          <Link
            to="/cart"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-slate-700"
          >
            <span>🛍️</span>
            <span>Cart</span>
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {totalCartCount}
            </span>
          </Link>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-700 pl-3">
              <span className="text-xs text-slate-300 font-medium hidden md:inline">
                {user.name}
              </span>
              {user.role === 'seller' && (
                <Link
                  to="/seller"
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 px-2.5 py-1.5 rounded-lg font-bold transition"
                >
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 px-2.5 py-1.5 rounded-lg font-bold transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-red-400 transition font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
