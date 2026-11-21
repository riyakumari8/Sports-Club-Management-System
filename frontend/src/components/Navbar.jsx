import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, Shield, User, ShoppingBag, 
  HelpCircle, ChevronDown, CheckCircle2, Clock
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(false);
  const [memberTier, setMemberTier] = useState('SILVER');

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <span>ClubSphere</span>
          <span className="brand-dot"></span>
        </Link>

        {/* Public & Member Nav */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/facilities" className={`nav-link ${isActive('/facilities') ? 'active' : ''}`}>
              Facilities
            </Link>
          </li>
          <li>
            <Link to="/availability" className={`nav-link ${isActive('/availability') ? 'active' : ''}`}>
              Availability
            </Link>
          </li>
          <li>
            <Link to="/social-play" className={`nav-link ${isActive('/social-play') ? 'active' : ''}`}>
              Friday Social Play
            </Link>
          </li>
          <li>
            <Link to="/membership-plans" className={`nav-link ${isActive('/membership-plans') ? 'active' : ''}`}>
              Memberships
            </Link>
          </li>
          <li>
            <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
              Contact
            </Link>
          </li>

          {/* Member Bookings Button */}
          <li>
            <Link to="/my-bookings" className="btn btn-outline btn-sm">
              <Calendar size={15} /> My Bookings
            </Link>
          </li>

          {/* Book Now Primary Button */}
          <li>
            <Link to="/book" className="btn btn-primary btn-sm">
              Book Court
            </Link>
          </li>

          {/* Admin / Desk Dropdown */}
          <li style={{ position: 'relative' }}>
            <button 
              onClick={() => setAdminOpen(!adminOpen)} 
              className="btn btn-sm"
              style={{ background: '#f1f5f9', color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Shield size={14} /> Admin / Desk <ChevronDown size={14} />
            </button>

            {adminOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: 8,
                  width: 220,
                  background: '#ffffff',
                  borderRadius: 12,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: 8,
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <Link 
                  to="/admin/check-in" 
                  onClick={() => setAdminOpen(false)}
                  style={{ padding: '8px 12px', borderRadius: 6, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}
                >
                  <CheckCircle2 size={16} color="#10b981" /> QR Check-In Desk
                </Link>
                <Link 
                  to="/admin/courts" 
                  onClick={() => setAdminOpen(false)}
                  style={{ padding: '8px 12px', borderRadius: 6, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}
                >
                  <Clock size={16} color="#d97706" /> Court Management
                </Link>
                <Link 
                  to="/admin/all-bookings" 
                  onClick={() => setAdminOpen(false)}
                  style={{ padding: '8px 12px', borderRadius: 6, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}
                >
                  <Calendar size={16} color="#2563eb" /> All Club Bookings
                </Link>
                <Link 
                  to="/admin/enquiries" 
                  onClick={() => setAdminOpen(false)}
                  style={{ padding: '8px 12px', borderRadius: 6, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}
                >
                  <User size={16} color="#8b5cf6" /> Enquiry CRM Pipeline
                </Link>
                <Link 
                  to="/admin/trials" 
                  onClick={() => setAdminOpen(false)}
                  style={{ padding: '8px 12px', borderRadius: 6, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}
                >
                  <HelpCircle size={16} color="#059669" /> Trial Session Requests
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
