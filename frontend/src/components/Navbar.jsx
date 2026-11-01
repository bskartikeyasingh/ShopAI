import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_CREDENTIALS } from '../data/mockData.js';

export const Navbar = ({ onOpenAiChat }) => {
  const { cart, itemCount } = useCart();
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const totalCartCount = itemCount !== undefined 
    ? itemCount 
    : (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleQuickLogin = async (cred) => {
    setShowDemoMenu(false);
    try {
      await login(cred.email, cred.password);
      if (cred.role === 'seller') navigate('/seller');
      else if (cred.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch {
      // Navigate to login if backend unavailable, with prefilled state
      navigate('/login');
    }
  };

  return (
    <header className="bg-forest-900 border-b border-forest-800/80 sticky top-0 z-40 text-white shadow-sm">
      {/* Top micro-banner for platform transparency & demo notice */}
      <div className="bg-forest-950/80 border-b border-forest-800/50 py-1.5 px-4 text-[11px] font-medium text-forest-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Multi-Vendor Grounded AI Marketplace &bull; Atomic Escrow Protection</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="text-forest-200 hover:text-white transition flex items-center gap-1 font-semibold"
                id="demo-switcher-btn"
              >
                <span>Demo Credentials</span>
                <span className="text-[9px]">▼</span>
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 top-6 w-72 bg-white text-surface-900 rounded-xl shadow-xl border border-surface-200 p-2 z-50 text-xs">
                  <div className="px-2 py-1 font-bold text-forest-900 border-b border-surface-100 mb-1 flex justify-between items-center">
                    <span>1-Click Switch Account</span>
                    <button onClick={() => setShowDemoMenu(false)} className="text-surface-400 hover:text-surface-600">✕</button>
                  </div>
                  <div className="space-y-1">
                    {DEMO_CREDENTIALS.map((cred, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickLogin(cred)}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-forest-50 flex items-center justify-between group transition"
                      >
                        <div className="flex items-center gap-2">
                          <span>{cred.icon}</span>
                          <div>
                            <div className="font-semibold text-surface-900 group-hover:text-forest-800">{cred.roleLabel}</div>
                            <div className="text-[10px] text-surface-400">{cred.email}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-forest-700 opacity-0 group-hover:opacity-100 font-bold">Switch →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="hidden sm:inline text-forest-400">|</span>
            <span className="hidden sm:inline text-forest-300">Live Escrow Settlement Active</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-700 to-forest-800 border border-forest-600/40 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:border-accent-500/50 transition">
            🌿
          </div>
          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
              Shop<span className="text-accent-500">Agent</span>
            </div>
          </div>
          <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider bg-forest-800/80 text-forest-200 border border-forest-700/60 px-2 py-0.5 rounded-md">
            Multi-Vendor
          </span>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-forest-200">
          <Link to="/" className="hover:text-white transition">Marketplace</Link>
          <button onClick={onOpenAiChat} className="hover:text-white transition flex items-center gap-1.5">
            <span>✨</span>
            <span>AI Copilot</span>
          </button>
          <Link to="/seller" className="hover:text-white transition">Merchant Hub</Link>
          <Link to="/admin" className="hover:text-white transition">Platform Compliance</Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Ask AI Trigger */}
          <button
            id="nav-ask-ai-btn"
            onClick={onOpenAiChat}
            className="flex items-center gap-1.5 bg-forest-800 hover:bg-forest-700 text-forest-100 hover:text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg border border-forest-700 transition"
          >
            <span className="text-accent-500 font-bold">✨</span>
            <span>Ask AI</span>
          </button>

          {/* Cart Pill */}
          <Link
            to="/cart"
            id="nav-cart-btn"
            className="flex items-center gap-2 bg-forest-800/90 hover:bg-forest-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition border border-forest-700"
          >
            <span>🛍️</span>
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-accent-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center leading-tight">
              {totalCartCount}
            </span>
          </Link>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 border-l border-forest-800 pl-2.5 sm:pl-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                <div className="text-[10px] text-forest-300 capitalize">{user.role}</div>
              </div>

              {user.role === 'seller' && (
                <Link
                  to="/seller"
                  className="text-xs bg-forest-800 hover:bg-forest-700 text-accent-200 border border-forest-700 px-2.5 py-1.5 rounded-lg font-bold transition"
                >
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-xs bg-forest-800 hover:bg-forest-700 text-emerald-300 border border-forest-700 px-2.5 py-1.5 rounded-lg font-bold transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs text-forest-300 hover:text-rose-300 transition font-medium px-1.5 py-1"
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 border-l border-forest-800 pl-2.5 sm:pl-3">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-forest-200 hover:text-white transition px-2 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-bold bg-accent-500 hover:bg-accent-600 text-white px-3 py-1.5 rounded-lg transition shadow-xs"
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
