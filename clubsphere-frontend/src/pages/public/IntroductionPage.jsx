import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Award,
  Users,
  QrCode,
  CalendarCheck,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  LogIn,
  UserPlus,
  Sparkles,
  Dumbbell,
  Clock,
  Coffee,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const IntroductionPage = () => {
  const { isAuthenticated, user, roles, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (roles.includes('ROLE_STAFF')) return '/staff/dashboard';
    return '/member/dashboard';
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#1f2937' }}>
      
      {/* 1. Header / Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb',
        padding: '0.85rem 2rem',
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                Sports Complex
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button onClick={() => scrollToSection('features')} style={{ fontSize: '0.925rem', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
              Features
            </button>
            <button onClick={() => scrollToSection('membership')} style={{ fontSize: '0.925rem', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
              Membership Plans
            </button>
            <button onClick={() => scrollToSection('facilities')} style={{ fontSize: '0.925rem', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
              Club Highlights
            </button>
            <button onClick={() => scrollToSection('demo')} style={{ fontSize: '0.925rem', fontWeight: 600, color: '#0F5132', cursor: 'pointer' }}>
              Demo Accounts
            </button>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="btn btn-primary" style={{ padding: '0.55rem 1.15rem' }}>
                  <span>Go to My Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
                <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.55rem 1rem' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.55rem 1.15rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserPlus size={16} />
                  <span>Join Club</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #072a18 0%, #0F5132 60%, #166534 100%)',
        color: '#ffffff',
        padding: '5rem 2rem 5.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#86efac',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} color="#facc15" /> PREMIER SPORTS CLUB & FITNESS COMPLEX
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            maxWidth: '960px',
            margin: '0 auto 1.5rem',
          }}>
            Welcome to <span style={{ color: '#fef08a' }}>ClubSphere</span> – Sports Club Management System
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '820px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            A unified digital ecosystem for athletic excellence. Seamlessly manage club memberships, certified coaching staff, daily attendance, digital QR turnstile passes, court reservations, and sports dining privileges.
          </p>

          {/* Prominent Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/register" className="btn btn-gold" style={{
              padding: '0.9rem 2rem',
              fontSize: '1.05rem',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <UserPlus size={20} />
              <span>Join Club / Register</span>
            </Link>

            <Link to="/login" style={{
              padding: '0.9rem 2rem',
              fontSize: '1.05rem',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#0F5132',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
            }}>
              <LogIn size={20} />
              <span>Sign In to Member Portal</span>
            </Link>
          </div>

          {/* Key Metric Counters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '1.75rem',
            backdropFilter: 'blur(8px)',
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fef08a' }}>1,200+</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>Active Club Members</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fef08a' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>Contactless QR Check-In</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fef08a' }}>15+</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>Certified Coaches & Staff</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fef08a' }}>3 Tiers</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>Gold, Silver & Junior Plans</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Modules & Features Section */}
      <section id="features" style={{ padding: '5rem 2rem', backgroundColor: '#f8faf9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              MANAGEMENT ARCHITECTURE
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', marginTop: '0.25rem' }}>
              Core Functional Modules
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Designed to power complete day-to-day operations with secure role-based control for Administrators, Staff, and Members.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Feature 1 */}
            <div className="cs-card" style={{ padding: '2rem', borderRadius: '14px', borderTop: '4px solid #0F5132' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Shield size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                1. Authentication & User Management
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Stateless JWT token authentication with BCrypt password hashing. Role-based routing directly to specialized portals (`Admin`, `Staff`, and `Member`).
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#0F5132" /> Full registration with phone & DOB verification</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#0F5132" /> User directory with role and status filters</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#0F5132" /> Profile editing and self-service password updates</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="cs-card" style={{ padding: '2rem', borderRadius: '14px', borderTop: '4px solid #D4AF37' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Award size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                2. Membership Management
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Tiered subscription lifecycles with automated validity calculation, expiry detection, and single-click membership renewals.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#D4AF37" /> Gold, Silver, and Junior (under 18) tiers</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#D4AF37" /> Automated sequential code: `CS-MEM-2026-XXXXX`</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#D4AF37" /> Dynamic admin pricing and duration management</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="cs-card" style={{ padding: '2rem', borderRadius: '14px', borderTop: '4px solid #0284c7' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Briefcase size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                3. Staff & Duty Operations
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Complete club human resources module featuring attendance punching, shift scheduling, and leave approvals.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#0284c7" /> Staff self-service portal & daily punch-in</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#0284c7" /> Leave application & admin review workflow</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#0284c7" /> Shift roster and monthly salary ledger</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="cs-card" style={{ padding: '2rem', borderRadius: '14px', borderTop: '4px solid #10b981' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <QrCode size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                4. Digital QR Membership Pass
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Cryptographic digital QR card generation for turnstile access, with single-click PNG pass download for mobile wallets.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#059669" /> Safe verification token embed</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#059669" /> Live validity status indicator</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#059669" /> Instant turnstile gate verification</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="cs-card" style={{ padding: '2rem', borderRadius: '14px', borderTop: '4px solid #8b5cf6' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ExternalLink size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                5. Inter-Module Team Integration
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                RESTful micro-endpoints exposing verification data to Swathi (Courts), Balaji (Shop/Cafe), and Anish (Finance).
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#7c3aed" /> Court booking member discount & booking window</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#7c3aed" /> Sports shop & cafe discount verification</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#7c3aed" /> Finance ledger transactions and KPI summary</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="cs-card" style={{ padding: '2rem', borderRadius: '14px', borderTop: '4px solid #f59e0b' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Dumbbell size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                6. Sports Facilities & Courts
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Championship tennis courts, badminton arenas, swimming complex, fitness gym, and Friday social play signups.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#d97706" /> Real-time court availability</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#d97706" /> Social mix-in game sessions</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#d97706" /> Free coaching trial booking requests</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Membership Plans Preview Section */}
      <section id="membership" style={{ padding: '5rem 2rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SELECT YOUR MEMBERSHIP
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', marginTop: '0.25rem' }}>
              Tailored Membership Tiers
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Choose a plan that fits your athletic lifestyle. All plans include automated digital QR gate pass generation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
            
            {/* Gold Tier */}
            <div style={{
              borderRadius: '16px',
              border: '2px solid #D4AF37',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.15)',
              padding: '2.5rem 2rem',
              position: 'relative',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{
                position: 'absolute',
                top: '-14px',
                right: '24px',
                backgroundColor: '#D4AF37',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '0.25rem 0.85rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                MOST POPULAR • VIP TIER
              </div>

              <div>
                <span style={{ color: '#b45309', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>VIP Full Access</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0.25rem 0 1rem' }}>Gold Membership</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F5132' }}>₹15,000</span>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>/ 365 Days (1 Year)</span>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Full VIP club privileges, complimentary court bookings, top tier shop & cafe discounts, and dedicated locker service.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> Unlimited Free Court Access</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> Priority 7-Day Advance Booking</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 15% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 10% Cafe & Bar Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> Digital QR Pass with PNG Download</li>
                </ul>
              </div>

              <Link to="/register" className="btn btn-gold" style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', textAlign: 'center' }}>
                Join as Gold Member
              </Link>
            </div>

            {/* Silver Tier */}
            <div style={{
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              padding: '2.5rem 2rem',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ color: '#6b7280', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Standard Tier</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0.25rem 0 1rem' }}>Silver Membership</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F5132' }}>₹8,000</span>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>/ 180 Days (6 Months)</span>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Regular court access, fitness center privileges, and sports club shop & cafe savings.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> Regular Court Reservations</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 3-Day Advance Booking Window</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 10% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 5% Cafe Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> Digital QR Pass with PNG Download</li>
                </ul>
              </div>

              <Link to="/register" className="btn btn-secondary" style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', textAlign: 'center' }}>
                Join as Silver Member
              </Link>
            </div>

            {/* Junior Tier */}
            <div style={{
              borderRadius: '16px',
              border: '1px solid #bae6fd',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.08)',
              padding: '2.5rem 2rem',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Youth Development</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0.25rem 0 1rem' }}>Junior Membership</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F5132' }}>₹5,000</span>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>/ 365 Days (&lt; 18 yrs)</span>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Subsidized youth membership designed for aspiring student athletes under 18 with dedicated coaching clinic access.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Age-Verified Youth Registration (&lt; 18)</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Junior Coaching Clinics & Drills</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Weekend Matchplay League Access</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> 5% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Digital QR Pass with PNG Download</li>
                </ul>
              </div>

              <Link to="/register" className="btn btn-secondary" style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', textAlign: 'center' }}>
                Join as Junior Member
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Viva Evaluation Sandbox / Demo Section */}
      <section id="demo" style={{ padding: '4.5rem 2rem', backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            COLLEGE PROJECT EVALUATION & VIVA SANDBOX
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F5132', marginBottom: '0.5rem' }}>
            Instant Viva Demonstration Accounts
          </h2>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto 2rem' }}>
            Test each role instantly. Click "Launch Sign In Portal" to test pre-seeded profiles:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#0F5132', fontSize: '1rem', marginBottom: '4px' }}>🛡️ Administrator</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Email: <code style={{ color: '#111827', fontWeight: 600 }}>admin@clubsphere.com</code></div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Password: <code style={{ color: '#111827', fontWeight: 600 }}>Admin@123</code></div>
              <div style={{ fontSize: '0.75rem', color: '#0F5132', marginTop: '6px', fontWeight: 500 }}>Full CRUD, Staff, Leaves, Plans & Integration Hub</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#0284c7', fontSize: '1rem', marginBottom: '4px' }}>👔 Staff (Coach Rahul)</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Email: <code style={{ color: '#111827', fontWeight: 600 }}>coach.rahul@clubsphere.com</code></div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Password: <code style={{ color: '#111827', fontWeight: 600 }}>Staff@123</code></div>
              <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '6px', fontWeight: 500 }}>Staff Portal, Punch In, Shifts & Leave Application</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#b45309', fontSize: '1rem', marginBottom: '4px' }}>⭐ Member (Vikram Singh)</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Email: <code style={{ color: '#111827', fontWeight: 600 }}>vikram.singh@example.com</code></div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Password: <code style={{ color: '#111827', fontWeight: 600 }}>Member@123</code></div>
              <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '6px', fontWeight: 500 }}>Active Gold Plan, QR Digital Pass with PNG Download</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#059669', fontSize: '1rem', marginBottom: '4px' }}>🎾 Junior Member (Aarav)</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Email: <code style={{ color: '#111827', fontWeight: 600 }}>aarav.mehta@example.com</code></div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Password: <code style={{ color: '#111827', fontWeight: 600 }}>Member@123</code></div>
              <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '6px', fontWeight: 500 }}>Youth Athlete (&lt; 18) Junior Membership</div>
            </div>

          </div>

          <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '10px' }}>
            <span>Go to Sign In Portal</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 6. Footer */}
      <footer style={{ backgroundColor: '#072a18', color: '#9ca3af', padding: '3.5rem 2rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#0F5132',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <Shield size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>ClubSphere</span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#86efac' }}>Sports Club Management System</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <Link to="/login" style={{ color: '#e5e7eb', hover: { color: '#ffffff' } }}>Member Login</Link>
            <Link to="/register" style={{ color: '#e5e7eb' }}>Register Account</Link>
            <Link to="/forgot-password" style={{ color: '#e5e7eb' }}>Reset Password</Link>
          </div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '1.5rem auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
          <div>&copy; 2026 ClubSphere. College B.Tech Project. All rights reserved.</div>
          <div style={{ color: '#86efac', fontWeight: 500 }}>
            Developed by Riya Kumari (Auth, Memberships, Staff, Inter-Module APIs)
          </div>
        </div>
      </footer>

    </div>
  );
};
