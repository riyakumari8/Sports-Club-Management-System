import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { discoveryService } from '../../services/discoveryService';
import {
  Shield,
  Award,
  Users,
  QrCode,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Dumbbell,
  Clock,
  Coffee,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
  Copy,
  Check,
  Zap,
  MapPin,
  Star,
  UserCheck,
  HelpCircle,
  Key,
} from 'lucide-react';

export const IntroductionPage = () => {
  const { isAuthenticated, roles, login } = useAuth();
  const navigate = useNavigate();

  // State
  const [promotions, setPromotions] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxError, setSandboxError] = useState('');

  useEffect(() => {
    // Fetch live promotions from backend
    discoveryService.getActivePromotions()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPromotions(data.slice(0, 3));
        } else {
          // Fallback static
          setPromotions([
            { id: 1, promoCode: 'WELCOME50', title: 'New Member 50% Off', description: 'Get 50% discount on first month gym & court access.', discountPercentage: 50, bannerTag: 'STUDENT SPECIAL', validUntil: '2026-12-31' },
            { id: 2, promoCode: 'SUMMERSPORTS', title: 'Summer Season Pass', description: 'Flat 20% off on all annual membership tiers.', discountPercentage: 20, bannerTag: 'LIMITED TIME', validUntil: '2026-06-30' },
            { id: 3, promoCode: 'COURT10', title: 'Weekday Off-Peak 10% Off', description: 'Special pricing on morning court reservations.', discountPercentage: 10, bannerTag: 'HOURLY PASS', validUntil: '2026-08-31' },
          ]);
        }
      })
      .catch(() => {
        setPromotions([
          { id: 1, promoCode: 'WELCOME50', title: 'New Member 50% Off', description: 'Get 50% discount on first month gym & court access.', discountPercentage: 50, bannerTag: 'STUDENT SPECIAL', validUntil: '2026-12-31' },
          { id: 2, promoCode: 'SUMMERSPORTS', title: 'Summer Season Pass', description: 'Flat 20% off on all annual membership tiers.', discountPercentage: 20, bannerTag: 'LIMITED TIME', validUntil: '2026-06-30' },
          { id: 3, promoCode: 'COURT10', title: 'Weekday Off-Peak 10% Off', description: 'Special pricing on morning court reservations.', discountPercentage: 10, bannerTag: 'HOURLY PASS', validUntil: '2026-08-31' },
        ]);
      });
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSandboxLogin = async (username, password, redirectPath) => {
    setSandboxLoading(true);
    setSandboxError('');
    try {
      await login({ email: username, username, password });
      setShowSandbox(false);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setSandboxError(err.response?.data?.message || err.message || 'Login failed. Please check backend status.');
    } finally {
      setSandboxLoading(false);
    }
  };

  const sportsList = [
    { name: 'Tennis', courts: '3 Courts (Synthetic & Clay)', icon: '🎾', desc: 'Olympic standard championship tennis courts with floodlighting and ball machines.', tag: 'Outdoor / Indoor' },
    { name: 'Badminton', courts: '2 Courts (Teak Hardwood)', icon: '🏸', desc: 'BWF certified wooden flooring, anti-glare LED illumination and Yonex nets.', tag: 'Indoor Arena' },
    { name: 'Squash', courts: '1 Court (ASB Glass-Back)', icon: '⚪', desc: 'Full WSF regulation glass-back squash court with high rebound front wall.', tag: 'Air Conditioned' },
    { name: 'Swimming', courts: '50m Olympic Pool', icon: '🏊', desc: 'Temperature-controlled 8-lane racing pool with certified water safety lifeguards.', tag: 'Aquatics Complex' },
    { name: 'Fitness Gym', courts: 'Strength & Cardio Center', icon: '🏋️', desc: 'Equipped with Hammer Strength, LifeFitness machines and free weights.', tag: 'Health Club' },
    { name: 'Yoga & Aerobics', courts: 'Multi-Activity Studio', icon: '🧘', desc: 'Quiet mirrored studio for mindful meditation, pilates and calisthenics classes.', tag: 'Wellness Studio' },
  ];

  const faqs = [
    {
      q: 'How does the 7-Day Free Trial work for college students?',
      a: 'Any newly registered student gets immediate 1-click access to activate a 7-day all-inclusive club trial. It grants full court booking privileges and member pricing at the cafe with zero payment upfront. Only one trial is permitted per student profile.'
    },
    {
      q: 'What is the "One Active Membership" rule?',
      a: 'To guarantee strict fairness in court scheduling and student benefits, each account can have only ONE active membership at any time. When purchasing an upgrade (e.g. Silver to Gold), your previous membership is transitioned to SUPERSEDED status with validity automatically updated.'
    },
    {
      q: 'Can I bring a guest or fellow student to play?',
      a: 'Yes! Gold members receive 4 complimentary monthly guest passes. Silver members can invite guests with a nominal guest green fee of ₹150 payable at the turnstile front desk.'
    },
    {
      q: 'How do turnstiles and digital QR check-in work?',
      a: 'Every member has a live, encrypted QR card generated directly in their portal. Simply flash your phone at the front-desk scanner or turnstile camera for contactless instantaneous entry.'
    },
    {
      q: 'What is Friday Social Mix-In Play?',
      a: 'Every Friday from 6:00 PM to 8:30 PM, the club hosts casual social doubles mix-in sessions for Badminton and Tennis. Players of all skill levels are paired dynamically, followed by cafe refreshments.'
    },
    {
      q: 'Are coaching clinics available for beginners?',
      a: 'Absolutely. We offer certified NIS and ITF coaches for individual lessons and weekend group drills across Tennis, Badminton, Swimming, and Strength Training.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#1f2937' }}>
      
      {/* 1. Header Navigation */}
      <PublicNavbar />

      {/* 2. Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #072a18 0%, #0F5132 60%, #166534 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem 5.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,81,50,0.4) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            padding: '0.4rem 1.15rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#86efac',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} color="#D4AF37" /> PREMIER UNIVERSITY SPORTS COMPLEX & FITNESS CLUB
          </div>

          <h1 style={{
            fontSize: 'clamp(2.3rem, 5.5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '1000px',
            margin: '0 auto 1.5rem',
          }}>
            Elevate Your Athletic Journey with <span style={{ color: '#fef08a' }}>ClubSphere</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.92)',
            maxWidth: '840px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.65,
          }}>
            A unified digital ecosystem for students, faculty, and athletes. Book Olympic courts in real-time, pass through QR turnstiles seamlessly, train with certified coaches, and claim your exclusive 7-day free trial today.
          </p>

          {/* Primary Call-to-Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link
              to="/signup"
              style={{
                backgroundColor: '#D4AF37',
                color: '#072a18',
                padding: '0.95rem 2rem',
                fontSize: '1.05rem',
                fontWeight: 800,
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                transition: 'transform 0.2s',
              }}
            >
              <Zap size={20} />
              <span>Claim 7-Day Free Trial</span>
            </Link>

            <Link
              to="/sports"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                padding: '0.95rem 1.85rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '10px',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <Dumbbell size={18} />
              <span>Explore Sports</span>
            </Link>

            <Link
              to="/memberships"
              style={{
                backgroundColor: '#ffffff',
                color: '#0F5132',
                padding: '0.95rem 1.85rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
              }}
            >
              <Award size={18} />
              <span>Membership Plans</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1050px',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '16px',
            padding: '1.75rem',
            backdropFilter: 'blur(10px)',
          }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fef08a' }}>6 Courts</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>Tennis, Badminton & Squash</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fef08a' }}>100% Digital</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>QR Gate Passes & Turnstiles</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fef08a' }}>5 Coaches</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>NIS & ITF Certified Staff</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fef08a' }}>7 Days</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>Instant Free Student Trial</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Sports Category Bar */}
      <section style={{ backgroundColor: '#073b22', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          color: '#ffffff',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          <span style={{ color: '#D4AF37', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>QUICK DISCIPLINES:</span>
          <Link to="/sports" style={{ color: '#e5e7eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>🎾 Lawn Tennis</Link>
          <Link to="/sports" style={{ color: '#e5e7eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>🏸 Badminton</Link>
          <Link to="/sports" style={{ color: '#e5e7eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>⚪ Squash</Link>
          <Link to="/sports" style={{ color: '#e5e7eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>🏊 Olympic Swimming</Link>
          <Link to="/sports" style={{ color: '#e5e7eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>🏋️ Gymnasium</Link>
          <Link to="/sports" style={{ color: '#e5e7eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>🧘 Yoga Studio</Link>
        </div>
      </section>

      {/* 4. About the Club Snippet */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#fcfdfd' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ABOUT CLUBSPHERE
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', margin: '0.4rem 0 1rem', lineHeight: 1.25 }}>
              Empowering Student Athletes with World-Class Infrastructure
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              ClubSphere is the premier sports and recreation pavilion dedicated to collegiate fitness, inter-college athletic competitions, and recreational student well-being. Spanning across 12 acres of floodlit courts and climate-controlled sports arenas, we bring together students, faculty, and certified fitness coaches under a transparent digital umbrella.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Our automated gate management eliminates paper logbooks, guarantees single-active membership policies, and gives players live visibility into court reservations and locker allocation.
            </p>
            <Link to="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0F5132', fontWeight: 700, textDecoration: 'none' }}>
              <span>Read Full Club History & Facilities</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #bbf7d0',
            borderRadius: '20px',
            padding: '2.5rem',
            boxShadow: '0 10px 25px rgba(15, 81, 50, 0.05)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F5132', marginBottom: '1.25rem' }}>
              Campus Athletic Highlights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={20} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>12 Acres Floodlit Complex</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Play late into the evening under 500-lux stadium LED illumination.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={20} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>Strict 1-Member 1-Pass Policy</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Guaranteed fair court slots and verified non-transferable turnstile security.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={20} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>In-House Pro Shop & Health Cafe</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Discounted equipment stringing, gear rental, and fresh protein shakes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Sports Grid */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#f8faf9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              DISCIPLINES & ARENAS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Featured Sports Programs
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Explore individual court specs, playing surfaces, and reserve your practice slot.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {sportsList.map((sport, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  padding: '1.75rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.4rem' }}>{sport.icon}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#d1e7dd', color: '#0F5132', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      {sport.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                    {sport.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F5132', marginBottom: '0.75rem' }}>
                    {sport.courts}
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {sport.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                  <Link to="/courts" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F5132', textDecoration: 'none' }}>
                    View Court Schedule →
                  </Link>
                  <Link to="/signup" style={{ fontSize: '0.82rem', fontWeight: 600, backgroundColor: '#f0fdf4', color: '#0F5132', border: '1px solid #bbf7d0', padding: '0.35rem 0.75rem', borderRadius: '6px', textDecoration: 'none' }}>
                    Trial Play
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Prominent 7-Day Free Trial Banner */}
      <section style={{
        background: 'linear-gradient(90deg, #D4AF37 0%, #b45309 100%)',
        color: '#ffffff',
        padding: '3.5rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Flame size={16} color="#fef08a" /> EXCLUSIVE STUDENT INTRODUCTORY PERK
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.2 }}>
              Experience ClubSphere Free for 7 Full Days
            </h2>
            <p style={{ fontSize: '1rem', color: '#fef3c7', maxWidth: '650px', lineHeight: 1.6 }}>
              No credit card required. Register with your university email or phone, verify OTP, and get 7 days of complimentary court bookings, gym access, and members-only cafe privileges!
            </p>
          </div>
          <Link
            to="/signup"
            style={{
              backgroundColor: '#072a18',
              color: '#ffffff',
              padding: '1rem 2.2rem',
              fontSize: '1.1rem',
              fontWeight: 800,
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Activate 7-Day Trial</span>
            <ArrowRight size={20} color="#D4AF37" />
          </Link>
        </div>
      </section>

      {/* 7. Court Showcase */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              OUR FACILITIES
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              State-of-the-Art Courts Showcase
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              All 6 courts are equipped with electronic scoreboard integration and instant booking capabilities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[
              { id: 1, name: 'Court 1 - Championship Tennis', sport: 'Tennis', surface: 'Synthetic Hard Court', type: 'Outdoor • Floodlit', price: '₹400/hr (Free for Gold)' },
              { id: 2, name: 'Court 2 - Practice Tennis', sport: 'Tennis', surface: 'Synthetic Hard Court', type: 'Outdoor • Floodlit', price: '₹350/hr (Free for Gold)' },
              { id: 3, name: 'Court 3 - Badminton Arena A', sport: 'Badminton', surface: 'Teak Hardwood BWF', type: 'Indoor • AC Arena', price: '₹300/hr (Free for Gold)' },
              { id: 4, name: 'Court 4 - Badminton Arena B', sport: 'Badminton', surface: 'Teak Hardwood BWF', type: 'Indoor • AC Arena', price: '₹300/hr (Free for Gold)' },
              { id: 5, name: 'Court 5 - Glass-Back Squash', sport: 'Squash', surface: 'WSF Plaster & Glass', type: 'Indoor • AC Court', price: '₹350/hr (Free for Gold)' },
              { id: 6, name: 'Court 6 - Clay Tennis Court', sport: 'Tennis', surface: 'Natural Red Clay', type: 'Outdoor • Slow Pace', price: '₹450/hr (Free for Gold)' },
            ].map((court) => (
              <div key={court.id} style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F5132', backgroundColor: '#d1e7dd', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {court.sport}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{court.type}</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>
                  {court.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                  Surface: <strong style={{ color: '#374151' }}>{court.surface}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F5132' }}>{court.price}</span>
                  <Link to="/courts" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', textDecoration: 'none' }}>
                    Book Court →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Membership Plans Preview */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#f8faf9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SELECT YOUR PASS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Flexible Student Membership Tiers
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              One active membership per student at a time. Easy upgrades with automated prorated credit.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
            {/* Gold Tier */}
            <div style={{
              borderRadius: '16px',
              border: '2px solid #D4AF37',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.15)',
              padding: '2.5rem 2rem',
              backgroundColor: '#ffffff',
              position: 'relative',
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
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '0.25rem 0.85rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
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
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 100% Free Unlimited Court Bookings</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 7-Day Advance Priority Booking</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 15% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 10% Club Cafe Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 4 Free Guest Passes per Month</li>
                </ul>
              </div>
              <Link to="/signup" style={{ backgroundColor: '#D4AF37', color: '#ffffff', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
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
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 50% Off Court Booking Fees</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 3-Day Advance Booking Window</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 10% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 5% Club Cafe Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> Digital QR Gate Access</li>
                </ul>
              </div>
              <Link to="/signup" style={{ backgroundColor: '#0F5132', color: '#ffffff', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
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
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Age-Verified Youth Subsidized Rate</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> 30% Off Court Booking Fees</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Weekend Coaching Clinic Access</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> 5% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Digital QR Gate Pass</li>
                </ul>
              </div>
              <Link to="/signup" style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                Join as Junior Member
              </Link>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/memberships" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F5132', fontWeight: 700, textDecoration: 'none' }}>
              <span>Compare All Plan Details & Multi-Year Options</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Current Promotions Grid */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SPECIAL DEALS
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
                Active Student Discounts & Coupons
              </h2>
            </div>
            <Link to="/promotions" style={{ color: '#0F5132', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View All 10 Promotions</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {promotions.map((promo) => (
              <div
                key={promo.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '1.75rem',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}>
                  {promo.bannerTag || 'HOT DEAL'}
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F5132', marginBottom: '0.25rem' }}>
                  {promo.discountPercentage}% OFF
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                  {promo.title}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {promo.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block' }}>PROMO CODE</span>
                    <strong style={{ fontSize: '1.1rem', letterSpacing: '0.05em', color: '#0F5132' }}>{promo.promoCode}</strong>
                  </div>
                  <button
                    onClick={() => handleCopyCode(promo.promoCode)}
                    style={{
                      backgroundColor: copiedCode === promo.promoCode ? '#0F5132' : '#ffffff',
                      color: copiedCode === promo.promoCode ? '#ffffff' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedCode === promo.promoCode ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCode === promo.promoCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Why Choose ClubSphere */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#f8faf9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              UNMATCHED STANDARDS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Why Choose ClubSphere?
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Engineered from the ground up to solve college athletic management hassles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Olympic Quality Surfaces', desc: 'BWF standard teak badminton courts, US Open certified synthetic tennis courts, and WSF squash plaster.', icon: <Award size={24} color="#D4AF37" /> },
              { title: 'NIS Certified Coaching Staff', desc: 'Expert mentors for all skill levels offering private clinics, match analysis, and team conditioning.', icon: <Users size={24} color="#0F5132" /> },
              { title: 'Instant QR Turnstile Entry', desc: 'Zero queue check-ins. Flash your student phone QR pass at turnstiles for instant turnstile unlocking.', icon: <QrCode size={24} color="#0284c7" /> },
              { title: 'Zero Wait Times', desc: 'Reserve precise 60-minute time slots in advance with transparent real-time court availability matrix.', icon: <Clock size={24} color="#059669" /> },
              { title: 'Strict One-Active-Membership Policy', desc: 'Ensures equitable booking windows and prevents bulk-hoarding of peak athletic time slots.', icon: <Shield size={24} color="#b45309" /> },
              { title: 'Heavily Subsidized Student Rates', desc: 'Up to 50% discount for registered university students across court fees, shop rackets, and cafe bowls.', icon: <Zap size={24} color="#7c3aed" /> },
            ].map((card, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {card.icon}
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '0.4rem' }}>
                  {card.title}
                </h4>
                <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Facilities & Amenities */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CAMPUS AMENITIES
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Comprehensive Facilities Beyond the Courts
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Floodlit Arenas', desc: '500 lux high-grade floodlights enabling practice up to 10:00 PM.' },
              { name: 'Pro Sports Shop', desc: 'Original Yonex, Wilson, Head rackets, balls, and stringing services.' },
              { name: 'Sports Nutrition Cafe', desc: 'High-protein shakes, acai bowls, clean salads, and espresso.' },
              { name: 'Locker & Shower Rooms', desc: 'Digital code secure lockers, hot water showers, and dressing bays.' },
              { name: 'Sports Physio & First Aid', desc: 'On-campus first-responder medic room for athletic injury recovery.' },
              { name: 'Free Student Parking', desc: 'Dedicated 2-wheeler and 4-wheeler parking directly outside arena.' },
            ].map((f, idx) => (
              <div key={idx} style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#fdfdfd' }}>
                <CheckCircle2 size={22} color="#0F5132" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem' }}>{f.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Friday Social Play Teaser */}
      <section style={{
        backgroundColor: '#073b22',
        color: '#ffffff',
        padding: '4rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(212, 175, 55, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, color: '#fef08a', marginBottom: '0.75rem' }}>
              <Users size={16} /> FRIDAY SOCIAL MIX-IN LEAGUE
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              Friday Night Mix-In & Social Doubles
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#d1d5db', maxWidth: '640px', lineHeight: 1.6 }}>
              Looking for a playing partner? Every Friday from 6:00 PM to 8:30 PM, all students and club members meet for casual rotating doubles in Badminton and Tennis. Drinks and fruit snacks at the cafe afterwards!
            </p>
          </div>
          <Link
            to="/signup"
            style={{
              backgroundColor: '#D4AF37',
              color: '#072a18',
              padding: '0.95rem 1.85rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
            }}
          >
            RSVP for Next Friday
          </Link>
        </div>
      </section>

      {/* 13. Pro Shop & Cafe Spotlight */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SPORTS COMMERCE
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
                Pro Sports Shop & Club Cafe
              </h2>
            </div>
            <Link to="/shops" style={{ color: '#0F5132', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Browse 40 Catalog Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Yonex Astrox 88D Pro', category: 'Racket / Badminton', price: '₹7,499', memberPrice: '₹6,374 (Gold)', icon: '🏸' },
              { name: 'Wilson US Open Tennis Balls (Can of 3)', category: 'Tennis / Balls', price: '₹650', memberPrice: '₹552 (Gold)', icon: '🎾' },
              { name: 'Hydration Electrolyte Whey Shake', category: 'Cafe / Recovery', price: '₹180', memberPrice: '₹162 (Gold)', icon: '🥤' },
              { name: 'Grilled Chicken & Avocado Wrap', category: 'Cafe / Healthy Meals', price: '₹220', memberPrice: '₹198 (Gold)', icon: '🥪' },
            ].map((item, idx) => (
              <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', backgroundColor: '#fcfdfd' }}>
                <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.75rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F5132', textTransform: 'uppercase' }}>{item.category}</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0.25rem 0 0.75rem' }}>{item.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{item.price}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37' }}>{item.memberPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Testimonials / Student Reviews */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#f8faf9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CAMPUS COMMUNITY
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Loved by Student Athletes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Vikram Singh', branch: 'B.Tech Computer Science (Final Year)', text: 'The court booking system is lightning fast. I reserve Court 1 at 7 AM before my cloud computing lectures without any friction.', sport: 'Tennis Player • Gold Member' },
              { name: 'Sneha Patel', branch: 'B.Tech Information Technology (3rd Year)', text: 'The QR digital turnstile pass is super convenient. I don’t need to carry any physical membership card—just scan my phone and walk in!', sport: 'Badminton League Finalist' },
              { name: 'Aarav Mehta', branch: 'Junior Sports Fellow (Class 12 Prep)', text: 'The Junior tier gave me access to professional coaching drills on weekends. Coach Rahul corrected my backhand smash technique within weeks.', sport: 'Junior Membership' },
              { name: 'Pooja Iyer', branch: 'B.Tech Biotechnology (2nd Year)', text: 'I started with the 7-day free trial and immediately upgraded to Silver. The Friday mix-ins helped me find friends across different engineering branches.', sport: 'Squash & Gym Enthusiast' },
            ].map((t, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "{t.text}"
                </p>
                <div>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{t.branch}</div>
                  <div style={{ fontSize: '0.75rem', color: '#0F5132', fontWeight: 700, marginTop: '2px' }}>{t.sport}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Certified Coaches Spotlight */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              EXPERT GUIDANCE
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Meet Our Certified Coaches
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Coach Rahul Sharma', sport: 'Head Tennis Coach', cred: 'ITF Level 2 Certified • Ex-National Player', bio: 'Specializes in high-performance baseline footwork, modern topspin mechanics, and collegiate tournament preparation.' },
              { name: 'Coach Priya Verma', sport: 'Badminton Director', cred: 'BWF Certified Coach • NIS Patiala Alumni', bio: 'Expert in dynamic court coverage, deceptive drop shots, and rapid reaction drills for inter-college singles and doubles.' },
              { name: 'Coach Amit Kulkarni', sport: 'Strength & Conditioning', cred: 'CSCS Certified • Olympic Aquatics Trainer', bio: 'Focuses on athletic injury prevention, functional agility conditioning, and customized nutrition plans.' },
            ].map((coach, i) => (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '2rem', backgroundColor: '#fcfdfd', textAlign: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#d1e7dd', color: '#0F5132', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  {coach.name[6]}
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{coach.name}</h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F5132', marginBottom: '0.35rem' }}>{coach.sport}</div>
                <div style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700, marginBottom: '1rem' }}>{coach.cred}</div>
                <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.6 }}>{coach.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. Upcoming Events Ticker */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F5132', margin: 0 }}>Upcoming Campus Sports Tournaments</h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Open for Student Registrations</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309' }}>MARCH 15, 2026</div>
              <div style={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem', margin: '4px 0' }}>Inter-Branch Badminton Trophy</div>
              <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>Singles & Doubles • Cash prizes & college athletic merit medals.</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7' }}>APRIL 02, 2026</div>
              <div style={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem', margin: '4px 0' }}>Annual Club Tennis Open (Men & Women)</div>
              <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>Synthetic courts • State ranking points & equipment hampers.</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>APRIL 20, 2026</div>
              <div style={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem', margin: '4px 0' }}>50m Freestyle & Relay Aquatics Meet</div>
              <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>Olympic pool • Electronic touch pads and university team selections.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 17. Interactive FAQ Accordion */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FREQUENTLY ASKED
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Got Questions? We Have Answers
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: faqOpen === idx ? '#f8faf9' : '#ffffff',
                }}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  <span>{faq.q}</span>
                  {faqOpen === idx ? <ChevronUp size={20} color="#0F5132" /> : <ChevronDown size={20} color="#6b7280" />}
                </button>
                {faqOpen === idx && (
                  <div style={{ padding: '0 1.5rem 1.25rem', color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.65, borderTop: '1px solid #f3f4f6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18. College Evaluation / Viva Sandbox Modal Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
      }}>
        <button
          onClick={() => setShowSandbox(true)}
          style={{
            backgroundColor: '#0F5132',
            color: '#ffffff',
            border: '2px solid #D4AF37',
            borderRadius: '9999px',
            padding: '0.75rem 1.35rem',
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Key size={16} color="#D4AF37" />
          <span>Viva Sandbox Quick-Login</span>
        </button>
      </div>

      {/* Viva Sandbox Quick Login Modal */}
      {showSandbox && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  COLLEGE PROJECT EVALUATION
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '2px 0 0' }}>
                  1-Click Role Demonstrator
                </h3>
              </div>
              <button
                onClick={() => setShowSandbox(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
              Click any profile below to authenticate automatically and navigate to its dedicated portal:
            </p>

            {sandboxError && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {sandboxError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
              {/* Admin */}
              <button
                disabled={sandboxLoading}
                onClick={() => handleSandboxLogin('admin@clubsphere.com', 'Admin@123', '/admin/dashboard')}
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #0F5132',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#0F5132', fontSize: '0.95rem' }}>🛡️ Administrator (Dr. Rajesh)</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>admin@clubsphere.com • Full CRUD, Staff, Leaves, Plans & Integration Hub</div>
                </div>
                <ArrowRight size={18} color="#0F5132" />
              </button>

              {/* Staff */}
              <button
                disabled={sandboxLoading}
                onClick={() => handleSandboxLogin('coach.rahul@clubsphere.com', 'Staff@123', '/staff/dashboard')}
                style={{
                  backgroundColor: '#f0f9ff',
                  border: '1.5px solid #0284c7',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.95rem' }}>👔 Staff (Coach Rahul Sharma - Tennis Dept)</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>coach.rahul@clubsphere.com • Attendance, Shifts, Leaves & Turnstile Check-In</div>
                </div>
                <ArrowRight size={18} color="#0284c7" />
              </button>

              {/* Active Gold Member */}
              <button
                disabled={sandboxLoading}
                onClick={() => handleSandboxLogin('vikram.singh@example.com', 'Member@123', '/student/dashboard')}
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #D4AF37',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#b45309', fontSize: '0.95rem' }}>⭐ Active Gold Member (Vikram Singh)</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>vikram.singh@example.com • Gold plan, QR Turnstile pass, Court bookings</div>
                </div>
                <ArrowRight size={18} color="#b45309" />
              </button>

              {/* Active Trial User */}
              <button
                disabled={sandboxLoading}
                onClick={() => handleSandboxLogin('kavya.nair@example.com', 'Member@123', '/student/dashboard')}
                style={{
                  backgroundColor: '#fdf4ff',
                  border: '1.5px solid #a855f7',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#7e22ce', fontSize: '0.95rem' }}>⚡ Active 7-Day Trial User (Kavya Nair)</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>kavya.nair@example.com • 7-Day trial badge, countdown indicator</div>
                </div>
                <ArrowRight size={18} color="#7e22ce" />
              </button>

              {/* Expired Member */}
              <button
                disabled={sandboxLoading}
                onClick={() => handleSandboxLogin('manish.kumar@example.com', 'Member@123', '/student/dashboard')}
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #ef4444',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.95rem' }}>⏰ Expired Member (Manish Kumar)</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>manish.kumar@example.com • Shows EXPIRED renewal state & warning banner</div>
                </div>
                <ArrowRight size={18} color="#b91c1c" />
              </button>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => setShowSandbox(false)}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close Sandbox
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 19. Public Footer */}
      <PublicFooter />

    </div>
  );
};
