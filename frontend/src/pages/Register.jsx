import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    storeName: '',
    storeDescription: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(formData);
      if (user.role === 'seller') navigate('/seller');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-surface-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center font-black mb-3">
            🌿
          </div>
          <h1 className="text-2xl font-black text-surface-900 tracking-tight">Create Account</h1>
          <p className="text-xs text-surface-500 mt-1">Join as a verified customer or independent seller.</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector Cards */}
          <div>
            <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect('customer')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  formData.role === 'customer'
                    ? 'border-forest-700 bg-forest-50/70 text-forest-900 ring-1 ring-forest-700'
                    : 'border-surface-200 bg-surface-50/60 text-surface-600 hover:border-surface-300'
                }`}
              >
                <span className="text-xl">🛒</span>
                <div>
                  <div className="text-xs font-bold">Customer</div>
                  <div className="text-[10px] text-surface-500">Shop marketplace</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('seller')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  formData.role === 'seller'
                    ? 'border-forest-700 bg-forest-50/70 text-forest-900 ring-1 ring-forest-700'
                    : 'border-surface-200 bg-surface-50/60 text-surface-600 hover:border-surface-300'
                }`}
              >
                <span className="text-xl">💼</span>
                <div>
                  <div className="text-xs font-bold">Seller / Vendor</div>
                  <div className="text-[10px] text-surface-500">Sell hardware</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              id="register-name-input"
              name="name"
              type="text"
              placeholder="e.g. Rahul Verma"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              id="register-email-input"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              id="register-password-input"
              name="password"
              type="password"
              placeholder="Create strong password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
            />
          </div>

          {formData.role === 'seller' && (
            <div className="pt-2 border-t border-surface-100 space-y-4">
              <div className="text-xs font-bold text-forest-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏪</span> Store Details
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Store / Brand Name
                </label>
                <input
                  id="register-storename-input"
                  name="storeName"
                  type="text"
                  placeholder="e.g. Apex Coding Hardware"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Store Description
                </label>
                <textarea
                  id="register-storedesc-input"
                  name="storeDescription"
                  placeholder="Tell customers about your products and expertise..."
                  value={formData.storeDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 transition"
                />
              </div>

              <div className="p-3 bg-forest-50 border border-forest-200 rounded-xl text-[11px] text-forest-800">
                💡 <strong>Demo Note:</strong> New seller registrations will start in <em>Pending</em> status. You can use the Admin Console to approve them or use the Auto-Approve demo button in the seller dashboard!
              </div>
            </div>
          )}

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-forest-900 hover:bg-forest-950 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition disabled:opacity-50"
          >
            {loading ? 'Registering Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-100 text-center">
          <p className="text-xs text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-accent-600 hover:text-accent-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
