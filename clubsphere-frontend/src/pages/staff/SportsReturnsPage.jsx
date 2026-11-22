import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { sportsShopStaffService } from '../../services/sportsShopStaffService';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Check,
} from 'lucide-react';

export const SportsReturnsPage = () => {
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: 'APPROVED',
    condition: 'SELLABLE',
    notes: 'Item verified in mint original box condition; approved for restock and refund.',
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const data = await sportsShopStaffService.getReturns();
      setReturnsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load returns', err);
      setNotification({ type: 'error', message: err.message || 'Failed to fetch returns' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const openReviewModal = (r) => {
    setSelectedReturn(r);
    setReviewForm({
      status: 'APPROVED',
      condition: r.condition || 'SELLABLE',
      notes: 'Item verified in mint original box condition; approved for restock and refund.',
    });
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReturn) return;
    setSubmitting(true);
    try {
      await sportsShopStaffService.reviewReturn(selectedReturn.id, reviewForm);
      setNotification({
        type: 'success',
        message: `Return #${selectedReturn.returnNumber} status updated to ${reviewForm.status}. ${
          reviewForm.condition === 'SELLABLE' && reviewForm.status === 'APPROVED' ? 'Stock has been automatically restocked to inventory.' : ''
        }`,
      });
      setReviewModalOpen(false);
      fetchReturns();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Review failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Sports Accessories Returns & Exchanges"
      subtitle="Review customer return claims, inspect equipment conditions, and trigger auto-restocking"
    >
      {notification && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          background: notification.type === 'success' ? '#d1e7dd' : '#f8d7da',
          color: notification.type === 'success' ? '#0f5132' : '#842029',
          border: `1px solid ${notification.type === 'success' ? '#badbcc' : '#f5c2c7'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            &times;
          </button>
        </div>
      )}

      <div className="cs-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
            Returns Queue & Inspection Log
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Total requests: <strong>{returnsList.length}</strong>
          </span>
        </div>

        {loading ? (
          <Loader message="Loading returns log..." />
        ) : returnsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
            <RotateCcw size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h4>No return requests recorded</h4>
            <p style={{ fontSize: '0.85rem' }}>Customer returns and warranty claims will appear here.</p>
          </div>
        ) : (
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Return #</th>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Reason</th>
                  <th>Condition</th>
                  <th>Refund Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {returnsList.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{r.returnNumber}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {r.order?.orderNumber || 'SP-ORD-MANUAL'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                    </td>
                    <td style={{ maxWidth: '220px', fontSize: '0.85rem' }}>
                      {r.reason}
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: r.condition === 'SELLABLE' ? '#d1fae5' : '#fee2e2',
                        color: r.condition === 'SELLABLE' ? '#065f46' : '#991b1b',
                      }}>
                        {r.condition}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#1f2937' }}>₹{Number(r.refundAmount).toLocaleString()}</strong>
                    </td>
                    <td>
                      <Badge type={r.status}>{r.status.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => openReviewModal(r)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Return Modal */}
      {reviewModalOpen && selectedReturn && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '540px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2937' }}>
                Review Return #{selectedReturn.returnNumber}
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>Customer: <strong>{selectedReturn.customerName}</strong></div>
              <div>Reason: <em>"{selectedReturn.reason}"</em></div>
              <div style={{ marginTop: '4px' }}>
                Refund: <strong style={{ color: '#0F5132' }}>₹{Number(selectedReturn.refundAmount).toLocaleString()}</strong>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Inspection Condition *</label>
                <select
                  value={reviewForm.condition}
                  onChange={(e) => setReviewForm({ ...reviewForm, condition: e.target.value })}
                  required
                >
                  <option value="SELLABLE">SELLABLE (Unopened, pristine packaging - Restockable)</option>
                  <option value="DAMAGED">DAMAGED (Scratched / Used - Do not restock)</option>
                  <option value="DEFECTIVE">DEFECTIVE (Manufacturer defect - Return to vendor)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Review Decision *</label>
                <select
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                  required
                >
                  <option value="APPROVED">APPROVED (Approve refund request)</option>
                  <option value="REJECTED">REJECTED (Decline return request)</option>
                  <option value="REFUNDED">REFUNDED (Refund processed and credited)</option>
                </select>
              </div>

              {reviewForm.condition === 'SELLABLE' && reviewForm.status === 'APPROVED' && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Approving as SELLABLE will automatically add product stock back to inventory.
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Staff Inspection Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.notes}
                  onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Updating...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SportsReturnsPage;
