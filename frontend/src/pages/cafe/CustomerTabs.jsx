import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaReceipt, FaPlus, FaCheckCircle, FaDoorOpen } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';

const CustomerTabs = () => {
  const [searchParams] = useSearchParams();
  const filterTableId = searchParams.get('tableId');

  const [tabs, setTabs] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [newTab, setNewTab] = useState({ tableId: filterTableId || '', customerName: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tabRes, tableRes] = await Promise.all([
        cafeApi.getAllTabs(),
        cafeApi.getAllTables(),
      ]);
      setTabs(tabRes.data || []);
      setTables(tableRes.data || []);
      if (!newTab.tableId && tableRes.data?.length > 0) {
        setNewTab((prev) => ({ ...prev, tableId: tableRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load customer tabs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTab = async (e) => {
    e.preventDefault();
    if (!newTab.customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    try {
      await cafeApi.openTab({
        tableId: newTab.tableId,
        customerName: newTab.customerName,
      });
      toast.success('Customer tab opened successfully!');
      setShowOpenModal(false);
      setNewTab({ tableId: tables[0]?.id || '', customerName: '' });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to open tab');
    }
  };

  const handleCloseTab = async (tabId) => {
    try {
      await cafeApi.closeTab(tabId, { paymentMethod: 'UPI' });
      toast.success('Tab settled and closed successfully!');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to close tab');
    }
  };

  if (loading) return <LoadingSpinner message="Loading Customer Tabs..." />;

  const filteredTabs = filterTableId
    ? tabs.filter((t) => String(t.tableId) === String(filterTableId))
    : tabs;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaReceipt style={{ color: 'var(--primary-color)' }} /> Customer & Member Tabs
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Keep open running tabs for members dining or enjoying refreshments across multiple orders.
          </p>
        </div>
        <button
          onClick={() => setShowOpenModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Open New Tab
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Tab ID</th>
                <th>Table #</th>
                <th>Member / Guest</th>
                <th>Current Balance</th>
                <th>Status</th>
                <th>Opened Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTabs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                    No customer tabs found.
                  </td>
                </tr>
              ) : (
                filteredTabs.map((tab) => (
                  <tr key={tab.id}>
                    <td style={{ fontWeight: 700 }}>#{tab.id}</td>
                    <td style={{ fontWeight: 600 }}>Table {tab.tableNumber}</td>
                    <td>{tab.customerName}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary-accent)', fontSize: '1.05rem' }}>
                      ₹{Number(tab.totalAmount || 0).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={tab.status || (tab.isClosed ? 'CLOSED' : 'OPEN')} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(tab.createdAt).toLocaleTimeString()}
                    </td>
                    <td>
                      {tab.status !== 'CLOSED' && !tab.isClosed ? (
                        <button
                          onClick={() => handleCloseTab(tab.id)}
                          className="btn btn-primary"
                          style={{ padding: '5px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <FaCheckCircle /> Settle & Close
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open Tab Modal */}
      {showOpenModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 16px 0' }}>Open Customer Tab</h2>
            <form onSubmit={handleOpenTab}>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Dining Table *</label>
                <select
                  value={newTab.tableId}
                  onChange={(e) => setNewTab({ ...newTab, tableId: e.target.value })}
                  className="form-control"
                  required
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Table {t.tableNumber} ({t.capacity} seats - {t.status})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Member / Guest Name *</label>
                <input
                  type="text"
                  value={newTab.customerName}
                  onChange={(e) => setNewTab({ ...newTab, customerName: e.target.value })}
                  placeholder="e.g. Vikram Malhotra (Member #304)"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowOpenModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Open Tab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTabs;
