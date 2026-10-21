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
    <div style={{ maxWidth: 440, margin: '3rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
      <h2 style={{ marginBottom: '1.2rem' }}>Create Account</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <div>
          <label style={{ fontSize: '0.9rem', color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Account Type</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: 6 }}
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller / Vendor</option>
          </select>
        </div>

        {formData.role === 'seller' && (
          <>
            <input
              name="storeName"
              placeholder="Store / Brand Name"
              value={formData.storeName}
              onChange={handleChange}
              required
              style={{ padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
            <textarea
              name="storeDescription"
              placeholder="Store Description"
              value={formData.storeDescription}
              onChange={handleChange}
              rows={3}
              style={{ padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '0.5rem', padding: '0.8rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1.2rem', fontSize: '0.9rem', color: '#64748b' }}>
        Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Login here</Link>
      </p>
    </div>
  );
};
