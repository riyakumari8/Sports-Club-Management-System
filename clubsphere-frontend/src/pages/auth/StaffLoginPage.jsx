import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Mail, ArrowRight, AlertCircle, UserCheck } from 'lucide-react';

export const StaffLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: 'coach.rahul@clubsphere.com', password: 'Staff@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);
      if (!data.roles?.includes('ROLE_STAFF') && !data.roles?.includes('ROLE_ADMIN')) {
        setError('Access denied: You do not have staff credentials.');
        return;
      }
      navigate('/staff/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Staff authentication failed.');
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
      background: 'linear-gradient(135deg, #082f49 0%, #0369a1 50%, #0284c7 100%)',
      padding: '2rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 0.75rem',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)',
          }}>
            <Briefcase size={30} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            EMPLOYEE & COACH ACCESS
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.02em', margin: '2px 0 0' }}>
            Staff Operations Portal
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
            Log in to manage shifts, daily attendance & court duties
          </p>
        </div>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Staff Email / ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0284c7',
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
              marginTop: '0.5rem',
            }}
          >
            <UserCheck size={18} />
            <span>{loading ? 'Validating Staff Duty...' : 'Sign In to Staff Portal'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed #e5e7eb', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Looking for student login?{' '}
            <Link to="/login" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
              Student Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
