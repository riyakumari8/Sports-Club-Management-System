import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Phone, Mail, Clock, Lock } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer style={{ backgroundColor: '#072a18', color: '#9ca3af', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '3rem',
        }}>
          
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#0F5132',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.4)',
              }}>
                <Shield size={22} color="#D4AF37" />
              </div>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', display: 'block' }}>
                  ClubSphere
                </span>
                <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sports Complex & Club
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#d1d5db', marginBottom: '1.25rem' }}>
              A state-of-the-art sports management ecosystem offering Olympic-grade courts, certified professional coaching, 100% digital QR turnstiles, social play leagues, and premium athletic perks.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '0.35rem 0.75rem', borderRadius: '6px', color: '#fef08a', fontSize: '0.78rem', fontWeight: 600 }}>
              <span>★</span> 7-Day Free Trial Available for Students
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explore ClubSphere
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/about" style={{ color: '#d1d5db', textDecoration: 'none' }}>About the Complex</Link></li>
              <li><Link to="/sports" style={{ color: '#d1d5db', textDecoration: 'none' }}>Sports & Programs</Link></li>
              <li><Link to="/courts" style={{ color: '#d1d5db', textDecoration: 'none' }}>Court Booking & Rates</Link></li>
              <li><Link to="/memberships" style={{ color: '#d1d5db', textDecoration: 'none' }}>Membership Plans</Link></li>
              <li><Link to="/promotions" style={{ color: '#d1d5db', textDecoration: 'none' }}>Special Student Offers</Link></li>
              <li><Link to="/shops" style={{ color: '#d1d5db', textDecoration: 'none' }}>Pro Sports Shop & Cafe</Link></li>
              <li><Link to="/contact" style={{ color: '#d1d5db', textDecoration: 'none' }}>Contact & Directions</Link></li>
            </ul>
          </div>

          {/* Col 3: Sports & Facilities */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Facilities & Courts
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li style={{ color: '#d1d5db' }}>Court 1 & 2: Synthetic Hard Tennis</li>
              <li style={{ color: '#d1d5db' }}>Court 3 & 4: Wooden Badminton Arena</li>
              <li style={{ color: '#d1d5db' }}>Court 5: Glass-Back Squash Court</li>
              <li style={{ color: '#d1d5db' }}>Court 6: Natural Clay Tennis Court</li>
              <li style={{ color: '#d1d5db' }}>Olympic Swimming Complex (50m)</li>
              <li style={{ color: '#d1d5db' }}>Strength & Conditioning Gymnasium</li>
              <li style={{ color: '#d1d5db' }}>Friday Social Mix-In Nights (7 PM)</li>
            </ul>
          </div>

          {/* Col 4: Timings & Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hours & Location
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#d1d5db' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Clock size={16} color="#86efac" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>Mon – Fri: 6:00 AM – 10:00 PM</div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Sat – Sun: 7:00 AM – 9:00 PM</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#86efac" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>ClubSphere Sports Complex, University North Campus, Sector 62</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#86efac" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210 / Front Desk Ext. 101</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#86efac" style={{ flexShrink: 0 }} />
                <span>support@clubsphere.edu</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
        }}>
          <div>
            &copy; 2026 ClubSphere Sports Club Management System. College B.Tech Capstone Project.
          </div>

          {/* Evaluator discreet login portals */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ color: '#6b7280' }}>Dedicated Portals:</span>
            <Link
              to="/staff/login"
              style={{
                color: '#9ca3af',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#86efac')}
              onMouseLeave={(e) => (e.target.style.color = '#9ca3af')}
            >
              <Lock size={12} /> Staff Login
            </Link>
            <Link
              to="/admin/login"
              style={{
                color: '#9ca3af',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#86efac')}
              onMouseLeave={(e) => (e.target.style.color = '#9ca3af')}
            >
              <Lock size={12} /> Admin Login
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
