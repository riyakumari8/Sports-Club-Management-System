import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Shield, Award, Users, CheckCircle2, HeartPulse, Building2, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
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
            ABOUT CLUBSPHERE
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0.5rem 0 1rem' }}>
            Nurturing Collegiate Champions & Athletic Well-Being
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: 1.6 }}>
            Founded to inspire lifelong fitness and competitive sportsmanship across the student body and university fraternity.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          <div style={{ border: '2px solid #bbf7d0', borderRadius: '16px', padding: '2.5rem', backgroundColor: '#f0fdf4' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#0F5132', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={26} color="#D4AF37" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F5132', marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.95rem' }}>
              To provide every student with equitable, high-tech access to Olympic-grade sports infrastructure, personalized coaching, and transparent automated reservations—fostering physical agility, mental resilience, and inter-collegiate camaraderie.
            </p>
          </div>

          <div style={{ border: '2px solid #fed7aa', borderRadius: '16px', padding: '2.5rem', backgroundColor: '#fffbeb' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#b45309', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Shield size={26} color="#ffffff" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400e', marginBottom: '0.75rem' }}>Our Vision</h3>
            <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.95rem' }}>
              To establish ClubSphere as the nation’s benchmark university sports pavilion, where collegiate athletes transition smoothly onto national podiums while every casual student develops an enduring passion for sports and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Infrastructure Details */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#f8faf9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CAMPUS ASSETS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              12 Acres of High-Tech Sports Infrastructure
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Championship Courts', value: '6 Regulation Arenas', desc: 'Synthetic tennis, Teak hardwood badminton, glass-back squash, and natural clay.' },
              { title: 'Olympic Pool Complex', value: '50-Meter 8-Lane Pool', desc: 'Electronic touch timing pads, heating during winters, and continuous UV filtration.' },
              { title: 'High-Lux Floodlighting', value: '500-Lux Night Play', desc: 'Glare-free LED stadium lights tested for television broadcast illumination.' },
              { title: 'Digital Gate Automation', value: '100% QR Turnstiles', desc: 'Secure, zero-queue access with synchronized real-time student check-ins.' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F5132', textTransform: 'uppercase' }}>{stat.title}</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '0.35rem 0 0.5rem' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Faculty Advisors */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              GOVERNANCE & LEADERSHIP
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', marginTop: '0.25rem' }}>
              Sports Council & Faculty Advisors
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Dr. Rajesh Sharma', role: 'Director of Physical Education & Sports', qual: 'Ph.D. Sports Biomechanics • 20+ Years Campus Leadership' },
              { name: 'Prof. Anita Deshmukh', role: 'Faculty Sports Patron & Grievance Dean', qual: 'Former National Table Tennis Champion • Dean of Student Welfare' },
              { name: 'Coach Rahul Sharma', role: 'Head Tennis Coach & Operations Lead', qual: 'ITF Level 2 Certified • Head Coach NIS Patiala Alum' },
            ].map((member, i) => (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.75rem', backgroundColor: '#fcfdfd', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#0F5132', color: '#ffffff', fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  {member.name[4]}
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{member.name}</h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F5132', marginBottom: '0.5rem' }}>{member.role}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{member.qual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health & Safety Guidelines */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <HeartPulse size={28} color="#0F5132" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F5132', margin: 0 }}>Health, Hygiene & Safety Protocol</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#374151', fontSize: '0.95rem', lineHeight: 1.65 }}>
            <div style={{ display: 'flex', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" style={{ flexShrink: 0, marginTop: '3px' }} /> <span><strong>Proper Footwear:</strong> Non-marking rubber soles are strictly mandated for wooden badminton courts and squash arenas to preserve court floor tension.</span></div>
            <div style={{ display: 'flex', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" style={{ flexShrink: 0, marginTop: '3px' }} /> <span><strong>First-Aid & Physio:</strong> A full-time sports physiotherapist is stationed on-site with AED defibrillators, ice compression packs, and athletic taping supplies.</span></div>
            <div style={{ display: 'flex', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" style={{ flexShrink: 0, marginTop: '3px' }} /> <span><strong>Hydration Stations:</strong> Clean RO-purified, chilled electrolyte replenishment points are placed across every court corridor.</span></div>
            <div style={{ display: 'flex', gap: '10px' }}><CheckCircle2 size={18} color="#0F5132" style={{ flexShrink: 0, marginTop: '3px' }} /> <span><strong>Clean Locker Etiquette:</strong> Daily automated sanitization cycles run every midnight. Items left uncollected in daily lockers are cataloged at Front Desk.</span></div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>
            Ready to Experience the Club in Person?
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Claim your 7-day student pass today or book a complimentary facilities tour.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ backgroundColor: '#0F5132', color: '#ffffff', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
              Sign Up for Free Trial
            </Link>
            <Link to="/contact" style={{ border: '1.5px solid #0F5132', color: '#0F5132', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
              Schedule a Campus Tour
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
