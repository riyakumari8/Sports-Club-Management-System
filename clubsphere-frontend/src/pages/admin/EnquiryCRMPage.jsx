import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { courtService } from '../../services/courtService';
import {
  Users,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const EnquiryCRMPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFollowup, setActiveFollowup] = useState(null);
  const [followupText, setFollowupText] = useState('');
  const [msg, setMsg] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await courtService.getEnquiries(params);
      const list = Array.isArray(res) ? res : (res.data || []);
      setEnquiries(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await courtService.updateEnquiryStatus(id, newStatus);
      setMsg(`Enquiry updated to ${newStatus}`);
      fetchEnquiries();
    } catch (err) {
      setMsg(err.message || 'Status update failed.');
    }
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    if (!activeFollowup || !followupText.trim()) return;
    try {
      await courtService.addEnquiryFollowup(activeFollowup.enquiryId, {
        notes: followupText.trim(),
        contactedBy: 'Club Desk Admin',
        channel: 'PHONE',
      });
      setMsg('Follow-up record logged successfully!');
      setActiveFollowup(null);
      setFollowupText('');
      fetchEnquiries();
    } catch (err) {
      setMsg(err.message || 'Failed to add follow-up log.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Enquiry & Visitor CRM" subtitle="Membership lead pipeline">
        <Loader message="Loading visitor inquiries..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Visitor Enquiries & Leads CRM"
      subtitle="Track prospective member leads, campus tour requests, follow-up logs, and membership conversions"
    >
      {/* Followup Modal */}
      {activeFollowup && (
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
          <div className="cs-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Add Follow-up Log: {activeFollowup.fullName}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Record notes from telephone discussions, club facility tours, or membership trials.
            </p>

            <form onSubmit={handleAddFollowup}>
              <div style={{ marginBottom: '1.25rem' }}>
                <textarea
                  rows="3"
                  required
                  value={followupText}
                  onChange={(e) => setFollowupText(e.target.value)}
                  placeholder="e.g. Called visitor. Highly interested in Gold tennis membership. Scheduled club tour for Saturday."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setActiveFollowup(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Follow-up</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="cs-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>Pipeline Status:</label>
          {['', 'NEW', 'CONTACTED', 'CONVERTED', 'LOST'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: statusFilter === st ? '#0F5132' : '#f3f4f6',
                color: statusFilter === st ? '#ffffff' : '#4b5563',
                border: '1px solid',
                borderColor: statusFilter === st ? '#0F5132' : '#e5e7eb',
                cursor: 'pointer',
              }}
            >
              {st || 'ALL ENQUIRIES'}
            </button>
          ))}
        </div>
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

      {/* Enquiries Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {enquiries.length === 0 ? (
          <div className="cs-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            No visitor enquiries found in this category.
          </div>
        ) : (
          enquiries.map((enq) => (
            <div key={enq.enquiryId} className="cs-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F5132', textTransform: 'uppercase' }}>
                    {enq.sportInterest || 'SPORTS'} ENQUIRY
                  </span>
                  <Badge type={enq.enquiryStatus}>{enq.enquiryStatus}</Badge>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.4rem' }}>
                  {enq.fullName}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {enq.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {enq.phone}</div>
                </div>

                <p style={{ backgroundColor: '#f8faf9', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#374151', marginBottom: '1.25rem', borderLeft: '3px solid #0F5132' }}>
                  "{enq.message || 'Interested in sports membership.'}"
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveFollowup(enq)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <MessageSquare size={14} /> Add Log
                </button>
                {enq.enquiryStatus !== 'CONVERTED' && (
                  <button
                    onClick={() => handleStatusUpdate(enq.enquiryId, 'CONVERTED')}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <CheckCircle2 size={14} /> Convert
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};
