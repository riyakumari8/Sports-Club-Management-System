import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { getTrialBookings, updateTrialBookingStatus } from '../services/api';

export default function TrialBookingsAdmin() {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrials = () => {
    setLoading(true);
    getTrialBookings()
      .then(res => {
        setTrials(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const notes = prompt(`Enter staff notes for status [${status}]:`);
    try {
      await updateTrialBookingStatus(id, { status, notes: notes || '' });
      fetchTrials();
    } catch {
      alert('Failed to update trial booking.');
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <span className="badge badge-warning" style={{ marginBottom: 8 }}>Staff Administration</span>
          <h1 className="title-serif" style={{ fontSize: '2.5rem', color: '#0f3e2e' }}>
            Trial Session Requests
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Review complimentary trial session applications from prospective members and assign court schedules.
          </p>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '16px 20px' }}>Applicant</th>
                <th style={{ padding: '16px 20px' }}>Sport</th>
                <th style={{ padding: '16px 20px' }}>Requested Schedule</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px' }}>Staff Notes</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    Loading trial requests...
                  </td>
                </tr>
              ) : trials.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    No trial session requests submitted yet.
                  </td>
                </tr>
              ) : trials.map(t => (
                <tr key={t.trialId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#0f3e2e' }}>{t.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.email} • {t.phone}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="badge badge-primary">{t.preferredSport}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div><strong>{t.trialDate}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {t.startTime?.substring(0,5)} – {t.endTime?.substring(0,5)}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${
                      t.status === 'APPROVED' ? 'badge-success' :
                      (t.status === 'REJECTED' ? 'badge-danger' : 'badge-warning')
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.82rem', maxWidth: 200 }}>
                    {t.staffNotes || '—'}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {t.status === 'PENDING' && (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleStatusUpdate(t.trialId, 'APPROVED')}
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: '#059669', padding: '6px 12px' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(t.trialId, 'REJECTED')}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px 12px' }}
                        >
                          Reject
                        </button>
                      </div>
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
