import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { CalendarX, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export const LeaveApprovalPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decision, setDecision] = useState('APPROVED');
  const [adminRemarks, setAdminRemarks] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await staffService.getAllLeaves(statusFilter);
      setLeaves(data);
    } catch (err) {
      console.error('Failed to load leave requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const openReview = (leave, action) => {
    setSelectedLeave(leave);
    setDecision(action);
    setAdminRemarks(action === 'APPROVED' ? 'Approved by Admin' : 'Leave request cannot be granted due to schedule clashes');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffService.reviewLeave(selectedLeave.id, {
        status: decision,
        adminRemarks,
      });
      alert(`Leave request ${decision.toLowerCase()} successfully!`);
      setReviewModalOpen(false);
      fetchLeaves();
    } catch (err) {
      alert(err.message || 'Failed to update leave request');
    }
  };

  return (
    <DashboardLayout
      title="Staff Leave Approvals"
      subtitle="Review, approve, or reject employee leave applications"
    >
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Applications</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Total <strong>{leaves.length}</strong> applications on record
        </div>
      </div>

      {loading ? (
        <Loader message="Loading leave applications..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Date Window</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Reviewed By</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{l.employeeName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{l.departmentName}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{l.leaveType}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {l.startDate} to {l.endDate}
                    </td>
                    <td style={{ fontWeight: 700 }}>{l.totalDays}d</td>
                    <td style={{ fontSize: '0.85rem', maxWidth: '240px' }}>
                      <div>{l.reason}</div>
                      {l.adminRemarks && (
                        <div style={{ fontSize: '0.75rem', color: '#0F5132', fontStyle: 'italic', marginTop: '2px' }}>
                          Admin: "{l.adminRemarks}"
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge type={l.status}>{l.status}</Badge>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {l.reviewedByName ? `${l.reviewedByName}` : 'Awaiting Review'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {l.status === 'PENDING' ? (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => openReview(l, 'APPROVED')}
                            className="btn btn-primary btn-sm"
                            style={{ gap: '4px', background: '#16a34a' }}
                            title="Approve Leave"
                          >
                            <CheckCircle size={15} /> Approve
                          </button>
                          <button
                            onClick={() => openReview(l, 'REJECTED')}
                            className="btn btn-danger btn-sm"
                            style={{ gap: '4px' }}
                            title="Reject Leave"
                          >
                            <XCircle size={15} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No leave requests found matching selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= REVIEW LEAVE MODAL ================= */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review Leave: ${decision === 'APPROVED' ? 'Approve Application' : 'Reject Application'}`}
      >
        {selectedLeave && (
          <form onSubmit={handleReviewSubmit}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 700, color: '#1f2937' }}>{selectedLeave.employeeName} ({selectedLeave.departmentName})</div>
              <div style={{ color: '#4b5563', marginTop: '4px' }}>
                {selectedLeave.leaveType} Leave: <strong>{selectedLeave.startDate}</strong> to <strong>{selectedLeave.endDate}</strong> ({selectedLeave.totalDays} days)
              </div>
              <div style={{ marginTop: '6px', fontSize: '0.85rem', color: '#6b7280' }}>
                Reason: "{selectedLeave.reason}"
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Remarks / Instructions</label>
              <textarea
                rows={3}
                required
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                className={decision === 'APPROVED' ? 'btn btn-primary' : 'btn btn-danger'}
              >
                Confirm {decision}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
};
