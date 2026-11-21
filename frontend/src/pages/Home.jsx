import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, ShieldCheck, Trophy, 
  Users, ChevronRight, Star, ArrowRight, Activity, Award
} from 'lucide-react';
import { getPublicFacilities, getPublicMembershipPlans, getPublicTestimonials } from '../services/api';

export default function Home() {
  const [facilities, setFacilities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getPublicFacilities().then(res => setFacilities(res.data.slice(0, 3))).catch(() => {});
    getPublicMembershipPlans().then(res => setPlans(res.data)).catch(() => {});
    getPublicTestimonials().then(res => setTestimonials(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        {/* Subtle decorative tennis court doodle lines in background */}
        <div className="hero-court-doodle" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M 50 350 L 550 350" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="3" strokeDasharray="10 10" />
            <path d="M 120 50 L 120 350" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
            <path d="M 480 50 L 480 350" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
            <path d="M 300 50 L 300 350" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
            <circle cx="300" cy="200" r="50" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="2" />
          </svg>
        </div>

        <div className="container hero-container">
          {/* Left Column: Existing content kept completely intact */}
          <div className="hero-content">
            <div className="hero-pill">
              <Trophy size={14} color="#10b981" /> Official Champions Sports Club Platform
            </div>
            <h1 className="hero-title title-serif">
              Master the Game.<br />
              Reserve Your Court in Seconds.
            </h1>
            <p className="hero-desc">
              ClubSphere unites championship-grade tennis courts, professional cricket ovals, and automated bowling machine nets with real-time 30-minute slot scheduling, member perks, and Friday Social Play.
            </p>
            <div className="hero-cta">
              <Link to="/book" className="btn btn-accent" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                <Calendar size={18} /> Book a Court Now
              </Link>
              <Link to="/availability" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
                <Clock size={18} /> Check Live Availability
              </Link>
            </div>
          </div>

          {/* Right Column: Cleaned Tennis Photograph with creative floating cards */}
          <div className="hero-media-wrapper">
            <div className="hero-image-card">
              <img 
                src="/images/clubsphere-tennis-hero.webp" 
                alt="Championship Tennis Court and Equipment" 
                className="hero-tennis-img"
              />
              
              {/* Creative Floating Badge 1: Championship Courts */}
              <div className="floating-badge badge-top-right">
                <span className="floating-badge-icon pulse-dot">🎾</span>
                <div>
                  <div className="floating-badge-title">Championship Courts</div>
                  <div className="floating-badge-subtitle">Plexipave & Red Clay</div>
                </div>
              </div>

              {/* Creative Floating Badge 2: Staggered Slots */}
              <div className="floating-badge badge-bottom-left">
                <span className="floating-badge-icon pulse-dot">⚡</span>
                <div>
                  <div className="floating-badge-title">30-Min Staggered Slots</div>
                  <div className="floating-badge-subtitle">100% Conflict-Proof</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '24px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f3e2e' }}>6+ Courts</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Championship Clay, Turf & Indoor</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f3e2e' }}>30-Min</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Staggered Overlap-Proof Slots</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f3e2e' }}>100% Digital</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Instant QR Check-In Desk</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f3e2e' }}>Friday Social</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Weekly Community Mixer Play</div>
          </div>
        </div>
      </section>

      {/* Featured Courts */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 8 }}>World-Class Facilities</span>
              <h2 className="title-serif" style={{ fontSize: '2.4rem', color: '#0f3e2e' }}>Featured Playing Courts</h2>
            </div>
            <Link to="/facilities" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              View All Facilities <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-3">
            {facilities.map(court => (
              <div key={court.courtId} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 210, position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={court.imageUrl || 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600'} 
                    alt={court.courtName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span 
                    className="badge" 
                    style={{ 
                      position: 'absolute', top: 12, left: 12, 
                      backgroundColor: court.sportType === 'TENNIS' ? '#0f3e2e' : '#b45309', 
                      color: '#ffffff' 
                    }}
                  >
                    {court.sportType}
                  </span>
                  <span 
                    className={`badge ${court.courtStatus === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}
                    style={{ position: 'absolute', top: 12, right: 12 }}
                  >
                    {court.courtStatus.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: '#0f3e2e' }}>{court.courtName}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: 16, lineHeight: 1.5 }}>
                      {court.courtDescription ? court.courtDescription.substring(0, 95) + '...' : 'Championship grade court with night floodlights and daily maintenance.'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 12, marginBottom: 16 }}>
                      <span><strong>Surface:</strong> {court.surfaceType || 'Hard Court'}</span>
                      <span><strong>Hours:</strong> {court.openingTime.substring(0,5)} - {court.closingTime.substring(0,5)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f3e2e' }}>₹ {court.standardHourlyRate}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Member rate / hr</div>
                    </div>
                    <Link to={`/book?courtId=${court.courtId}`} className="btn btn-primary btn-sm">
                      Book Slot
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Friday Social Play Feature Callout */}
      <section style={{ backgroundColor: '#0f3e2e', color: '#ffffff', padding: '80px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: 12 }}>Every Friday Night • 6 PM - 9 PM</span>
            <h2 className="title-serif" style={{ fontSize: '2.5rem', marginBottom: 20 }}>Friday Social Play</h2>
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: 24 }}>
              Join fellow club members and guests for our weekly doubles rotation and social cricket innings. No fixed partner needed—drop in, share the court, play friendly matches, and unwind at the club lounge.
            </p>
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>16 Players</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Session Capacity</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>₹ 150</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Per Participant</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>3 Hours</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Continuous Play</div>
              </div>
            </div>
            <Link to="/social-play" className="btn btn-accent" style={{ padding: '12px 24px' }}>
              <Users size={16} /> View & Join Upcoming Sessions
            </Link>
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
            <img 
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800" 
              alt="Friday Social Play"
              style={{ width: '100%', height: 380, objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Membership Tiers Preview */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span className="badge badge-primary" style={{ marginBottom: 8 }}>Member Privileges</span>
            <h2 className="title-serif" style={{ fontSize: '2.4rem', color: '#0f3e2e' }}>Choose Your Membership Plan</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Enjoy heavily discounted or completely free court reservations, priority booking windows, pro shop discounts, and lounge access.
            </p>
          </div>

          <div className="grid-3">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className="card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  border: plan.tier === 'GOLD' ? '2px solid #d97706' : '1px solid #e2e8f0',
                  position: 'relative'
                }}
              >
                {plan.badge && (
                  <span 
                    className="badge"
                    style={{ 
                      position: 'absolute', top: -12, right: 24, 
                      backgroundColor: plan.tier === 'GOLD' ? '#d97706' : '#0f3e2e', 
                      color: '#ffffff' 
                    }}
                  >
                    {plan.badge}
                  </span>
                )}
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 8 }}>{plan.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: 16 }}>{plan.highlight}</p>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 24 }}>{plan.price}</div>
                  
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, fontSize: '0.9rem' }}>
                    {plan.features?.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#334155' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/contact" className={`btn ${plan.tier === 'GOLD' ? 'btn-accent' : 'btn-outline'}`} style={{ width: '100%' }}>
                  Enquire for {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="badge badge-success" style={{ marginBottom: 8 }}>Player Stories</span>
            <h2 className="title-serif" style={{ fontSize: '2.2rem', color: '#0f3e2e' }}>Loved by Members & Pros</h2>
          </div>
          <div className="grid-3">
            {testimonials.map(t => (
              <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: '#334155', fontStyle: 'italic', marginBottom: 20, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "{t.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f3e2e' }}>{t.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
