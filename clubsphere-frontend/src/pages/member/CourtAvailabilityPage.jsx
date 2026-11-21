import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { courtService } from '../../services/courtService';
import { Calendar, Clock, Filter, ArrowRight, ShieldCheck } from 'lucide-react';

export const CourtAvailabilityPage = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [selectedSport, setSelectedSport] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await courtService.getCourts();
        const list = Array.isArray(res) ? res : (res.data || []);
        setCourts(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const filteredCourts = courts.filter(c => {
    if (selectedSport === 'ALL') return true;
    return c.sportType?.toUpperCase() === selectedSport.toUpperCase();
  });

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00'
  ];

  if (loading) {
    return (
      <DashboardLayout title="Court Availability Matrix" subtitle="Live club facility schedules">
        <Loader message="Loading court schedules..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Live Court Availability"
      subtitle="Inspect real-time slot occupancy across tennis courts, cricket pitches, and badminton arenas"
    >
      {/* Filter Header */}
      <div className="cs-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>Sport:</span>
            {['ALL', 'TENNIS', 'CRICKET', 'PADEL', 'BADMINTON'].map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSport(sp)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: selectedSport === sp ? '#0F5132' : '#f3f4f6',
                  color: selectedSport === sp ? '#ffffff' : '#4b5563',
                  border: '1px solid',
                  borderColor: selectedSport === sp ? '#0F5132' : '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                {sp}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="#0F5132" />
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
              }}
            />
          </div>

        </div>
      </div>

      {/* Courts Availability Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredCourts.map((court) => (
          <div key={court.courtId} className="cs-card" style={{ padding: '1.5rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                    {court.courtName}
                  </h3>
                  <Badge type={court.courtStatus}>{court.courtStatus}</Badge>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
                  {court.sportType} &bull; 📍 {court.location} &bull; 👟 {court.surfaceType} &bull; 💰 ₹{court.standardHourlyRate}/hr
                </div>
              </div>

              <button
                onClick={() => navigate(`/member/book-court?courtId=${court.courtId}&date=${selectedDate}`)}
                className="btn btn-primary btn-sm"
              >
                <span>Book This Court</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Slots Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: '8px',
            }}>
              {timeSlots.map((time, idx) => {
                const isMaintenance = court.courtStatus === 'UNDER_MAINTENANCE';
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isMaintenance) {
                        navigate(`/member/book-court?courtId=${court.courtId}&date=${selectedDate}&time=${time}`);
                      }
                    }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      textAlign: 'center',
                      backgroundColor: isMaintenance ? '#fee2e2' : '#f0fdf4',
                      border: '1px solid',
                      borderColor: isMaintenance ? '#fca5a5' : '#bbf7d0',
                      color: isMaintenance ? '#991b1b' : '#065f46',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: isMaintenance ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>{time}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '2px' }}>
                      {isMaintenance ? 'Closed' : 'Open'}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};
