import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { foodShopStaffService } from '../../services/foodShopStaffService';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Armchair,
} from 'lucide-react';

export const FoodTableManagementPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [targetStatus, setTargetStatus] = useState('AVAILABLE');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const data = await foodShopStaffService.getTables();
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load cafe tables', err);
      setNotification({ type: 'error', message: err.message || 'Failed to fetch tables' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openTableModal = (t) => {
    setSelectedTable(t);
    setTargetStatus(t.status || 'AVAILABLE');
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    setSubmitting(true);
    try {
      await foodShopStaffService.updateTableStatus(selectedTable.id, targetStatus);
      setNotification({ type: 'success', message: `Table ${selectedTable.tableNumber} status updated to ${targetStatus}!` });
      setSelectedTable(null);
      fetchTables();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to update table' });
    } finally {
      setSubmitting(false);
    }
  };

  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;

  return (
    <DashboardLayout
      title="Cafe Table Floor Management"
      subtitle="Real-time table occupancy, seating assignments, and turnaround status tracking"
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

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="cs-card">
          <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Available Tables</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {availableCount}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Ready for guests</span>
        </div>

        <div className="cs-card">
          <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Occupied Tables</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
            {occupiedCount}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Dining in progress</span>
        </div>

        <div className="cs-card">
          <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Total Capacity</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>
            {tables.reduce((sum, t) => sum + (t.capacity || 4), 0)} Seats
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Across {tables.length} tables</span>
        </div>
      </div>

      {/* Tables Visual Grid */}
      <div className="cs-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
            Floor Plan & Table Layout
          </h3>
          <button
            onClick={fetchTables}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} /> Refresh Floor
          </button>
        </div>

        {loading ? (
          <Loader message="Loading cafe floor layout..." />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {tables.map((t) => {
              const isOccupied = t.status === 'OCCUPIED';
              const isAvailable = t.status === 'AVAILABLE';
              const isCleaning = t.status === 'CLEANING';
              const isReserved = t.status === 'RESERVED';

              const statusColor = isOccupied
                ? '#dc2626'
                : isAvailable
                ? '#059669'
                : isCleaning
                ? '#d97706'
                : '#2563eb';

              const statusBg = isOccupied
                ? '#fef2f2'
                : isAvailable
                ? '#ecfdf5'
                : isCleaning
                ? '#fffbeb'
                : '#eff6ff';

              return (
                <div
                  key={t.id}
                  onClick={() => openTableModal(t)}
                  style={{
                    border: `2px solid ${statusColor}`,
                    background: statusBg,
                    borderRadius: '14px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937' }}>
                        {t.tableNumber}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {t.section ? t.section.replace(/_/g, ' ') : 'MAIN CAFE'}
                      </span>
                    </div>

                    <span style={{
                      background: statusColor,
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}>
                      {t.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#4b5563' }}>
                      <Users size={14} /> {t.capacity} Guests
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#0F5132', fontWeight: 600 }}>
                      Change &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Change Status Modal */}
      {selectedTable && (
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
            maxWidth: '440px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2937' }}>
                Update Table {selectedTable.tableNumber}
              </h3>
              <button
                onClick={() => setSelectedTable(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleStatusChange}>
              <div className="form-group">
                <label className="form-label">Current Table Status *</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  required
                >
                  <option value="AVAILABLE">AVAILABLE (Vacant and ready for seating)</option>
                  <option value="OCCUPIED">OCCUPIED (Guests seated & dining)</option>
                  <option value="CLEANING">CLEANING (Bussing / sanitizing table)</option>
                  <option value="RESERVED">RESERVED (Reserved for booking)</option>
                  <option value="OUT_OF_SERVICE">OUT OF SERVICE (Maintenance)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTable(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FoodTableManagementPage;
