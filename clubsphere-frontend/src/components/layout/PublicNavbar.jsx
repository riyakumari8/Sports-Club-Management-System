import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Menu,
  X,
  LogIn,
  UserPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const PublicNavbar = () => {
  const { isAuthenticated, roles, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (roles?.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (roles?.includes('ROLE_STAFF')) return '/staff/dashboard';
    return '/student/dashboard';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sports', path: '/sports' },
    { name: 'Courts', path: '/courts' },
    { name: 'Memberships', path: '/memberships' },
    { name: 'Promotions', path: '/promotions' },
    { name: 'Shop & Cafe', path: '/shops' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#0F5132',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(15, 81, 50, 0.25)',
          }}>
            <Shield size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F5132', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              ClubSphere
            </span>
            <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Sports Club Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="public-nav-desktop">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0F5132' : '#4b5563',
                textDecoration: 'none',
                padding: '0.35rem 0.5rem',
                borderRadius: '6px',
                borderBottom: isActive ? '2px solid #0F5132' : '2px solid transparent',
                transition: 'all 0.15s ease',
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="public-actions-desktop">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                style={{
                  backgroundColor: '#0F5132',
                  color: '#ffffff',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <span>Dashboard</span>
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#0F5132',
                  border: '1.5px solid #0F5132',
                  backgroundColor: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                style={{
                  backgroundColor: '#0F5132',
                  color: '#ffffff',
                  border: '1px solid #0F5132',
                  padding: '0.5rem 1.15rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(15, 81, 50, 0.25)',
                }}
              >
                <Sparkles size={15} color="#D4AF37" />
                <span>Join / Free Trial</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#1f2937',
            cursor: 'pointer',
            padding: '4px',
          }}
          className="public-mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    backgroundColor: '#0F5132',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontWeight: 600,
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    border: '1.5px solid #0F5132',
                    color: '#0F5132',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    backgroundColor: '#0F5132',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Sign Up / 7-Day Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .public-nav-desktop, .public-actions-desktop {
            display: none !important;
          }
          .public-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
