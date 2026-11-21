import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTable, FaPlus, FaUsers, FaUtensils, FaReceipt } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: 4, location: 'Indoor' });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const res = await cafeApi.getAllTables();
      setTables(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cafe tables');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      await cafeApi.updateTableStatus(tableId, newStatus);
      toast.success(`Table status changed to ${newStatus}`);
      setTables(tables.map((t) => (t.id === tableId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update table status');
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTable.tableNumber) {
      toast.error('Table number is required');
      return;
    }

    try {
      await cafeApi.createTable({
        tableNumber: parseInt(newTable.tableNumber, 10),
        capacity: parseInt(newTable.capacity, 10),
        location: newTable.location,
        status: 'AVAILABLE',
      });
      toast.success('Table added successfully');
      setShowAddModal(false);
      setNewTable({ tableNumber: '', capacity: 4, location: 'Indoor' });
      loadTables();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create table');
    }
  };

  if (loading) return <LoadingSpinner message="Loading Table Grid..." />;

  const getStatusColor = (st) => {
    switch (st) {
      case 'AVAILABLE':
        return { bg: '#e8f5e9', border: '#bbf7d0', text: '#166534' };
      case 'OCCUPIED':
        return { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' };
      case 'RESERVED':
        return { bg: '#fffbeb', border: '#fde68a', text: '#92400e' };
      case 'CLEANING':
        return { bg: '#f1f5f9', border: '#cbd5e1', text: '#475569' };
      default:
        return { bg: '#f8fafc', border: '#e2e8f0', text: '#334155' };
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Restaurant & Bar Tables</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Live visual seating floor plan, occupancy monitoring, and quick status controls.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Add New Table
        </button>
      </div>

      {/* Seating Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {tables.map((table) => {
          const style = getStatusColor(table.status);
          return (
            <div
              key={table.id}
              className="card"
              style={{
                padding: '20px',
                border: `2px solid ${style.border}`,
                backgroundColor: style.bg,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Table {table.tableNumber}
                  </h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'white', color: style.text }}>
                    {table.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaUsers /> {table.capacity} Persons
                  </span>
                  <span>{table.location || 'Indoor Dining'}</span>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Update Seating Status:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
                  {['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(table.id, st)}
                      disabled={table.status === st}
                      className="btn"
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: table.status === st ? style.text : 'white',
                        color: table.status === st ? 'white' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <Link
                    to={`/cafe/orders/place?tableId=${table.id}&tableNumber=${table.tableNumber}`}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '6px', fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <FaUtensils size={11} /> Place Order
                  </Link>
                  <Link
                    to={`/cafe/tabs?tableId=${table.id}`}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FaReceipt size={11} /> Tab
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 16px 0' }}>Add Dining Table</h2>
            <form onSubmit={handleAddTable}>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Table Number *</label>
                <input
                  type="number"
                  min="1"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                  placeholder="e.g. 9"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Seating Capacity (Seats)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Location Section</label>
                <select
                  value={newTable.location}
                  onChange={(e) => setNewTable({ ...newTable, location: e.target.value })}
                  className="form-control"
                >
                  <option value="Indoor Dining">Indoor Dining</option>
                  <option value="Poolside Terrace">Poolside Terrace</option>
                  <option value="Sports Bar Lounge">Sports Bar Lounge</option>
                  <option value="Rooftop Deck">Rooftop Deck</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
