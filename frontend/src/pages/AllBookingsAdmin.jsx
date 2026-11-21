import React, { useEffect, useState } from 'react';
import { Calendar, Filter, XCircle, Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getAllBookings, cancelBooking, getCourts } from '../services/api';

export default function AllBookingsAdmin() {
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    getAllBookings({
      courtId: selectedCourtId || null,
      date: selectedDate || null,
      status: selectedStatus || null
    })
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    getCourts().then(res => setCourts(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [selectedCourtId, selectedDate, selectedStatus]);

  const handleAdminCancel = async (bookingId) => {
    const reason = prompt('Enter administrative cancellation reason:');
    if (reason === null) return;
    try {
      await cancelBooking(bookingId, reason || 'Administrative override');
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <span className="badge badge-warning" style={{ marginBottom: 8 }}>Master Audit</span>
          <h1 className="title-serif" style={{ fontSize: '2.5rem', color: '#0f3e2e' }}>
            All Club Reservations
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Comprehensive club-wide booking records, financial status, and administrative override controls.
          </p>
        </div>

        {/* Filter Card */}
        <div className="card" style={{ marginBottom: 28, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Court:</label>
            <select 
              value={selectedCourtId} 
              onChange={e => setSelectedCourtId(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px' }}
            >
              <option value="">All Courts</option>
              {courts.map(c => (
                <option key={c.courtId} value={c.courtId}>{c.courtName} ({c.sportType})</option>
              ))}
            </select>
          </div>

          <div style={{ width: 180 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px' }}
            >
            </input>
          </div>

          <div style={{ width: 160 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Booking Status:</label>
            <select 
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px' }}
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button 
              onClick={() => { setSelectedCourtId(''); setSelectedDate(''); setSelectedStatus(''); }}
              className="btn btn-outline btn-sm"
              style={{ height: 38 }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '16px 20px' }}>Reference & Player</th>
                <th style={{ padding: '16px 20px' }}>Court Facility</th>
                <th style={{ padding: '16px 20px' }}>Match Schedule</th>
                <th style={{ padding: '16px 20px' }}>Financials</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    Loading reservations...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    No matching booking records found.
                  </td>
                </tr>
              ) : bookings.map(b => (
                <tr key={b.bookingId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#0f3e2e' }}>{b.bookingReference}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {b.memberId ? `Member #${b.memberId}` : (b.guestName || 'Guest User')}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600 }}>{b.court?.courtName}</div>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', marginTop: 2 }}>
                      {b.court?.sportType}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div><strong>{b.bookingDate}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {b.startTime?.substring(0,5)} – {b.endTime?.substring(0,5)}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#0f3e2e' }}>₹ {b.finalAmount}</div>
                    <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                      {b.discountAmount > 0 ? `Saved ₹${b.discountAmount}` : 'Standard'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${
                      b.bookingStatus === 'CONFIRMED' ? 'badge-success' :
                      (b.bookingStatus === 'COMPLETED' ? 'badge-primary' : 'badge-danger')
                    }`}>
                      {b.bookingStatus}
                    </span>
                    {b.checkedInAt && (
                      <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: 2 }}>
                        Checked in
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {b.bookingStatus === 'CONFIRMED' && (
                      <button
                        onClick={() => handleAdminCancel(b.bookingId)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Override Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
