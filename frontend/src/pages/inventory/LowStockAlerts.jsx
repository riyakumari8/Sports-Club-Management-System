import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaPlusCircle, FaBell, FaBoxes } from 'react-icons/fa';
import inventoryApi from '../../api/inventoryApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const LowStockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getLowStockItems();
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Checking Low Stock Alerts..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning-color)' }}>
          <FaExclamationTriangle /> Low Stock Alerts
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Products that have reached or fallen below safety stock thresholds. Restock immediately to avoid order cancellations.
        </p>
      </div>

      {/* Integration Note with Anish's Module */}
      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FaBell style={{ color: 'var(--primary-color)', fontSize: '20px' }} />
        <div style={{ fontSize: '0.9rem', color: '#166534' }}>
          <strong>Notification Module Integration:</strong> Whenever a product hits its minimum threshold, an automated notification event is dispatched to Anish's system for administrative alerting.
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e8f5e9', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '28px' }}>
            <FaBoxes />
          </div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>All Stock Levels Healthy!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            No products are currently below their minimum safety thresholds.
          </p>
          <Link to="/inventory/stock" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            View Full Inventory
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: '24px' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Safety Threshold</th>
                  <th>Deficit</th>
                  <th>Severity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((item) => {
                  const isZero = item.currentQuantity === 0;
                  const deficit = item.minStockThreshold - item.currentQuantity;
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong style={{ fontSize: '1rem' }}>{item.productName}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID #{item.productId}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: isZero ? 'var(--danger-color)' : 'var(--warning-color)' }}>
                          {item.currentQuantity} units
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.minStockThreshold} units</td>
                      <td style={{ fontWeight: 600, color: 'var(--danger-color)' }}>
                        {deficit > 0 ? `-${deficit} units` : 'At Limit'}
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: isZero ? '#fee2e2' : '#fef3c7',
                          color: isZero ? '#991b1b' : '#92400e',
                        }}>
                          {isZero ? 'CRITICAL: OUT OF STOCK' : 'LOW STOCK WARNING'}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/inventory/stock-in?productId=${item.productId}`}
                          className="btn btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.82rem', textDecoration: 'none' }}
                        >
                          <FaPlusCircle /> Restock Now
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
