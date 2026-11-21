import React, { useState, useEffect } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Shield,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const MembershipsPublicPage = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/public/plans')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPlans(res.data);
        }
      })
      .catch(() => {
        // Handled gracefully with fallback values
      });
  }, []);

  const comparisonRows = [
    { feature: 'Court Booking Fees', gold: '100% Free Unlimited', silver: '50% Discount', junior: '30% Subsidized' },
    { feature: 'Advance Booking Window', gold: '7 Days in Advance', silver: '3 Days in Advance', junior: '1 Day in Advance' },
    { feature: 'Pro Sports Shop Discount', gold: '15% Off All Gear', silver: '10% Off All Gear', junior: '5% Off Equipment' },
    { feature: 'Club Health Cafe Discount', gold: '10% Off F&B', silver: '5% Off F&B', junior: 'Standard Pricing' },
    { feature: 'Complimentary Guest Passes', gold: '4 Free Passes / Month', silver: 'Paid Green Fee (₹150)', junior: 'Not Applicable' },
    { feature: 'Locker Facility', gold: 'Dedicated Personal Locker', silver: 'Daily Electronic Locker', junior: 'Daily Day Locker' },
    { feature: 'Coaching Clinic Access', gold: 'Priority Weekend Clinics', silver: 'Standard Clinics', junior: 'Junior Development League' },
    { feature: 'Encrypted Digital QR Gate Pass', gold: 'Included', silver: 'Included', junior: 'Included' },
    { feature: 'Friday Social Mix-In Access', gold: 'Free Entry & Snacks', silver: 'Free Entry', junior: 'Youth Mix-In (Saturdays)' },
    { feature: 'Eligibility', gold: 'Open to All Students/Faculty', silver: 'Open to All Students', junior: 'Strictly Under 18 Years' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#1f2937' }}>
      <PublicNavbar />

      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #072a18 0%, #0F5132 100%)',
        color: '#ffffff',
        padding: '4.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            MEMBERSHIP TIERS
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0.5rem 0 1rem' }}>
            Choose the Ideal Athletic Membership
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: 1.6 }}>
            Transparent pricing, automated renewals, and strictly one active membership per student for guaranteed court fairness.
          </p>
        </div>
      </section>

      {/* 3 Tier Cards */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#f8faf9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
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
                VIP FULL PRIVILEGE
              </div>
              <div>
                <span style={{ color: '#b45309', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Gold Tier</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0.25rem 0 1rem' }}>Gold Membership</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F5132' }}>₹15,000</span>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>/ 365 Days (1 Year)</span>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  The definitive all-access athletic pass. Play without court booking fees, bring guests, and enjoy maximum shop discounts.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 100% Free Court Bookings</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 7-Day Priority Booking Window</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 15% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#D4AF37" /> 10% Cafe & Bar Discount</li>
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
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F5132' }}>₹8,000</span>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>/ 180 Days (6 Months)</span>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Ideal for active student players who balance weekday workouts with weekend court sessions.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 50% Off Court Booking Fees</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 3-Day Advance Booking Window</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 10% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> 5% Club Cafe Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" /> Digital QR Pass Included</li>
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
                <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Youth Athlete</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0.25rem 0 1rem' }}>Junior Membership</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F5132' }}>₹5,000</span>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>/ 365 Days (&lt; 18 yrs)</span>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Specially subsidized youth pass for aspiring junior athletes under 18 with dedicated clinic mentoring.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Age-Verified Youth Subsidized Rate</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> 30% Off Court Booking Fees</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Weekend Coaching Clinic Access</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> 5% Sports Shop Discount</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color="#0284c7" /> Digital QR Pass Included</li>
                </ul>
              </div>
              <Link to="/signup" style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                Join as Junior Member
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Comprehensive Feature Comparison Table */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SIDE-BY-SIDE MATRIX
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Full Benefits Comparison
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#073b22', color: '#ffffff' }}>
                  <th style={{ padding: '1rem 1.25rem', borderTopLeftRadius: '10px' }}>Privilege / Feature</th>
                  <th style={{ padding: '1rem 1.25rem', color: '#fef08a' }}>Gold (VIP)</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Silver (Standard)</th>
                  <th style={{ padding: '1rem 1.25rem', borderTopRightRadius: '10px' }}>Junior (&lt; 18)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#111827' }}>{row.feature}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0F5132' }}>{row.gold}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{row.silver}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{row.junior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* One Active Membership Policy Explanation */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <Shield size={26} color="#0F5132" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F5132', margin: 0 }}>
              The "One Active Membership" Principle
            </h3>
          </div>
          <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1rem' }}>
            To protect fair distribution of peak court slots, eliminate duplicate reservations, and comply with athletic council standards, <strong>ClubSphere enforces strictly ONE active membership per member</strong> at both the Spring Boot service level and PostgreSQL database constraints (via <code>idx_one_active_membership</code>).
          </p>
          <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.95rem' }}>
            <strong>How Upgrades Work:</strong> If you currently hold a Silver membership and wish to upgrade to Gold, your existing record is automatically transitioned to <code>SUPERSEDED</code> status, and the new Gold plan activates immediately with refreshed booking windows.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4.5rem 1.5rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>
            <Zap size={16} /> UNCERTAIN WHICH PLAN SUITS YOU?
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginBottom: '0.75rem' }}>
            Start with Our 7-Day Free Trial
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Join risk-free. No credit card required. Experience all amenities, try court bookings, and upgrade only when you are completely satisfied.
          </p>
          <Link
            to="/signup"
            style={{
              backgroundColor: '#0F5132',
              color: '#ffffff',
              padding: '1rem 2.2rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1.05rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 25px rgba(15, 81, 50, 0.25)',
            }}
          >
            <span>Activate 7-Day Free Trial</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
