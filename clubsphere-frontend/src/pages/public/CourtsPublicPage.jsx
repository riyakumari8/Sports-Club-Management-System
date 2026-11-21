import React, { useState, useEffect } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { courtService } from '../../services/courtService';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const CourtsPublicPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [filterSport, setFilterSport] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [previewCourtId, setPreviewCourtId] = useState(1);
  const [slotAvailability, setSlotAvailability] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const defaultCourts = [
    {
      id: 1,
      name: 'Court 1 - Championship Tennis',
      sport: 'TENNIS',
      surface: 'Synthetic Acrylic Hard Court',
      indoor: false,
      hourlyPrice: 400,
      description: 'US Open blue court specification with 500 lux LED tournament floodlighting.',
    },
    {
      id: 2,
      name: 'Court 2 - Practice Tennis',
      sport: 'TENNIS',
      surface: 'Synthetic Acrylic Hard Court',
      indoor: false,
      hourlyPrice: 350,
      description: 'Dedicated training court with ball rebound wall and automated ball launcher.',
    },
    {
      id: 3,
      name: 'Court 3 - Badminton Arena A',
      sport: 'BADMINTON',
      surface: 'Teak Hardwood BWF Floor',
      indoor: true,
      hourlyPrice: 300,
      description: 'Climate-controlled arena with shock-absorbing sprung wooden subfloor.',
    },
    {
      id: 4,
      name: 'Court 4 - Badminton Arena B',
      sport: 'BADMINTON',
      surface: 'Teak Hardwood BWF Floor',
      indoor: true,
      hourlyPrice: 300,
      description: 'High ceiling arena with glare-free linear lighting and Yonex post nets.',
    },
    {
      id: 5,
      name: 'Court 5 - Glass-Back Squash',
      sport: 'SQUASH',
      surface: 'ASB High Rebound Plaster',
      indoor: true,
      hourlyPrice: 350,
      description: 'WSF certified arena with full glass rear spectator viewing wall.',
    },
    {
      id: 6,
      name: 'Court 6 - Clay Tennis Court',
      sport: 'TENNIS',
      surface: 'Natural Red Clay',
      indoor: false,
      hourlyPrice: 450,
      description: 'Rolled red clay court favored for European slide technique and long rallies.',
    },
  ];

  // Fetch slots whenever previewCourtId or selectedDate changes
  useEffect(() => {
    if (!previewCourtId || !selectedDate) return;
    setLoadingSlots(true);
    courtService.getCourtAvailability(previewCourtId, selectedDate)
      .then((res) => {
        const slots = res.data?.slots || res.data || [];
        setSlotAvailability(Array.isArray(slots) ? slots : []);
      })
      .catch(() => {
        // Fallback default slots for preview
        setSlotAvailability([
          { startTime: '06:00', endTime: '07:00', available: true, price: 400 },
          { startTime: '07:00', endTime: '08:00', available: false, price: 400 },
          { startTime: '08:00', endTime: '09:00', available: true, price: 400 },
          { startTime: '09:00', endTime: '10:00', available: true, price: 400 },
          { startTime: '16:00', endTime: '17:00', available: false, price: 400 },
          { startTime: '17:00', endTime: '18:00', available: true, price: 400 },
          { startTime: '18:00', endTime: '19:00', available: false, price: 400 },
          { startTime: '19:00', endTime: '20:00', available: true, price: 400 },
          { startTime: '20:00', endTime: '21:00', available: true, price: 400 },
        ]);
      })
      .finally(() => setLoadingSlots(false));
  }, [previewCourtId, selectedDate]);

  const filteredCourts = filterSport === 'ALL'
    ? defaultCourts
    : defaultCourts.filter((c) => c.sport === filterSport);

  const handleBookClick = (courtId) => {
    if (isAuthenticated) {
      navigate(`/member/book-court?courtId=${courtId}`);
    } else {
      navigate('/login');
    }
  };

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
            REGULATION ARENAS
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0.5rem 0 1rem' }}>
            Championship Courts & Live Availability
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: 1.6 }}>
            Check hourly availability, surface properties, and reserve your desired court slot in real time.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3.5rem 1.5rem', flexGrow: 1, width: '100%' }}>
        
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'TENNIS', 'BADMINTON', 'SQUASH'].map((sport) => (
              <button
                key={sport}
                onClick={() => setFilterSport(sport)}
                style={{
                  backgroundColor: filterSport === sport ? '#0F5132' : '#ffffff',
                  color: filterSport === sport ? '#ffffff' : '#374151',
                  border: filterSport === sport ? '1px solid #0F5132' : '1px solid #d1d5db',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {sport === 'ALL' ? 'All Courts (6)' : sport}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="#0F5132" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>Date:</span>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            />
          </div>
        </div>

        {/* Courts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          {filteredCourts.map((court) => {
            const isPreviewing = previewCourtId === court.id;
            return (
              <div
                key={court.id}
                style={{
                  borderRadius: '16px',
                  border: isPreviewing ? '2px solid #0F5132' : '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  boxShadow: isPreviewing ? '0 10px 25px rgba(15, 81, 50, 0.12)' : '0 4px 15px rgba(0,0,0,0.03)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F5132', backgroundColor: '#d1e7dd', padding: '0.2rem 0.65rem', borderRadius: '4px' }}>
                      {court.sport}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: court.indoor ? '#0284c7' : '#d97706', backgroundColor: court.indoor ? '#e0f2fe' : '#fef3c7', padding: '0.2rem 0.65rem', borderRadius: '4px' }}>
                      {court.indoor ? 'Indoor Arena' : 'Outdoor Floodlit'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.4rem' }}>
                    {court.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    Surface: <strong style={{ color: '#374151' }}>{court.surface}</strong>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {court.description}
                  </p>

                  <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Guest / Standard Fee:</span>
                      <strong style={{ fontSize: '1.05rem', color: '#111827' }}>₹{court.hourlyPrice} / hr</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 700 }}>Gold Member Privilege:</span>
                      <strong style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 800 }}>100% FREE</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setPreviewCourtId(court.id)}
                    style={{
                      flex: 1,
                      backgroundColor: isPreviewing ? '#0F5132' : '#f3f4f6',
                      color: isPreviewing ? '#ffffff' : '#374151',
                      border: 'none',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Eye size={15} />
                    <span>{isPreviewing ? 'Viewing Slots' : 'Inspect Slots'}</span>
                  </button>

                  <button
                    onClick={() => handleBookClick(court.id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#D4AF37',
                      color: '#072a18',
                      border: 'none',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Book Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Slot Availability Preview Section */}
        <div style={{
          backgroundColor: '#f8faf9',
          border: '1px solid #d1e7dd',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                LIVE AVAILABILITY MATRIX
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '2px 0 0' }}>
                Slot Timeline: {defaultCourts.find((c) => c.id === previewCourtId)?.name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>
                Displaying hourly slots for date: <strong>{selectedDate}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#dcfce7', border: '1px solid #86efac' }}></span>
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }}></span>
                <span>Reserved</span>
              </div>
            </div>
          </div>

          {loadingSlots ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              Loading hourly availability...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {slotAvailability.map((slot, idx) => {
                const isAvail = slot.available !== false && slot.status !== 'BOOKED';
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      backgroundColor: isAvail ? '#ffffff' : '#fef2f2',
                      border: isAvail ? '1.5px solid #bbf7d0' : '1px solid #fca5a5',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                      {slot.startTime} – {slot.endTime}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '4px', color: isAvail ? '#0F5132' : '#991b1b' }}>
                      {isAvail ? 'AVAILABLE' : 'RESERVED'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => handleBookClick(previewCourtId)}
              style={{
                backgroundColor: '#0F5132',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Reserve Slot for Court {previewCourtId}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>

      <PublicFooter />
    </div>
  );
};
