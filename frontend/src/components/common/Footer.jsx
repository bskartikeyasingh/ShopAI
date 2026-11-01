import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-forest-950 text-forest-200 border-t border-forest-800/80 mt-20">
      {/* Guarantees Banner */}
      <div className="border-b border-forest-900 py-8 px-4 sm:px-6 lg:px-8 bg-forest-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Atomic Escrow Hold</h4>
              <p className="text-xs text-forest-300 mt-1">Funds stay protected in platform escrow until customers confirm physical receipt.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Multi-Vendor Splitting</h4>
              <p className="text-xs text-forest-300 mt-1">Single checkout atomically splits into individual vendor packages & payouts.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🤖</span>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Grounded Catalog AI</h4>
              <p className="text-xs text-forest-300 mt-1">Recommendations strictly validated against live MongoDB inventory and stock.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📜</span>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Compliance Audit Trail</h4>
              <p className="text-xs text-forest-300 mt-1">Every vendor approval, status change, and checkout logged immutably.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-800 border border-forest-700 flex items-center justify-center text-white font-black text-sm">
                🌿
              </div>
              <span className="text-xl font-black text-white">
                Shop<span className="text-accent-500">Agent</span>
              </span>
            </div>
            <p className="text-xs text-forest-300 leading-relaxed max-w-sm">
              An enterprise-grade multi-vendor e-commerce platform with autonomous AI sales copilots, multi-vendor escrow transactions, and platform governance.
            </p>
            <div className="pt-2 text-xs text-forest-400">
              <span>Architected with React, Node.js, Express, MongoDB, and Tailwind CSS.</span>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition">Product Catalog</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart & Breakdown</Link></li>
              <li><Link to="/checkout" className="hover:text-white transition">Secure Checkout</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
            </ul>
          </div>

          {/* Vendors & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/seller" className="hover:text-white transition">Merchant Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Audit Center</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Vendor Sign-In</Link></li>
            </ul>
          </div>

          {/* Demo Credentials Quick Guide */}
          <div className="bg-forest-900/60 p-4 rounded-xl border border-forest-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <span>🔑</span>
              <span>Presentation Logins</span>
            </h4>
            <div className="space-y-1.5 text-[11px] text-forest-300">
              <div>
                <strong className="text-white">Admin:</strong> admin@shopagent.com
              </div>
              <div>
                <strong className="text-white">Seller 1:</strong> techgear@shopagent.com
              </div>
              <div>
                <strong className="text-white">Seller 2:</strong> audiomaster@shopagent.com
              </div>
              <div>
                <strong className="text-white">Customer:</strong> customer@shopagent.com
              </div>
              <div className="text-[10px] text-forest-400 pt-1 border-t border-forest-800">
                Password: <code className="text-accent-400">Password@123</code>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-forest-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-forest-400">
          <div>
            &copy; {new Date().getFullYear()} ShopAgent Multi-Vendor Platform. Grounded AI Architecture.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All systems nominal &bull; Live Catalog Grounding</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
