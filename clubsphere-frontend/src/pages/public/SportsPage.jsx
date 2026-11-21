import React, { useState } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Link } from 'react-router-dom';
import {
  Clock,
  User,
  Shield,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export const SportsPage = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const sports = [
    {
      id: 'tennis',
      name: 'Lawn Tennis',
      category: 'RACQUET',
      icon: '🎾',
      summary: '3 Championship floodlit courts: 2 synthetic acrylic hard courts and 1 natural red clay court.',
      dimensions: '78 ft × 27 ft (Singles) / 36 ft (Doubles)',
      gear: 'Tennis racquet, pressureless or pressurized felt balls, non-marking herringbone tennis shoes.',
      coach: 'Coach Rahul Sharma (ITF Level 2)',
      timings: 'Morning Drills: 6:00 AM – 9:00 AM | Evening Matchplay: 4:30 PM – 9:30 PM',
      rules: 'Standard ITF best-of-3 sets scoring. Proper white or athletic tennis kit required.',
      courtsCount: 'Courts 1, 2 & 6',
    },
    {
      id: 'badminton',
      name: 'Badminton',
      category: 'RACQUET',
      icon: '🏸',
      summary: '2 BWF-certified teak hardwood courts with shock-absorbent spring underlay and anti-glare overhead LEDs.',
      dimensions: '44 ft × 17 ft (Singles) / 20 ft (Doubles)',
      gear: 'Carbon-graphite racquet, feather or nylon shuttlecocks, pure gum-rubber non-marking indoor shoes.',
      coach: 'Coach Priya Verma (NIS Patiala / BWF)',
      timings: 'Morning Coaching: 6:00 AM – 9:30 AM | Open Play: 4:00 PM – 10:00 PM',
      rules: 'BWF 21-point rally scoring system. Black-soled street shoes strictly prohibited on wooden courts.',
      courtsCount: 'Courts 3 & 4',
    },
    {
      id: 'squash',
      name: 'Squash',
      category: 'RACQUET',
      icon: '⚪',
      summary: 'ASB WSF-certified glass-back court with high-rebound front wall and climate control.',
      dimensions: '32 ft × 21 ft (Standard WSF Court)',
      gear: 'Squash racket, non-marking eye protection goggles, double yellow dot or single red dot squash balls.',
      coach: 'Coach Amit Kulkarni (Level 2 Certified)',
      timings: 'Daily Solo & Drills: 7:00 AM – 10:00 AM | Evening Slots: 4:00 PM – 9:00 PM',
      rules: 'PAR-11 (Point-A-Rally to 11). Protective eye wear mandatory for all student matches.',
      courtsCount: 'Court 5',
    },
    {
      id: 'swimming',
      name: 'Olympic Swimming',
      category: 'AQUATICS',
      icon: '🏊',
      summary: '50-meter 8-lane competition swimming pool with electronic touch timing and continuous UV filtration.',
      dimensions: '50 m × 25 m (Depth: 2.0 m uniform)',
      gear: 'Approved swimming costume/jammers, silicon swimming cap, anti-fog swimming goggles.',
      coach: 'Coach Amit Kulkarni (Aquatics Lead)',
      timings: 'Morning Lap Swim: 6:00 AM – 9:00 AM | Evening Lessons: 4:30 PM – 8:30 PM',
      rules: 'Shower mandatory before pool entry. Beginners restricted to marked shallow lanes.',
      courtsCount: 'Aquatics Complex Pool',
    },
    {
      id: 'gym',
      name: 'Strength & Conditioning Gym',
      category: 'FITNESS',
      icon: '🏋️',
      summary: 'High-tech fitness center equipped with Hammer Strength plate-loaded machines, Olympic barbells, and dumbells up to 50kg.',
      dimensions: '4,500 sq ft Multi-Level Studio',
      gear: 'Breathable sports apparel, sweat towel, clean flat-sole training sneakers.',
      coach: 'Certified Strength Trainers on Floor',
      timings: 'Continuous Access: 6:00 AM – 10:00 PM (Mon to Sun)',
      rules: 'Re-racking weights mandatory. Sweat towels required on all upholstered benches.',
      courtsCount: 'Pavilion Gym Center',
    },
    {
      id: 'yoga',
      name: 'Yoga & Functional Mobility',
      category: 'FITNESS',
      icon: '🧘',
      summary: 'Peaceful hardwood studio with mirror walls for vinyasa flow, breathwork, and calisthenic core routines.',
      dimensions: '1,800 sq ft Quiet Zone Studio',
      gear: 'Yoga mat (provided or personal), stretchable athletic leggings/shorts.',
      coach: 'Yoga Master Devika Sen',
      timings: 'Sunrise Session: 6:30 AM – 7:45 AM | Sunset Flow: 5:30 PM – 6:45 PM',
      rules: 'Silence maintained in the studio. Footwear left outside the shoe racks.',
      courtsCount: 'Studio A (Floor 2)',
    },
  ];

  const filteredSports = activeCategory === 'ALL'
    ? sports
    : sports.filter((s) => s.category === activeCategory);

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
            ATHLETIC DISCIPLINES
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0.5rem 0 1rem' }}>
            Comprehensive Sports Programs & Courts
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: 1.6 }}>
            Explore court specifications, required equipment, training rosters, and certified coaches for each discipline.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section style={{ padding: '2rem 1.5rem 1rem', backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['ALL', 'RACQUET', 'AQUATICS', 'FITNESS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                backgroundColor: activeCategory === cat ? '#0F5132' : '#ffffff',
                color: activeCategory === cat ? '#ffffff' : '#4b5563',
                border: activeCategory === cat ? '1px solid #0F5132' : '1px solid #d1d5db',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'ALL' ? 'All Disciplines' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Sports Detail Cards */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#f8faf9', flexGrow: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {filteredSports.map((sport) => (
            <div
              key={sport.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{sport.icon}</span>
                  <span style={{ backgroundColor: '#d1e7dd', color: '#0F5132', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                    {sport.courtsCount}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                  {sport.name}
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {sport.summary}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#374151', backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Maximize2 size={16} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Dimensions:</strong> {sport.dimensions}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Shield size={16} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Required Gear:</strong> {sport.gear}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <User size={16} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Faculty / Coach:</strong> {sport.coach}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Clock size={16} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Coaching Timings:</strong> {sport.timings}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem' }}>
                <Link to="/courts" style={{ color: '#0F5132', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Check Availability</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/signup"
                  style={{
                    backgroundColor: '#0F5132',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Book with Free Trial
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
