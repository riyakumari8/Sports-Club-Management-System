import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { getPublicFacilities, getCourtAvailability } from '../services/api';

export default function CourtAvailability() {
  const [searchParams] = useSearchParams();
  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(searchParams.get('courtId') || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPublicFacilities().then(res => {
      setCourts(res.data);
      if (!selectedCourtId && res.data.length > 0) {
        setSelectedCourtId(res.data[0].courtId);
      }
    }).catch(() => {});
  }, [selectedCourtId]);

  useEffect(() => {
    if (selectedCourtId && selectedDate) {
      setLoading(true);
      getCourtAvailability(selectedCourtId, selectedDate)
        .then(res => {
          setSlots(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedCourtId, selectedDate]);

  const selectedCourt = courts.find(c => String(c.courtId) === String(selectedCourtId));

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 700, marginBottom: 36 }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>Real-Time Availability</span>
          <h1 className="title-serif" style={{ fontSize: '2.6rem', color: '#0f3e2e', marginBottom: 12 }}>
            Court Schedule & Slots
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
            Browse live 60-minute session slots starting every 30 minutes. Filter by court and date to plan your match.
          </p>
        </div>

        {/* Filter Card */}
        <div className="card" style={{ marginBottom: 36, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <label className="form-label">Select Arena / Court:</label>
            <select 
              value={selectedCourtId} 
              onChange={e => setSelectedCourtId(e.target.value)}
              className="form-control"
            >
              {courts.map(c => (
                <option key={c.courtId} value={c.courtId}>
                  {c.courtName} ({c.sportType} • ₹{c.standardHourlyRate}/hr)
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: 220 }}>
            <label className="form-label">Select Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setSelectedDate(e.target.value)}
              className="form-control"
            />
          </div>

          {selectedCourt && (
            <div style={{ padding: '10px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Operating Hours</div>
              <div style={{ fontWeight: 700, color: '#0f3e2e' }}>
                {selectedCourt.openingTime.substring(0,5)} – {selectedCourt.closingTime.substring(0,5)}
              </div>
            </div>
          )}
        </div>

        {/* Slots Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <Clock size={36} className="animate-spin" style={{ margin: '0 auto 16px', color: '#10b981' }} />
            <p>Loading real-time court availability matrix...</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f3e2e' }}>
                Showing Slots for {selectedDate} ({slots.length} intervals)
              </h3>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#10b981' }}></span> Available
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#cbd5e1' }}></span> Booked
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#f59e0b' }}></span> Maintenance / Past
                </span>
              </div>
            </div>

            <div className="grid-4">
              {slots.map((slot, index) => (
                <div 
                  key={index}
                  className="card"
                  style={{
                    padding: 18,
                    border: slot.available ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                    backgroundColor: slot.available ? '#ffffff' : '#f8fafc',
                    opacity: slot.available ? 1 : 0.75,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: slot.available ? '#0f3e2e' : '#64748b' }}>
                        {slot.startTime.substring(0,5)} – {slot.endTime.substring(0,5)}
                      </span>
                      {slot.available ? (
                        <CheckCircle size={18} color="#10b981" />
                      ) : (
                        <XCircle size={18} color="#94a3b8" />
                      )}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: slot.available ? '#059669' : '#64748b', fontWeight: 600, marginBottom: 12 }}>
                      {slot.statusReason}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 12 }}>
                      <span style={{ color: '#64748b' }}>Member: ₹{slot.memberPrice}</span>
                      <span style={{ color: '#64748b' }}>Guest: ₹{slot.guestPrice}</span>
                    </div>

                    {slot.available ? (
                      <Link 
                        to={`/book?courtId=${selectedCourtId}&date=${selectedDate}&time=${slot.startTime}`}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                      >
                        Reserve Slot
                      </Link>
                    ) : (
                      <button 
                        disabled 
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', cursor: 'not-allowed', color: '#94a3b8' }}
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
