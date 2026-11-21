import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { courtService } from '../../services/courtService';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  QrCode,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const MyCourtBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await courtService.getMyBookings(user?.id || 1);
      const list = Array.isArray(res) ? res : (res.data || []);
      setBookings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      await courtService.cancelBooking(cancelModalBooking.bookingId, cancelReason || 'Cancelled by member');
      setMsg('Booking cancelled successfully.');
      setCancelModalBooking(null);
      setCancelReason('');
      fetchBookings();
    } catch (err) {
      setMsg(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Court Bookings" subtitle="Personal reservation schedule">
        <Loader message="Loading your court bookings..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Court Bookings"
      subtitle="View your active reservations, verify check-in QR codes, or manage match cancellations"
    >
      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="cs-card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem' }}>
              Cancel Court Booking
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Are you sure you want to cancel booking <strong style={{ color: '#111827' }}>{cancelModalBooking.bookingReference}</strong>?
            </p>

            <form onSubmit={handleCancelSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Reason for Cancellation
                </label>
                <textarea
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule conflict or rain forecast..."
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 1rem' }}
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="btn btn-danger"
                  style={{ padding: '0.55rem 1.25rem' }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Showing {bookings.length} reservations for <strong>{user?.fullName}</strong>
          </span>
        </div>
        <Link to="/member/book-court" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Book a New Court</span>
        </Link>
      </div>

      {msg && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}>
          {msg}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="cs-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Calendar size={48} color="#0F5132" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            No Active Court Bookings Found
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You haven't reserved any sports courts yet. Explore our championship tennis courts and cricket nets!
          </p>
          <Link to="/member/book-court" className="btn btn-primary">
            Reserve Your First Court
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((b) => (
            <div key={b.bookingId} className="cs-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#0F5132' }}>
                    {b.bookingReference}
                  </span>
                  <Badge type={b.bookingStatus}>{b.bookingStatus}</Badge>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                  {b.court?.courtName || 'Club Court'}
                </h4>
                <div style={{ display: 'flex', gap: '16px', color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
                  <span>📅 {b.bookingDate}</span>
                  <span>⏰ {b.startTime} - {b.endTime}</span>
                  <span>💰 Fee: ₹{b.finalAmount}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {b.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => setCancelModalBooking(b)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                  >
                    Cancel Booking
                  </button>
                )}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  color: '#065f46',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <QrCode size={16} /> QR Gate Pass Ready
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
