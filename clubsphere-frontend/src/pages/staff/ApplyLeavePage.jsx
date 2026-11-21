import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { CalendarX, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const ApplyLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await staffService.getMyLeaves();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setSubmitting(true);
    try {
      await staffService.applyLeave(formData);
      setSuccess('Leave application submitted successfully for administrator review!');
      setFormData({
        leaveType: 'CASUAL',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: '',
      });
      fetchLeaves();
    } catch (err) {
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Staff Leave Application Portal"
      subtitle="Submit leave requests and monitor status and administrative review remarks"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Application Form */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <CalendarX size={20} color="#0F5132" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>New Leave Application</h3>
          </div>

          {success && (
            <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {success}
            </div>
          )}

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Leave Category</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              >
                <option value="CASUAL">Casual Leave (CL)</option>
                <option value="SICK">Medical / Sick Leave (SL)</option>
                <option value="ANNUAL">Annual / Earned Leave (AL)</option>
                <option value="UNPAID">Leave Without Pay (LWP)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Absence *</label>
              <textarea
                rows={3}
                required
                placeholder="Brief explanation for leave"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              {submitting ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </form>
        </div>

        {/* My Leave Requests Table */}
        <div className="cs-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
            My Leave Request History
          </h3>

          {loading ? (
            <Loader message="Loading leave history..." />
          ) : (
            <div className="cs-table-container">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date Window</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Admin Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length > 0 ? (
                    leaves.map((l) => (
                      <tr key={l.id}>
                        <td><strong>{l.leaveType}</strong></td>
                        <td style={{ fontSize: '0.85rem' }}>{l.startDate} to {l.endDate}</td>
                        <td style={{ fontWeight: 700 }}>{l.totalDays}d</td>
                        <td><Badge type={l.status}>{l.status}</Badge></td>
                        <td style={{ fontSize: '0.8rem', color: '#4b5563', maxWidth: '200px' }}>
                          {l.adminRemarks || (l.status === 'PENDING' ? 'Under Review' : 'None')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                        No leave applications submitted.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
