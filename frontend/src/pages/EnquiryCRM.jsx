import React, { useEffect, useState } from 'react';
import { UserCheck, MessageSquare, Plus, Phone, Mail, CheckCircle2, UserPlus, X } from 'lucide-react';
import { getEnquiries, addEnquiryFollowup, convertEnquiryToMember, getEnquiryFollowups } from '../services/api';

export default function EnquiryCRM() {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Follow-up modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [followupNotes, setFollowupNotes] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [staffName, setStaffName] = useState('Front Desk Executive');
  const [updatedStatus, setUpdatedStatus] = useState('CONTACTED');
  const [historyNotes, setHistoryNotes] = useState([]);
  const [savingNote, setSavingNote] = useState(false);

  const fetchEnquiries = () => {
    setLoading(true);
    getEnquiries({
      status: statusFilter || null,
      sport: sportFilter || null,
      search: searchTerm || null
    })
      .then(res => {
        setEnquiries(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, sportFilter, searchTerm]);

  const openFollowupModal = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    setFollowupNotes('');
    setNextDate('');
    try {
      const res = await getEnquiryFollowups(enquiry.enquiryId);
      setHistoryNotes(res.data);
    } catch {
      setHistoryNotes([]);
    }
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    if (!followupNotes.trim()) return;

    setSavingNote(true);
    try {
      await addEnquiryFollowup(selectedEnquiry.enquiryId, {
        notes: followupNotes,
        nextFollowupDate: nextDate || null,
        staffName,
        updatedStatus
      });
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      alert('Failed to log followup note.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleConvert = async (enquiryId) => {
    if (!window.confirm('Convert this prospective lead into an active club member? This connects with Riya\'s User Management.')) return;
    try {
      await convertEnquiryToMember(enquiryId);
      alert('Enquiry converted successfully! Member account created.');
      fetchEnquiries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to convert enquiry.');
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <span className="badge badge-warning" style={{ marginBottom: 8 }}>Front Office CRM</span>
          <h1 className="title-serif" style={{ fontSize: '2.5rem', color: '#0f3e2e' }}>
            Enquiry & Lead Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Track prospective member leads, record staff follow-up calls, and convert leads into active club members.
          </p>
        </div>

        {/* Filter Card */}
        <div className="card" style={{ marginBottom: 28, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px' }}
            />
          </div>

          <div style={{ width: 180 }}>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px' }}
            >
              <option value="">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="FOLLOW_UP_REQUIRED">FOLLOW UP REQUIRED</option>
              <option value="CONVERTED">CONVERTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div style={{ width: 160 }}>
            <select 
              value={sportFilter} 
              onChange={e => setSportFilter(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px' }}
            >
              <option value="">All Sports</option>
              <option value="TENNIS">Tennis</option>
              <option value="CRICKET">Cricket</option>
            </select>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '16px 20px' }}>Lead Contact</th>
                <th style={{ padding: '16px 20px' }}>Interest</th>
                <th style={{ padding: '16px 20px' }}>Inquiry Message</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    Loading leads...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    No enquiries found.
                  </td>
                </tr>
              ) : enquiries.map(e => (
                <tr key={e.enquiryId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#0f3e2e', fontSize: '0.98rem' }}>{e.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{e.email} • {e.phone}</div>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Prefers: {e.preferredContactMethod}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div><strong>{e.interestedSport || 'General'}</strong></div>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginTop: 2 }}>
                      {e.interestedPlan || 'SILVER'} PLAN
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569', maxWidth: 280 }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.4 }}>
                      {e.enquiryMessage || 'No initial message entered.'}
                    </p>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${
                      e.status === 'NEW' ? 'badge-primary' :
                      (e.status === 'CONVERTED' ? 'badge-success' : 
                      (e.status === 'FOLLOW_UP_REQUIRED' ? 'badge-warning' : 'badge-outline'))
                    }`}>
                      {e.status.replace('_', ' ')}
                    </span>
                    {e.convertedMemberId && (
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                        Member #{e.convertedMemberId}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <button
                        onClick={() => openFollowupModal(e)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <MessageSquare size={14} /> Follow-Up
                      </button>

                      {e.status !== 'CONVERTED' && (
                        <button
                          onClick={() => handleConvert(e.enquiryId)}
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <UserPlus size={14} /> Convert
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Follow-Up Modal */}
      {selectedEnquiry && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f3e2e' }}>
                Follow-Up: {selectedEnquiry.fullName}
              </h3>
              <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'none' }}><X size={20} /></button>
            </div>

            {/* Interaction history */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                Interaction Log ({historyNotes.length} entries)
              </h4>
              <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
                {historyNotes.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No follow-up interactions recorded yet.</div>
                ) : historyNotes.map(n => (
                  <div key={n.followupId} style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, fontSize: '0.82rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 600, color: '#0f3e2e' }}>{n.notes}</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                      Logged by {n.createdByStaff}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddFollowup}>
              <div className="form-group">
                <label className="form-label">New Follow-Up Notes *</label>
                <textarea 
                  rows={3} 
                  value={followupNotes} 
                  onChange={e => setFollowupNotes(e.target.value)}
                  className="form-control" 
                  placeholder="e.g. Spoke with client regarding junior coaching schedules..."
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Next Follow-Up Date</label>
                  <input 
                    type="date" 
                    value={nextDate} 
                    onChange={e => setNextDate(e.target.value)}
                    className="form-control" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Update Status</label>
                  <select 
                    value={updatedStatus} 
                    onChange={e => setUpdatedStatus(e.target.value)}
                    className="form-control"
                  >
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="FOLLOW_UP_REQUIRED">FOLLOW UP REQUIRED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
                <button type="button" onClick={() => setSelectedEnquiry(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={savingNote} className="btn btn-primary">
                  {savingNote ? 'Saving...' : 'Save Follow-Up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
