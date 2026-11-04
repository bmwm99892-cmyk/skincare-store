import { useState } from 'react';
import { API_BASE } from '../lib/api.js';

export default function Login({ onLoginSuccess, onNavigate }) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
    const payload = isRegister
      ? { full_name: fullName, email, password }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      onLoginSuccess?.(data.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem',
      background: 'linear-gradient(135deg, #fcf2f4 0%, #f8dde5 100%)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '36px 40px', width: '100%', maxWidth: 430,
        boxShadow: '0 20px 60px rgba(79,51,61,.12)',
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🌸</div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#292329', fontFamily: "'Playfair Display', Georgia, serif" }}>
            {isRegister ? 'Create an Account' : 'Welcome to NUDU'}
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#82777d' }}>
            {isRegister ? 'Sign up to manage and track all your orders' : 'Sign in to view your orders & saved details'}
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', background: '#f8dde5', borderRadius: 10, padding: 4, marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            style={{
              flex: 1, padding: '9px', border: 0, borderRadius: 8, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', background: !isRegister ? '#fff' : 'transparent',
              color: !isRegister ? '#b95275' : '#82777d', boxShadow: !isRegister ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all .2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            style={{
              flex: 1, padding: '9px', border: 0, borderRadius: 8, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', background: isRegister ? '#fff' : 'transparent',
              color: isRegister ? '#b95275' : '#82777d', boxShadow: isRegister ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all .2s',
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#82777d', marginBottom: 5, letterSpacing: '.04em' }}>
                FULL NAME <span style={{ color: '#d96c91' }}>*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ayesha Khan"
                required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8dde1', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#292329' }}
              />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#82777d', marginBottom: 5, letterSpacing: '.04em' }}>
              EMAIL ADDRESS <span style={{ color: '#d96c91' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8dde1', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#292329' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#82777d', marginBottom: 5, letterSpacing: '.04em' }}>
              PASSWORD <span style={{ color: '#d96c91' }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8dde1', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#292329' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', background: loading ? '#c9a0b2' : '#b95275', color: '#fff',
              border: 0, borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(185,82,117,.28)', transition: 'background .2s',
            }}
          >
            {loading ? 'Please wait…' : isRegister ? '✦ Create Account' : '✦ Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0e9eb', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            style={{ background: 'transparent', border: 0, color: '#82777d', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
