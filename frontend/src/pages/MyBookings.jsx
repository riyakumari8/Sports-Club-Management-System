import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, QrCode, AlertCircle, CheckCircle2, 
  X, RefreshCw, XCircle, ArrowRight 
} from 'lucide-react';
import { getMyBookings, cancelBooking, rescheduleBooking, getCourtAvailability } from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('UPCOMING');
  const [loading, setLoading] = useState(true);

  // QR Modal
  const [qrModalBooking, setQrModalBooking] = useState(null);

  // Reschedule Modal
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlots, setNewSlots] = useState([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState('');
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

  // Cancellation
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    getMyBookings(101)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // When date changes in Reschedule modal, fetch availability
  useEffect(() => {
    if (rescheduleModalBooking && newDate) {
      getCourtAvailability(rescheduleModalBooking.court.courtId, newDate)
        .then(res => setNewSlots(res.data))
        .catch(() => setNewSlots([]));
    }
  }, [rescheduleModalBooking, newDate]);

  const handleConfirmReschedule = async () => {
    if (!selectedNewSlot) {
      setRescheduleError('Please select a new time slot.');
      return;
    }
    setRescheduling(true);
    setRescheduleError('');
    try {
      await rescheduleBooking(rescheduleModalBooking.bookingId, {
        newBookingDate: newDate,
        newStartTime: selectedNewSlot.length === 5 ? selectedNewSlot + ':00' : selectedNewSlot
      });
      setRescheduleModalBooking(null);
      fetchBookings();
    } catch (err) {
      setRescheduleError(err.response?.data?.message || 'Failed to reschedule. Slot may no longer be available.');
    } finally {
      setRescheduling(false);
    }
  };

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(cancelModalBooking.bookingId, cancelReason);
      setCancelModalBooking(null);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED' && b.bookingDate >= today);
  const completedBookings = bookings.filter(b => b.bookingStatus === 'COMPLETED' || (b.bookingStatus === 'CONFIRMED' && b.bookingDate < today));
  const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED');

  const currentList = activeTab === 'UPCOMING' 
    ? upcomingBookings 
    : (activeTab === 'COMPLETED' ? completedBookings : cancelledBookings);

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: 8 }}>Member Portal</span>
            <h1 className="title-serif" style={{ fontSize: '2.5rem', color: '#0f3e2e' }}>
              My Court Bookings
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Manage your upcoming reservations, access digital QR entry passes, and reschedule slots.
            </p>
          </div>
          <Link to="/book" className="btn btn-primary btn-sm">
            + New Reservation
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 32 }}>
          <button
            onClick={() => setActiveTab('UPCOMING')}
            style={{
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'UPCOMING' ? '#0f3e2e' : '#64748b',
              borderBottom: activeTab === 'UPCOMING' ? '3px solid #0f3e2e' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            style={{
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'COMPLETED' ? '#0f3e2e' : '#64748b',
              borderBottom: activeTab === 'COMPLETED' ? '3px solid #0f3e2e' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            Completed ({completedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('CANCELLED')}
            style={{
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'CANCELLED' ? '#0f3e2e' : '#64748b',
              borderBottom: activeTab === 'CANCELLED' ? '3px solid #0f3e2e' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            Cancelled ({cancelledBookings.length})
          </button>
        </div>

        {/* Content list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            Loading reservations...
          </div>
        ) : currentList.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0f3e2e', marginBottom: 8 }}>No {activeTab.toLowerCase()} bookings found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Ready for a match? Check available court slots and reserve online in seconds.
            </p>
            <Link to="/book" className="btn btn-primary btn-sm">
              Book a Court
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {currentList.map(booking => (
              <div 
                key={booking.bookingId} 
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 20,
                  padding: 20
                }}
              >
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                      {booking.court?.sportType}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f3e2e' }}>
                      {booking.startTime?.substring(0,5)}
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3e2e' }}>
                        {booking.court?.courtName}
                      </h4>
                      <span className={`badge ${
                        booking.bookingStatus === 'CONFIRMED' ? 'badge-success' : 
                        (booking.bookingStatus === 'COMPLETED' ? 'badge-primary' : 'badge-danger')
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: '#64748b' }}>
                      <span><strong>Date:</strong> {booking.bookingDate}</span>
                      <span><strong>Slot:</strong> {booking.startTime?.substring(0,5)} – {booking.endTime?.substring(0,5)}</span>
                      <span><strong>Ref:</strong> {booking.bookingReference}</span>
                      <span><strong>Paid:</strong> ₹ {booking.finalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {booking.bookingStatus === 'CONFIRMED' && (
                    <>
                      <button
                        onClick={() => setQrModalBooking(booking)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <QrCode size={15} color="#0f3e2e" /> QR Pass
                      </button>

                      <button
                        onClick={() => {
                          setRescheduleModalBooking(booking);
                          setNewDate(booking.bookingDate);
                          setSelectedNewSlot('');
                          setRescheduleError('');
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <RefreshCw size={14} /> Reschedule
                      </button>

                      <button
                        onClick={() => {
                          setCancelModalBooking(booking);
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.bookingStatus === 'COMPLETED' && (
                    <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                      ✓ Checked-in at front desk
                    </span>
                  )}

                  {booking.bookingStatus === 'CANCELLED' && (
                    <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>
                      Refund Status: REFUNDED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Pass Modal */}
      {qrModalBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f3e2e' }}>Front Desk Entry Pass</h3>
              <button onClick={() => setQrModalBooking(null)} style={{ background: 'none' }}><X size={20} /></button>
            </div>

            <div style={{ background: '#f8fafc', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f3e2e' }}>
                {qrModalBooking.bookingReference}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
                {qrModalBooking.court?.courtName}
              </div>

              {/* QR Image preview */}
              <div style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrModalBooking.bookingReference}`}
                  alt="QR Pass"
                  style={{ width: 190, height: 190, border: '3px solid #0f3e2e', borderRadius: 8, padding: 6, background: '#fff' }}
                />
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f3e2e' }}>
                {qrModalBooking.bookingDate} • {qrModalBooking.startTime?.substring(0,5)} - {qrModalBooking.endTime?.substring(0,5)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: 4 }}>
                Status: {qrModalBooking.bookingStatus} (Paid ₹ {qrModalBooking.finalAmount})
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 16 }}>
              Scan this QR code at the reception desk scanner or present the booking reference to staff upon arrival.
            </p>

            <button onClick={() => setQrModalBooking(null)} className="btn btn-primary" style={{ width: '100%' }}>
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f3e2e' }}>
                Reschedule Booking
              </h3>
              <button onClick={() => setRescheduleModalBooking(null)} style={{ background: 'none' }}><X size={20} /></button>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 16 }}>
              Current Booking: <strong>{rescheduleModalBooking.court?.courtName}</strong> on {rescheduleModalBooking.bookingDate} at {rescheduleModalBooking.startTime?.substring(0,5)}
            </div>

            {rescheduleError && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}>
                {rescheduleError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Choose New Date:</label>
              <input 
                type="date" 
                value={newDate} 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setNewDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Choose New Time Slot (60 mins):</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                {newSlots.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setSelectedNewSlot(s.startTime)}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      border: selectedNewSlot === s.startTime ? '2px solid #0f3e2e' : '1px solid #e2e8f0',
                      backgroundColor: selectedNewSlot === s.startTime ? '#0f3e2e' : (s.available ? '#ffffff' : '#f1f5f9'),
                      color: selectedNewSlot === s.startTime ? '#ffffff' : (s.available ? '#0f3e2e' : '#94a3b8'),
                      cursor: s.available ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {s.startTime.substring(0,5)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
              <button onClick={() => setRescheduleModalBooking(null)} className="btn btn-outline">
                Cancel
              </button>
              <button 
                onClick={handleConfirmReschedule} 
                disabled={rescheduling || !selectedNewSlot}
                className="btn btn-primary"
              >
                {rescheduling ? 'Validating...' : 'Confirm New Slot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', marginBottom: 12 }}>
              Cancel Court Booking?
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: 16 }}>
              Are you sure you want to cancel your reservation for <strong>{cancelModalBooking.court?.courtName}</strong> on {cancelModalBooking.bookingDate} at {cancelModalBooking.startTime?.substring(0,5)}?
            </p>

            <div className="form-group">
              <label className="form-label">Cancellation Reason:</label>
              <select 
                value={cancelReason} 
                onChange={e => setCancelReason(e.target.value)}
                className="form-control"
              >
                <option value="Schedule conflict">Schedule conflict</option>
                <option value="Weather / rain">Weather / rain</option>
                <option value="Player injury / illness">Player injury / illness</option>
                <option value="Partner unavailable">Partner unavailable</option>
                <option value="Other">Other reason</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
              <button onClick={() => setCancelModalBooking(null)} className="btn btn-outline">
                Keep Booking
              </button>
              <button 
                onClick={handleConfirmCancel} 
                disabled={cancelling}
                className="btn btn-danger"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
