import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { courtService } from '../../services/courtService';
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const FrontDeskCheckInPage = () => {
  const [code, setCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    setBooking(null);

    try {
      const res = await courtService.checkInByCode(code.trim().toUpperCase());
      const data = res.booking || res;
      setBooking(data);
      setSuccessMsg('Booking verified and successfully checked in at front desk!');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid booking reference or booking is not confirmed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Front Desk & Gate Check-In"
      subtitle="Verify court booking references or scan digital QR member passes at the turnstile gate"
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Search Card */}
        <div className="cs-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: '#d1e7dd',
            color: '#0F5132',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <QrCode size={28} />
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
            Enter Booking Reference or QR Code
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Type the 12-character booking reference (e.g. <code style={{ color: '#0F5132', fontWeight: 700 }}>CS-BK-2026-CONF</code>) or scan directly from the member's mobile screen.
          </p>

          <form onSubmit={handleVerify} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              required
              placeholder="e.g. CS-BK-2026-..."
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '0.75rem 1rem',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
            >
              {loading ? 'Verifying...' : 'Check In'}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Verification Result Receipt */}
        {booking && (
          <div className="cs-card" style={{ padding: '2rem', borderTop: '4px solid #0F5132' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                  VERIFIED BOOKING PASS
                </span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                  {booking.guestName || 'Club Member'}
                </h4>
              </div>
              <Badge type={booking.bookingStatus}>{booking.bookingStatus}</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', backgroundColor: '#f8faf9', padding: '1.25rem', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Reference:</span>
                <strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{booking.bookingReference}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Court / Arena:</span>
                <strong>{booking.court?.courtName || 'Court'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Scheduled Time:</span>
                <strong>{booking.bookingDate} &bull; {booking.startTime} - {booking.endTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Payment Status:</span>
                <strong style={{ color: '#0F5132' }}>Paid (₹{booking.finalAmount})</strong>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
