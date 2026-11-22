import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const StaffLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);
      const userRoles = Array.isArray(data.roles) && data.roles.length > 0
        ? data.roles
        : (data.authorities?.map(a => typeof a === 'string' ? a : (a.authority || a.role || '')) || []);
      if (!userRoles.includes('ROLE_STAFF') && !userRoles.includes('ROLE_ADMIN')) {
        setError('Access denied: You do not have staff operational privileges.');
        return;
      }
      navigate('/staff/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid Staff ID or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #062b1a 0%, #0F5132 50%, #157347 100%)',
      padding: '2rem 1.5rem',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 0.75rem',
            background: 'linear-gradient(135deg, #0F5132, #157347)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D4AF37',
            boxShadow: '0 8px 20px rgba(15, 81, 50, 0.35)',
          }}>
            <Briefcase size={32} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F5132', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#e8f5e9', padding: '4px 12px', borderRadius: '20px' }}>
            OPERATIONS & DEPARTMENT PORTAL
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F5132', letterSpacing: '-0.02em', margin: '10px 0 2px' }}>
            Staff Sign In
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
            Sign in with your Staff ID (e.g. SP001, FD001) or registered email
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              Staff ID or Registered Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="e.g. SP001 or sports.staff@clubsphere.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#0F5132', fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0F5132',
              color: '#ffffff',
              border: 'none',
              padding: '0.9rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(15, 81, 50, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? (
              <span>Authenticating Department...</span>
            ) : (
              <>
                <span>Sign In to Staff Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Looking for member or student login?{' '}
            <Link to="/login" style={{ color: '#0F5132', fontWeight: 700, textDecoration: 'none' }}>
              Student Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;
