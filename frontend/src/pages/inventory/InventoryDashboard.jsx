import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxes, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaPlus, FaExchangeAlt, FaHistory } from 'react-icons/fa';
import inventoryApi from '../../api/inventoryApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const InventoryDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [inventoryList, setInventoryList] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      const [invRes, lowRes, outRes, movRes] = await Promise.all([
        inventoryApi.getAllInventory(),
        inventoryApi.getLowStockItems(),
        inventoryApi.getOutOfStockItems(),
        inventoryApi.getAllMovements(),
      ]);

      setInventoryList(invRes.data || []);
      setLowStock(lowRes.data || []);
      setOutOfStock(outRes.data || []);
      setRecentMovements((movRes.data || []).slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Inventory Status..." />;

  const inStockCount = inventoryList.filter((i) => i.status === 'IN_STOCK').length;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Inventory Overview</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Unified real-time stock levels across online orders and counter POS sales.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/inventory/stock-in" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FaPlus /> Stock In (Restock)
          </Link>
          <Link to="/inventory/adjust" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FaExchangeAlt /> Adjust Stock
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaBoxes />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Tracked SKUs</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{inventoryList.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--success-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#e8f5e9', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaCheckCircle />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Healthy Stock</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--success-color)' }}>{inStockCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--warning-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fffbeb', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaExclamationTriangle />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Low Stock Alerts</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--warning-color)' }}>{lowStock.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--danger-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fef2f2', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaTimesCircle />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Out of Stock</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--danger-color)' }}>{outOfStock.length}</div>
          </div>
        </div>
      </div>

      {/* Low stock alert banner if any */}
      {lowStock.length > 0 && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaExclamationTriangle style={{ color: 'var(--warning-color)', fontSize: '22px' }} />
            <div>
              <strong style={{ color: '#92400e' }}>{lowStock.length} products have fallen below their minimum stock threshold!</strong>
              <div style={{ fontSize: '0.85rem', color: '#b45309' }}>Review and record restocking purchases to avoid stock-outs.</div>
            </div>
          </div>
          <Link to="/inventory/low-stock" className="btn btn-warning" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
            View Low Stock Details &rarr;
          </Link>
        </div>
      )}

      {/* Grid: Current Stock Table + Recent Movement Audit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {/* Current Stock */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Current Stock Snapshot</h2>
            <Link to="/inventory/stock" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Full Stock &rarr;
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Min Limit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryList.slice(0, 6).map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.productName}</td>
                    <td style={{ fontWeight: 700, color: item.currentQuantity <= item.minStockThreshold ? 'var(--danger-color)' : 'inherit' }}>
                      {item.currentQuantity} units
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.minStockThreshold}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Movements */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Recent Stock Audit Log</h2>
            <Link to="/inventory/movements" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Full History &rarr;
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Updated</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentMovements.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.productName}</td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: m.movementType === 'STOCK_IN' ? '#dcfce7' : m.movementType === 'STOCK_OUT' ? '#fee2e2' : '#e0e7ff',
                          color: m.movementType === 'STOCK_IN' ? '#166534' : m.movementType === 'STOCK_OUT' ? '#991b1b' : '#3730a3',
                        }}>
                          {m.movementType}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {m.movementType === 'STOCK_IN' || m.movementType === 'RETURN' ? `+${m.quantity}` : `-${m.quantity}`}
                      </td>
                      <td style={{ fontWeight: 700 }}>{m.updatedStock}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
