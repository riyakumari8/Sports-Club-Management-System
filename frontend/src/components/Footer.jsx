import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Award, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a291e', color: '#f8fafc', padding: '64px 0 32px', marginTop: 80, borderTop: '4px solid #10b981' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand info */}
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              ClubSphere <span style={{ width: 8, height: 8, backgroundColor: '#10b981', borderRadius: '50%' }}></span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20 }}>
              The digital backbone of premier sports clubs. Seamless court reservations, world-class tennis and cricket facilities, and vibrant community social play.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <span className="badge badge-success" style={{ textTransform: 'none', fontSize: '0.8rem' }}>
                <Award size={13} /> Certified Academy
              </span>
              <span className="badge badge-primary" style={{ textTransform: 'none', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <ShieldCheck size={13} /> Secure Platform
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: 18 }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li><Link to="/facilities" style={{ transition: 'color 0.2s' }}>Tennis & Cricket Courts</Link></li>
              <li><Link to="/availability">Real-Time Availability</Link></li>
              <li><Link to="/social-play">Friday Social Play</Link></li>
              <li><Link to="/membership-plans">Gold & Silver Memberships</Link></li>
              <li><Link to="/shop">Pro Sports Shop Preview</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Club Timings */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: 18 }}>Operating Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Clock size={18} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong>Courts & Practice Nets:</strong>
                  <div>Monday – Sunday: 6:00 AM – 10:00 PM</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Clock size={18} color="#d97706" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong>Friday Social Play:</strong>
                  <div>Every Friday: 6:00 PM – 9:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: 18 }}>Club Location</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <MapPin size={18} color="#10b981" style={{ flexShrink: 0 }} />
                <span>Sector 4, Champions Sports Enclave, Bengaluru, Karnataka 560034</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Phone size={18} color="#10b981" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210 / 080-4567890</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Mail size={18} color="#10b981" style={{ flexShrink: 0 }} />
                <span>frontdesk@clubsphere.sports.in</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.85rem', color: '#64748b' }}>
          <div>© {new Date().getFullYear()} ClubSphere Sports Club Management System. Developed by Swathi Challakonda.</div>
          <div>B.Tech Final Project | Integrated with Riya, Balaji & Anish modules</div>
        </div>
      </div>
    </footer>
  );
}
