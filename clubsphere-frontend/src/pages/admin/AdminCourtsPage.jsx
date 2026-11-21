import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { courtService } from '../../services/courtService';
import {
  Layers,
  Plus,
  Edit2,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export const AdminCourtsPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [maintenanceCourt, setMaintenanceCourt] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState({
    reason: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16),
  });

  const [formData, setFormData] = useState({
    courtName: '',
    sportType: 'TENNIS',
    courtDescription: '',
    location: 'Main Arena',
    surfaceType: 'Hard Court (Plexipave)',
    capacity: 4,
    openingTime: '06:00',
    closingTime: '22:00',
    standardHourlyRate: 600,
    guestHourlyRate: 900,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchCourts = async () => {
    setLoading(true);
    try {
      const res = await courtService.getCourts();
      const list = Array.isArray(res) ? res : (res.data || []);
      setCourts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleCreateCourt = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await courtService.createCourt({
        ...formData,
        openingTime: formData.openingTime + ':00',
        closingTime: formData.closingTime + ':00',
      });
      setMsg('New court added successfully!');
      setModalOpen(false);
      fetchCourts();
    } catch (err) {
      setMsg(err.message || 'Failed to create court.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (courtId, newStatus) => {
    try {
      await courtService.updateCourtStatus(courtId, newStatus);
      setMsg(`Court status updated to ${newStatus}`);
      fetchCourts();
    } catch (err) {
      setMsg(err.message || 'Failed to update status.');
    }
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();
    if (!maintenanceCourt) return;
    try {
      await courtService.scheduleCourtMaintenance(maintenanceCourt.courtId, {
        reason: maintenanceData.reason,
        startTime: maintenanceData.startTime + ':00Z',
        endTime: maintenanceData.endTime + ':00Z',
      });
      setMsg(`Maintenance scheduled for ${maintenanceCourt.courtName}`);
      setMaintenanceCourt(null);
      fetchCourts();
    } catch (err) {
      setMsg(err.message || 'Failed to schedule maintenance.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Court & Facility Management" subtitle="Administrator facilities controller">
        <Loader message="Loading club court roster..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Court & Facility Management"
      subtitle="Manage sports arenas, turf pitches, operational hours, and maintenance blocking"
    >
      {/* Create Modal */}
      {modalOpen && (
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
          <div className="cs-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Add New Sports Court</h3>
              <button onClick={() => setModalOpen(false)} style={{ color: '#6b7280' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCourt} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Court Name</label>
                  <input
                    type="text"
                    required
                    value={formData.courtName}
                    onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    placeholder="e.g. Centre Court 4"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Sport Type</label>
                  <select
                    value={formData.sportType}
                    onChange={(e) => setFormData({ ...formData, sportType: e.target.value })}
                  >
                    <option value="TENNIS">Tennis</option>
                    <option value="CRICKET">Cricket</option>
                    <option value="PADEL">Padel</option>
                    <option value="BADMINTON">Badminton</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Pavilion B"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Surface Type</label>
                  <input
                    type="text"
                    value={formData.surfaceType}
                    onChange={(e) => setFormData({ ...formData, surfaceType: e.target.value })}
                    placeholder="e.g. Clay Court"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Standard Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={formData.standardHourlyRate}
                    onChange={(e) => setFormData({ ...formData, standardHourlyRate: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Guest Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={formData.guestHourlyRate}
                    onChange={(e) => setFormData({ ...formData, guestHourlyRate: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Add Court'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {maintenanceCourt && (
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
              Schedule Maintenance: {maintenanceCourt.courtName}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              This court will automatically block new member bookings during this maintenance window.
            </p>

            <form onSubmit={handleScheduleMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Net replacement, resurfacing, floodlight repair"
                  value={maintenanceData.reason}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setMaintenanceCourt(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Blocking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Total Registered Facilities: <strong>{courts.length}</strong>
          </span>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Add New Court</span>
        </button>
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

      {/* Courts Table */}
      <div className="cs-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="cs-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.9rem 1.25rem' }}>Court Name</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Sport</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Location / Surface</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Rate (₹/hr)</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
              <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((c) => (
              <tr key={c.courtId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#111827' }}>
                  {c.courtName}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, backgroundColor: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {c.sportType}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#4b5563', fontSize: '0.85rem' }}>
                  {c.location} &bull; {c.surfaceType}
                </td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0F5132' }}>
                  ₹{c.standardHourlyRate}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <Badge type={c.courtStatus}>{c.courtStatus}</Badge>
                </td>
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    {c.courtStatus === 'AVAILABLE' ? (
                      <button
                        onClick={() => handleStatusChange(c.courtId, 'UNDER_MAINTENANCE')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Set Maintenance
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(c.courtId, 'AVAILABLE')}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Set Available
                      </button>
                    )}
                    <button
                      onClick={() => setMaintenanceCourt(c)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Schedule
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};
