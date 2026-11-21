import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Check, Sparkles, HelpCircle } from 'lucide-react';
import { getPublicMembershipPlans } from '../services/api';

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicMembershipPlans().then(res => {
      setPlans(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>
            <Award size={13} /> Integrated Membership Portal
          </span>
          <h1 className="title-serif" style={{ fontSize: '2.8rem', color: '#0f3e2e', marginBottom: 16 }}>
            ClubSphere Membership Plans
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Select the membership tier that fits your athletic lifestyle. Enjoy exclusive court booking privileges, heavy discounts, and priority entry.
          </p>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            Loading membership tiers...
          </div>
        ) : (
          <div className="grid-3" style={{ marginBottom: 64 }}>
            {plans.map(p => (
              <div 
                key={p.id} 
                className="card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  border: p.tier === 'GOLD' ? '2.5px solid #d97706' : '1px solid #e2e8f0',
                  boxShadow: p.tier === 'GOLD' ? '0 12px 30px rgba(217, 119, 6, 0.15)' : 'none',
                  position: 'relative',
                  padding: 32
                }}
              >
                {p.badge && (
                  <span 
                    className="badge"
                    style={{ 
                      position: 'absolute', top: -14, right: 28, 
                      backgroundColor: p.tier === 'GOLD' ? '#d97706' : '#0f3e2e', 
                      color: '#ffffff',
                      padding: '6px 14px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 6 }}>{p.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: 20 }}>{p.highlight}</p>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 24 }}>{p.price}</div>
                  
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32, fontSize: '0.92rem' }}>
                    {p.features?.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#334155' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to={`/contact?plan=${p.tier}`} 
                  className={`btn ${p.tier === 'GOLD' ? 'btn-accent' : 'btn-outline'}`}
                  style={{ width: '100%', padding: '14px' }}
                >
                  Enquire for {p.name}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Guest Booking Comparison */}
        <div className="card" style={{ background: '#f8fafc', padding: 32, textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 8 }}>
            Not ready for a membership? Play as a Guest!
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 20, maxWidth: 640, margin: '0 auto 20px' }}>
            Guests can book courts at standard rack rates with up to 24 hours advance notice. Full locker room access and cafeteria service included.
          </p>
          <Link to="/book" className="btn btn-primary btn-sm">
            Book Court as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
