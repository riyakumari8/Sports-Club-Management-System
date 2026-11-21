import React, { useEffect, useState } from 'react';
import { 
  Trophy, Plus, Edit2, Trash2, AlertTriangle, 
  Clock, Shield, X, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { 
  getCourts, createCourt, updateCourt, 
  updateCourtStatus, deactivateCourt, scheduleCourtMaintenance 
} from '../services/api';

export default function CourtDashboard() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [courtModal, setCourtModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [courtForm, setCourtForm] = useState({
    courtName: '',
    sportType: 'TENNIS',
    courtDescription: '',
    location: '',
    surfaceType: 'Hard Court',
    capacity: 4,
    openingTime: '06:00',
    closingTime: '22:00',
    standardHourlyRate: 500,
    guestHourlyRate: 750,
    courtStatus: 'AVAILABLE',
    imageUrl: ''
  });

  // Maintenance Modal
  const [maintModalCourt, setMaintModalCourt] = useState(null);
  const [maintForm, setMaintForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '16:00',
    reason: 'Surface leveling and net replacement',
    createdBy: 'Club Admin'
  });

  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const fetchCourts = () => {
    setLoading(true);
    getCourts()
      .then(res => {
        setCourts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const openAddModal = () => {
    setEditingCourt(null);
    setCourtForm({
      courtName: '',
      sportType: 'TENNIS',
      courtDescription: '',
      location: '',
      surfaceType: 'Hard Court',
      capacity: 4,
      openingTime: '06:00',
      closingTime: '22:00',
      standardHourlyRate: 500,
      guestHourlyRate: 750,
      courtStatus: 'AVAILABLE',
      imageUrl: ''
    });
    setCourtModal(true);
  };

  const openEditModal = (court) => {
    setEditingCourt(court);
    setCourtForm({
      courtName: court.courtName,
      sportType: court.sportType,
      courtDescription: court.courtDescription || '',
      location: court.location || '',
      surfaceType: court.surfaceType || '',
      capacity: court.capacity || 4,
      openingTime: court.openingTime.substring(0,5),
      closingTime: court.closingTime.substring(0,5),
      standardHourlyRate: court.standardHourlyRate,
      guestHourlyRate: court.guestHourlyRate,
      courtStatus: court.courtStatus,
      imageUrl: court.imageUrl || ''
    });
    setCourtModal(true);
  };

  const handleSaveCourt = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...courtForm,
        openingTime: courtForm.openingTime.length === 5 ? courtForm.openingTime + ':00' : courtForm.openingTime,
        closingTime: courtForm.closingTime.length === 5 ? courtForm.closingTime + ':00' : courtForm.closingTime,
      };

      if (editingCourt) {
        await updateCourt(editingCourt.courtId, payload);
        setFeedback({ text: 'Court updated successfully!', type: 'success' });
      } else {
        await createCourt(payload);
        setFeedback({ text: 'New court added successfully!', type: 'success' });
      }
      setCourtModal(false);
      fetchCourts();
    } catch (err) {
      setFeedback({ text: err.response?.data?.message || 'Error saving court.', type: 'error' });
    }
  };

  const handleStatusChange = async (courtId, newStatus) => {
    try {
      await updateCourtStatus(courtId, newStatus);
      fetchCourts();
    } catch (err) {
      alert('Failed to update court status.');
    }
  };

  const handleDeleteCourt = async (courtId) => {
    if (!window.confirm('Are you sure you want to deactivate this court?')) return;
    try {
      await deactivateCourt(courtId);
      fetchCourts();
    } catch (err) {
      alert('Error deactivating court.');
    }
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();
    try {
      const startIso = `${maintForm.date}T${maintForm.startTime}:00+05:30`;
      const endIso = `${maintForm.date}T${maintForm.endTime}:00+05:30`;

      await scheduleCourtMaintenance(maintModalCourt.courtId, {
        startTime: startIso,
        endTime: endIso,
        reason: maintForm.reason,
        createdBy: maintForm.createdBy
      });
      setFeedback({ text: 'Maintenance blackout scheduled successfully! Slots in this window are now blocked.', type: 'success' });
      setMaintModalCourt(null);
      fetchCourts();
    } catch (err) {
      setFeedback({ text: err.response?.data?.message || 'Failed to schedule maintenance.', type: 'error' });
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: 8 }}>Staff Administration</span>
            <h1 className="title-serif" style={{ fontSize: '2.5rem', color: '#0f3e2e' }}>
              Court & Facility Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Add new playing courts, configure pricing rules, toggle court availability, and schedule maintenance blackouts.
            </p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add New Court
          </button>
        </div>

        {feedback.text && (
          <div style={{ backgroundColor: feedback.type === 'success' ? '#d1fae5' : '#fee2e2', color: feedback.type === 'success' ? '#065f46' : '#991b1b', padding: '12px 18px', borderRadius: 10, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <strong>{feedback.text}</strong>
          </div>
        )}

        {/* Court Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '16px 20px' }}>Court Name & Sport</th>
                <th style={{ padding: '16px 20px' }}>Location / Surface</th>
                <th style={{ padding: '16px 20px' }}>Operating Hours</th>
                <th style={{ padding: '16px 20px' }}>Member / Guest Rate</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    Loading courts...
                  </td>
                </tr>
              ) : courts.map(c => (
                <tr key={c.courtId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#0f3e2e', fontSize: '1rem' }}>{c.courtName}</div>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginTop: 4 }}>
                      {c.sportType}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569' }}>
                    <div>{c.location || 'Main Arena'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.surfaceType || 'Hard Court'}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569' }}>
                    {c.openingTime.substring(0,5)} – {c.closingTime.substring(0,5)}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#0f3e2e' }}>₹ {c.standardHourlyRate} / hr</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Guest: ₹ {c.guestHourlyRate}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <select
                      value={c.courtStatus}
                      onChange={e => handleStatusChange(c.courtId, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        backgroundColor: 
                          c.courtStatus === 'AVAILABLE' ? '#d1fae5' :
                          (c.courtStatus === 'UNDER_MAINTENANCE' ? '#fef3c7' : '#fee2e2'),
                        color: 
                          c.courtStatus === 'AVAILABLE' ? '#065f46' :
                          (c.courtStatus === 'UNDER_MAINTENANCE' ? '#92400e' : '#991b1b')
                      }}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                      <option value="TEMPORARILY_CLOSED">TEMPORARILY CLOSED</option>
                      <option value="BOOKED">BOOKED</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <button
                        onClick={() => setMaintModalCourt(c)}
                        className="btn btn-outline btn-sm"
                        title="Schedule Maintenance"
                      >
                        <Clock size={14} color="#d97706" /> Maintenance
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        className="btn btn-outline btn-sm"
                        title="Edit Court"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourt(c.courtId)}
                        className="btn btn-danger btn-sm"
                        title="Deactivate Court"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Court Modal */}
      {courtModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f3e2e' }}>
                {editingCourt ? 'Edit Court Facility' : 'Add New Playing Court'}
              </h3>
              <button onClick={() => setCourtModal(false)} style={{ background: 'none' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveCourt}>
              <div className="form-group">
                <label className="form-label">Court Name *</label>
                <input 
                  type="text" 
                  value={courtForm.courtName} 
                  onChange={e => setCourtForm({...courtForm, courtName: e.target.value})}
                  className="form-control" 
                  placeholder="e.g. Centre Court 1" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Sport Type *</label>
                  <select 
                    value={courtForm.sportType} 
                    onChange={e => setCourtForm({...courtForm, sportType: e.target.value})}
                    className="form-control"
                  >
                    <option value="TENNIS">Tennis</option>
                    <option value="CRICKET">Cricket</option>
                    <option value="PADEL">Padel</option>
                    <option value="BADMINTON">Badminton</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location / Pavilion</label>
                  <input 
                    type="text" 
                    value={courtForm.location} 
                    onChange={e => setCourtForm({...courtForm, location: e.target.value})}
                    className="form-control" 
                    placeholder="e.g. Outdoor Pavilion A" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Surface Type</label>
                  <input 
                    type="text" 
                    value={courtForm.surfaceType} 
                    onChange={e => setCourtForm({...courtForm, surfaceType: e.target.value})}
                    className="form-control" 
                    placeholder="e.g. Red Clay, Acrylic Hard" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Player Capacity</label>
                  <input 
                    type="number" 
                    value={courtForm.capacity} 
                    onChange={e => setCourtForm({...courtForm, capacity: Number(e.target.value)})}
                    className="form-control" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Opening Time</label>
                  <input 
                    type="time" 
                    value={courtForm.openingTime} 
                    onChange={e => setCourtForm({...courtForm, openingTime: e.target.value})}
                    className="form-control" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Closing Time</label>
                  <input 
                    type="time" 
                    value={courtForm.closingTime} 
                    onChange={e => setCourtForm({...courtForm, closingTime: e.target.value})}
                    className="form-control" 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Standard Member Rate (₹ / hr) *</label>
                  <input 
                    type="number" 
                    value={courtForm.standardHourlyRate} 
                    onChange={e => setCourtForm({...courtForm, standardHourlyRate: Number(e.target.value)})}
                    className="form-control" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Guest Rate (₹ / hr) *</label>
                  <input 
                    type="number" 
                    value={courtForm.guestHourlyRate} 
                    onChange={e => setCourtForm({...courtForm, guestHourlyRate: Number(e.target.value)})}
                    className="form-control" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Court Image URL</label>
                <input 
                  type="url" 
                  value={courtForm.imageUrl} 
                  onChange={e => setCourtForm({...courtForm, imageUrl: e.target.value})}
                  className="form-control" 
                  placeholder="https://..." 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  rows={2} 
                  value={courtForm.courtDescription} 
                  onChange={e => setCourtForm({...courtForm, courtDescription: e.target.value})}
                  className="form-control" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setCourtModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCourt ? 'Update Court' : 'Save Court'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Maintenance Modal */}
      {maintModalCourt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 460 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', marginBottom: 8 }}>
              Schedule Maintenance Block
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: 20 }}>
              Blocking slots on <strong>{maintModalCourt.courtName}</strong> for surface care or net repairs.
            </p>

            <form onSubmit={handleScheduleMaintenance}>
              <div className="form-group">
                <label className="form-label">Date:</label>
                <input 
                  type="date" 
                  value={maintForm.date} 
                  onChange={e => setMaintForm({...maintForm, date: e.target.value})}
                  className="form-control" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Start Time:</label>
                  <input 
                    type="time" 
                    value={maintForm.startTime} 
                    onChange={e => setMaintForm({...maintForm, startTime: e.target.value})}
                    className="form-control" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time:</label>
                  <input 
                    type="time" 
                    value={maintForm.endTime} 
                    onChange={e => setMaintForm({...maintForm, endTime: e.target.value})}
                    className="form-control" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Maintenance Reason:</label>
                <input 
                  type="text" 
                  value={maintForm.reason} 
                  onChange={e => setMaintForm({...maintForm, reason: e.target.value})}
                  className="form-control" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setMaintModalCourt(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#d97706' }}>
                  Block Maintenance Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
