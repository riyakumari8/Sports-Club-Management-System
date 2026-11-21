import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import { checkInByCode } from '../services/api';

export default function FrontDeskCheckIn() {
  const [codeInput, setCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [errorResult, setErrorResult] = useState('');

  const handleScanCheckIn = async (e) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setLoading(true);
    setCheckInResult(null);
    setErrorResult('');

    try {
      const res = await checkInByCode(codeInput.trim());
      setCheckInResult(res.data);
      setCodeInput('');
    } catch (err) {
      setErrorResult(err.response?.data?.message || 'Check-in failed. Please verify the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="badge badge-warning" style={{ marginBottom: 12 }}>Front Desk Operations</span>
          <h1 className="title-serif" style={{ fontSize: '2.5rem', color: '#0f3e2e', marginBottom: 10 }}>
            Reception QR Check-In Desk
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Scan player QR passes or enter booking references to verify court access and record arrival timestamps.
          </p>
        </div>

        {/* Input Box Card */}
        <div className="card" style={{ padding: 36, marginBottom: 32 }}>
          <form onSubmit={handleScanCheckIn}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '1rem', marginBottom: 10 }}>
                Scan QR Code / Enter Booking Reference:
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input 
                  type="text" 
                  value={codeInput} 
                  onChange={e => setCodeInput(e.target.value)}
                  placeholder="e.g. CS-20261123-ABCD" 
                  className="form-control"
                  style={{ fontSize: '1.1rem', padding: '14px 16px', letterSpacing: '0.05em' }}
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={loading || !codeInput.trim()}
                  className="btn btn-primary"
                  style={{ padding: '0 28px', flexShrink: 0 }}
                >
                  {loading ? 'Verifying...' : 'Check In'}
                </button>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color="#10b981" />
              Automated duplicate check-in prevention active.
            </div>
          </form>
        </div>

        {/* Success Result Card */}
        {checkInResult && (
          <div className="card" style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', padding: 28, textAlign: 'center', animation: 'modalEnter 0.25s ease' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#14532d', marginBottom: 6 }}>
              {checkInResult.message}
            </h3>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f3e2e', margin: '8px 0' }}>
              Reference: {checkInResult.bookingReference}
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, margin: '16px auto', maxWidth: 440, textAlign: 'left', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Court Facility:</span>
                <strong style={{ color: '#0f3e2e' }}>{checkInResult.courtName} ({checkInResult.sportType})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Match Session:</span>
                <strong>{checkInResult.sessionTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Check-In Timestamp:</span>
                <strong style={{ color: '#16a34a' }}>Recorded Just Now</strong>
              </div>
            </div>
          </div>
        )}

        {/* Error Card */}
        {errorResult && (
          <div className="card" style={{ backgroundColor: '#fef2f2', border: '2px solid #ef4444', padding: 24, textAlign: 'center', animation: 'modalEnter 0.25s ease' }}>
            <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', marginBottom: 6 }}>
              Check-In Verification Denied
            </h4>
            <p style={{ color: '#7f1d1d', fontSize: '0.95rem' }}>
              {errorResult}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
