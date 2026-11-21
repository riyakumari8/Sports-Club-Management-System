import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck, LockKeyhole } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isExpired = new URLSearchParams(location.search).get('sessionExpired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);
      // Save rememberMe preference if needed
      if (rememberMe) {
        localStorage.setItem('clubsphere_remember_email', formData.email);
      } else {
        localStorage.removeItem('clubsphere_remember_email');
      }

      // Role-based routing
      if (data.roles?.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else if (data.roles?.includes('ROLE_STAFF')) {
        navigate('/staff/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your student credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #072a18 0%, #0F5132 50%, #198754 100%)',
      padding: '2rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 0.75rem',
            background: 'linear-gradient(135deg, #198754, #0F5132)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(15, 81, 50, 0.3)',
          }}>
            <Shield size={30} color="#D4AF37" />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F5132', letterSpacing: '-0.02em' }}>
            Welcome Back to ClubSphere
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>
            Sign in to access your court bookings, QR pass & trial privileges
          </p>
        </div>

        {isExpired && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} />
            <span>Session expired. Please log in again.</span>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Email Address / Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', margin: 0 }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#0F5132', fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#4b5563', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Remember my session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0F5132',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '0.25rem',
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Student Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Shortcuts for Student Evaluation */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px dashed #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#D4AF37" /> Evaluator Quick-Fill Accounts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillQuickDemo('vikram.singh@example.com', 'Member@123')}
              style={{ padding: '0.45rem', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: '6px', cursor: 'pointer' }}
            >
              Gold Member
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('kavya.nair@example.com', 'Member@123')}
              style={{ padding: '0.45rem', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer' }}
            >
              Trial User
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('manish.kumar@example.com', 'Member@123')}
              style={{ padding: '0.45rem', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}
            >
              Expired Plan
            </button>
          </div>
        </div>

        {/* Join CTA */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#6b7280' }}>
          Don't have a student account?{' '}
          <Link to="/signup" style={{ color: '#0F5132', fontWeight: 700, textDecoration: 'none' }}>
            Sign Up for 7-Day Free Trial
          </Link>
        </div>

        {/* Dedicated Portal Footnote */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f3f4f6',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9ca3af',
        }}>
          Staff & Administrators: Please use your dedicated login portals:{' '}
          <Link to="/staff/login" style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>Staff Login</Link>
          {' '}&bull;{' '}
          <Link to="/admin/login" style={{ color: '#0F5132', fontWeight: 600, textDecoration: 'none' }}>Admin Login</Link>
        </div>
      </div>
    </div>
  );
};
