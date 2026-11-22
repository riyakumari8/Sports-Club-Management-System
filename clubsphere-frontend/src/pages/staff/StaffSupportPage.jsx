import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { staffDepartmentService } from '../../services/staffDepartmentService';
import {
  LifeBuoy,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export const StaffSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'OPERATIONAL',
    priority: 'MEDIUM',
    subject: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await staffDepartmentService.getSupportTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load support tickets', err);
      setNotification({ type: 'error', message: err.message || 'Failed to fetch tickets' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await staffDepartmentService.createSupportTicket(formData);
      setNotification({ type: 'success', message: 'Support ticket successfully submitted! Management will review shortly.' });
      setNewModalOpen(false);
      setFormData({
        category: 'OPERATIONAL',
        priority: 'MEDIUM',
        subject: '',
        description: '',
      });
      fetchTickets();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to submit ticket' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Staff Operational Support Desk"
      subtitle="Report POS hardware issues, kitchen equipment faults, or roster questions directly to admin"
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
              My Department Support Requests
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Track ticket resolution status with administration
            </span>
          </div>

          <button
            onClick={() => setNewModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={16} /> Raise Support Ticket
          </button>
        </div>

        {loading ? (
          <Loader message="Loading support tickets..." />
        ) : tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
            <LifeBuoy size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h4>No support tickets logged</h4>
            <p style={{ fontSize: '0.85rem' }}>Need assistance with equipment or shifts? Raise a ticket above.</p>
          </div>
        ) : (
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Department</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Logged Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td><strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{t.ticketNumber}</strong></td>
                    <td>{t.departmentCode}</td>
                    <td><span style={{ fontSize: '0.85rem' }}>{t.category}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.description?.slice(0, 60)}...</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: t.priority === 'HIGH' || t.priority === 'URGENT' ? '#fee2e2' : '#f3f4f6',
                        color: t.priority === 'HIGH' || t.priority === 'URGENT' ? '#dc2626' : '#4b5563',
                      }}>
                        {t.priority}
                      </span>
                    </td>
                    <td><Badge type={t.status}>{t.status}</Badge></td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {newModalOpen && (
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
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2937' }}>
                Raise Staff Support Ticket
              </h3>
              <button
                onClick={() => setNewModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="EQUIPMENT_FAULT">EQUIPMENT FAULT</option>
                    <option value="POS_HARDWARE">POS / PRINTER ISSUE</option>
                    <option value="INVENTORY_DISCREPANCY">INVENTORY DISCREPANCY</option>
                    <option value="ATTENDANCE_CORRECTION">ATTENDANCE / SHIFT</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    required
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT (Action Blocking)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Issue Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Receipt printer paper feed jammed"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the issue, location, and any error message..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StaffSupportPage;
