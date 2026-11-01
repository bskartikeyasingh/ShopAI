import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../data/mockData';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelectDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setSelectedDemo(demo);
    setError('');
  };

  const handleSeedServer = async () => {
    setSeeding(true);
    setError('');
    setSeedSuccess('');
    try {
      const res = await apiRequest('/seed');
      setSeedSuccess(res.message || 'Database seeded successfully!');
      // If demo selected, auto-attempt login right away
      if (email && password) {
        setTimeout(async () => {
          try {
            const user = await login(email, password);
            if (user.role === 'seller') navigate('/seller');
            else if (user.role === 'admin') navigate('/admin');
            else navigate('/');
          } catch {
            // Keep on page
          }
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to trigger server seeding.');
    } finally {
      setSeeding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'seller') navigate('/seller');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Check server status or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-surface-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Demo Credentials Quick Selector for Presentations (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md border border-forest-200">
              Presentation Guide
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-surface-900 tracking-tight">
            1-Click Demo Credentials
          </h2>
          <p className="text-xs text-surface-500 mt-1 mb-6 leading-relaxed">
            Click any account below to instantly populate credentials and explore the platform’s role-based capabilities.
          </p>

          <div className="space-y-3">
            {DEMO_CREDENTIALS.map((cred, idx) => {
              const isSelected = email === cred.email;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDemo(cred)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-forest-50/70 border-forest-600 shadow-xs ring-1 ring-forest-600'
                      : 'bg-surface-50/50 border-surface-200 hover:border-surface-300 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl p-1 bg-white rounded-lg border border-surface-200 shrink-0 shadow-2xs">
                    {cred.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-surface-900 truncate">{cred.roleLabel}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cred.badgeColor}`}>
                        {cred.role}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-surface-500 mt-0.5 truncate">{cred.email}</p>
                    <p className="text-[11px] text-surface-600 mt-1 leading-snug">{cred.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDemo && (
            <div className="mt-4 p-3 bg-forest-900 text-forest-100 rounded-xl text-xs flex items-center justify-between">
              <span>Selected: <strong>{selectedDemo.roleLabel}</strong></span>
              <span className="text-[10px] text-forest-300 font-mono">Password: {selectedDemo.password}</span>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-surface-200 flex items-center justify-between text-xs">
            <span className="text-surface-500 text-[11px]">Server MongoDB not initialized?</span>
            <button
              type="button"
              id="seed-server-btn"
              onClick={handleSeedServer}
              disabled={seeding}
              className="text-xs font-bold text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              {seeding ? '⚡ Seeding Database...' : '⚡ Seed Remote DB'}
            </button>
          </div>
        </div>

        {/* Right Column: Sign In Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center font-black mb-3">
              🌿
            </div>
            <h1 className="text-2xl font-black text-surface-900 tracking-tight">Sign In</h1>
            <p className="text-xs text-surface-500 mt-1">Access your customer or seller dashboard.</p>
          </div>

          {seedSuccess && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{seedSuccess}</span>
            </div>
          )}

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              {error.toLowerCase().includes('credentials') && (
                <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                  <span className="text-[11px] text-rose-700">Remote DB may need initial seeding:</span>
                  <button
                    type="button"
                    onClick={handleSeedServer}
                    disabled={seeding}
                    className="text-[11px] font-bold bg-white text-rose-800 border border-rose-300 px-2.5 py-1 rounded hover:bg-rose-100 transition"
                  >
                    {seeding ? 'Seeding...' : 'Seed DB Now'}
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="login-email-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="login-password-input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-forest-900 hover:bg-forest-950 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-100 text-center">
            <p className="text-xs text-surface-500">
              Need to register a new vendor or customer?{' '}
              <Link to="/register" className="font-bold text-accent-600 hover:text-accent-700">
                Register here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
