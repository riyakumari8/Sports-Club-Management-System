import React from 'react';
import { Trophy, ShieldCheck, Heart, Award, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Hero */}
        <div style={{ maxWidth: 760, margin: '0 auto 56px', textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>Champions Club Heritage</span>
          <h1 className="title-serif" style={{ fontSize: '3rem', color: '#0f3e2e', marginBottom: 16 }}>
            Building the Digital Future of Sports
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.7 }}>
            ClubSphere was created to replace outdated WhatsApp groups and paper tabs with an integrated, intelligent sports club management platform. We believe in fair court access, immaculate facilities, and a thriving player community.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid-2" style={{ marginBottom: 64 }}>
          <div className="card" style={{ padding: 36 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Trophy size={24} color="#059669" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 12 }}>Our Mission</h3>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
              To provide every athlete, from aspiring junior players to seasoned professionals, with seamless access to championship-grade playing surfaces, certified coaching, and transparent scheduling.
            </p>
          </div>

          <div className="card" style={{ padding: 36 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <ShieldCheck size={24} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 12 }}>Our Vision</h3>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
              To set the benchmark for modern sports infrastructure in India by blending athletic excellence with cutting-edge software architecture, eliminating operational bottlenecks for club owners and players alike.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 24, border: '1px solid #e2e8f0', padding: 48, marginBottom: 64 }}>
          <h2 className="title-serif" style={{ fontSize: '2.2rem', color: '#0f3e2e', marginBottom: 32, textAlign: 'center' }}>
            Why Athletes Choose ClubSphere
          </h2>
          <div className="grid-3">
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3e2e', marginBottom: 8 }}>Zero Double-Bookings</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Our 30-minute staggered slot engine and PostgreSQL transactional constraints guarantee that confirmed reservations never conflict.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3e2e', marginBottom: 8 }}>Daily Court Maintenance</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every clay court, synthetic grass arena, and turf cricket pitch undergoes scheduled maintenance blackout periods to ensure supreme ball bounce.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3e2e', marginBottom: 8 }}>All-in-One Experience</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                From reserving your morning court to ordering restringing from the pro shop and social drinks at the lounge, everything syncs under one platform.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#0f3e2e', marginBottom: 16 }}>Ready to step onto the court?</h3>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/book" className="btn btn-primary">Book Court</Link>
            <Link to="/contact" className="btn btn-outline">Schedule a Trial Session</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
