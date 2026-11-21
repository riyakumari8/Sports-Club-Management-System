import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { QrMembershipCard } from '../../components/cards/QrMembershipCard';
import { useAuth } from '../../context/AuthContext';
import { membershipService } from '../../services/membershipService';
import { courtService } from '../../services/courtService';
import { authService } from '../../services/authService';
import {
  CreditCard,
  QrCode,
  Sparkles,
  Calendar,
  ShieldCheck,
  ArrowRight,
  RotateCw,
  ShoppingBag,
  Coffee,
  Clock,
  Dumbbell,
  AlertTriangle,
  Zap,
  Users,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';

export const MemberDashboard = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [memberships, setMemberships] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [trialStatus, setTrialStatus] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [socialSessions, setSocialSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialSuccessMsg, setTrialSuccessMsg] = useState('');

  const loadDashboardData = async () => {
    try {
      const [memList, trialInfo, bookingsRes, socialRes] = await Promise.allSettled([
        membershipService.getMyMemberships(),
        authService.getTrialStatus(),
        courtService.getMyBookings(user?.id || 1),
        courtService.getSocialPlaySessions(),
      ]);

      const list = memList.status === 'fulfilled' && Array.isArray(memList.value) ? memList.value : [];
      setMemberships(list);

      if (trialInfo.status === 'fulfilled' && trialInfo.value) {
        setTrialStatus(trialInfo.value);
      }

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data) {
        const b = Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : [];
        setRecentBookings(b.slice(0, 3));
      }

      if (socialRes.status === 'fulfilled' && socialRes.value?.data) {
        const s = Array.isArray(socialRes.value.data) ? socialRes.value.data : [];
        setSocialSessions(s.slice(0, 2));
      }

      // Fetch QR Card for active membership if exists
      const activeMem = list.find((m) => m.status === 'ACTIVE');
      if (activeMem) {
        try {
          const card = await membershipService.getQrMembershipCard(activeMem.id);
          setActiveCard(card);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to load student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Handle 1-Click 7-Day Free Trial Activation
  const handleStartTrial = async () => {
    setTrialLoading(true);
    setTrialSuccessMsg('');
    try {
      const res = await authService.startTrial();
      setTrialSuccessMsg('Congratulations! Your 7-day all-access trial is now ACTIVE!');
      await refreshUser();
      await loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to activate trial.');
    } finally {
      setTrialLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Member Portal" subtitle="Your ClubSphere athletic hub">
        <Loader message="Loading student membership privileges..." />
      </DashboardLayout>
    );
  }

  // Determine current student state
  const activeMembership = memberships.find((m) => m.status === 'ACTIVE');
  const expiredMembership = memberships.find((m) => m.status === 'EXPIRED');
  const isTrialActive = trialStatus?.trialStatus === 'ACTIVE';
  const isTrialExpired = trialStatus?.trialStatus === 'EXPIRED';

  let memberState = 'NO_MEMBERSHIP';
  if (activeMembership) {
    memberState = 'ACTIVE_MEMBER';
  } else if (isTrialActive) {
    memberState = 'ACTIVE_TRIAL';
  } else if (expiredMembership || isTrialExpired) {
    memberState = 'EXPIRED';
  }

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.fullName || 'Student Athlete'}!`}
      subtitle="Access court reservations, digital QR turnstile passes, coaching rosters & dining perks"
    >
      {/* ================= STATE 1: ACTIVE PAID MEMBERSHIP ================= */}
      {memberState === 'ACTIVE_MEMBER' && (
        <div style={{
          background: 'linear-gradient(135deg, #072a18 0%, #0F5132 60%, #198754 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 25px rgba(15, 81, 50, 0.25)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} color="#4ade80" />
              <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 800, color: '#86efac' }}>
                Active Paid Membership • {activeMembership.planCategory || 'GOLD'} TIER
              </span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.25rem' }}>
              {activeMembership.planName}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
              Membership ID: <strong style={{ color: '#fef08a', fontFamily: 'monospace' }}>{activeMembership.membershipNumber}</strong>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div>Valid From: <strong>{activeMembership.startDate}</strong></div>
              <div>Expires: <strong style={{ color: '#fef08a' }}>{activeMembership.endDate}</strong></div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.65rem', borderRadius: '4px', fontWeight: 700 }}>
                Strict 1-Active Rule Verified
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/member/qr-card" className="btn btn-gold btn-sm" style={{ padding: '0.75rem 1.35rem', fontWeight: 800 }}>
              <QrCode size={18} /> View QR Gate Pass
            </Link>
            <Link to="/member/my-membership" className="btn btn-secondary btn-sm" style={{ padding: '0.75rem 1.35rem', fontWeight: 700 }}>
              <RotateCw size={18} /> Plan Details & Upgrade
            </Link>
          </div>
        </div>
      )}

      {/* ================= STATE 2: ACTIVE 7-DAY FREE TRIAL ================= */}
      {memberState === 'ACTIVE_TRIAL' && (
        <div style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 25px rgba(13, 148, 136, 0.25)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Sparkles size={20} color="#fef08a" />
              <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 800, color: '#fef08a' }}>
                7-DAY FREE STUDENT TRIAL ACTIVE
              </span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.25rem' }}>
              Full Club Access Active
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.88rem', fontWeight: 800, color: '#fef08a', marginTop: '6px' }}>
              <Clock size={16} />
              <span>{trialStatus?.daysRemaining ?? 7} Days Remaining in Trial Period</span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.88rem', marginTop: '0.75rem' }}>
              Enjoy complimentary court reservations, gym sessions, and member cafe pricing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/member/book-court" style={{ backgroundColor: '#ffffff', color: '#0f766e', padding: '0.75rem 1.35rem', borderRadius: '8px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Dumbbell size={18} /> Book a Court
            </Link>
            <Link to="/member/plans" style={{ backgroundColor: '#D4AF37', color: '#072a18', padding: '0.75rem 1.35rem', borderRadius: '8px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} /> Upgrade to Full Plan
            </Link>
          </div>
        </div>
      )}

      {/* ================= STATE 3: EXPIRED MEMBERSHIP ================= */}
      {memberState === 'EXPIRED' && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '2px solid #f87171',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <AlertTriangle size={20} color="#b91c1c" />
              <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: '#b91c1c', letterSpacing: '0.06em' }}>
                MEMBERSHIP EXPIRED
              </span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b', margin: '0 0 0.25rem' }}>
              Your Club Privileges are Paused
            </h3>
            <p style={{ color: '#7f1d1d', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.5 }}>
              Your membership has reached its expiry date. Turnstile gate passes and advance court booking windows are currently paused until renewal.
            </p>
          </div>

          <Link
            to="/member/plans"
            style={{
              backgroundColor: '#0F5132',
              color: '#ffffff',
              padding: '0.85rem 1.75rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RotateCw size={18} />
            <span>Renew Membership Now</span>
          </Link>
        </div>
      )}

      {/* ================= STATE 4: NO MEMBERSHIP (CLAIM 7-DAY TRIAL) ================= */}
      {memberState === 'NO_MEMBERSHIP' && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(212, 175, 55, 0.2)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, color: '#fef08a', marginBottom: '0.75rem' }}>
              <Zap size={14} /> EXCLUSIVE FREE STUDENT TRIAL
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.35rem' }}>
              Activate Your 7-Day Free Pass
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '620px', lineHeight: 1.6 }}>
              Welcome to ClubSphere! As a registered university student, you are eligible for 1 complimentary 7-day all-inclusive trial. Zero payment required.
            </p>
            {trialSuccessMsg && (
              <div style={{ color: '#86efac', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.75rem' }}>
                ✓ {trialSuccessMsg}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleStartTrial}
              disabled={trialLoading}
              style={{
                backgroundColor: '#D4AF37',
                color: '#072a18',
                padding: '0.85rem 1.75rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
              }}
            >
              <Sparkles size={18} />
              <span>{trialLoading ? 'Activating Trial...' : 'Claim 7-Day Free Trial'}</span>
            </button>

            <Link
              to="/member/plans"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.85rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              Browse Full Plans
            </Link>
          </div>
        </div>
      )}

      {/* Quick Action Shortcuts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={22} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: '#111827', fontSize: '1rem', margin: 0 }}>Reserve a Court</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' }}>Tennis, Badminton, Squash</p>
            </div>
          </div>
          <Link to="/member/book-court" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <span>Book Court Slot</span> <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={22} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: '#111827', fontSize: '1rem', margin: 0 }}>Digital QR Pass</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' }}>Instant turnstile entry</p>
            </div>
          </div>
          <Link to="/member/qr-card" style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <span>View & Download Pass</span> <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: '#111827', fontSize: '1rem', margin: 0 }}>Friday Social Play</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' }}>Rotating doubles mix-in</p>
            </div>
          </div>
          <Link to="/member/social-play" style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <span>Join Friday Session</span> <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coffee size={22} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: '#111827', fontSize: '1rem', margin: 0 }}>Shop & Cafe Perks</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' }}>Up to 15% discount applied</p>
            </div>
          </div>
          <Link to="/shops" style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <span>Browse Catalog</span> <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Bookings & Digital Pass Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Recent Court Bookings */}
        <div className="cs-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarCheck size={20} color="#0F5132" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                My Upcoming Court Bookings
              </h3>
            </div>
            <Link to="/member/my-bookings" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F5132', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280', fontSize: '0.88rem' }}>
              <p>You have no active court reservations.</p>
              <Link to="/member/book-court" style={{ display: 'inline-block', marginTop: '0.5rem', color: '#0F5132', fontWeight: 700 }}>
                Reserve your first court slot now →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.92rem' }}>
                      {b.courtName || `Court ${b.courtId}`}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>
                      {b.bookingDate} • {b.startTime} - {b.endTime}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: b.status === 'CONFIRMED' ? '#dcfce7' : '#fef3c7',
                    color: b.status === 'CONFIRMED' ? '#166534' : '#b45309',
                  }}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Digital Pass Preview */}
        <div className="cs-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode size={20} color="#0F5132" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Turnstile QR Gate Pass
              </h3>
            </div>
            <Link to="/member/qr-card" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F5132', textDecoration: 'none' }}>
              Full Screen →
            </Link>
          </div>

          {activeCard ? (
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-25px' }}>
              <QrMembershipCard cardData={activeCard} />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#6b7280', fontSize: '0.88rem' }}>
              <QrCode size={48} color="#d1d5db" style={{ margin: '0 auto 0.75rem' }} />
              <p>Turnstile QR pass will generate automatically when an active membership or free trial is enabled.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};
