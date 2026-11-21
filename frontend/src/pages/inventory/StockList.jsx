import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaExchangeAlt, FaHistory, FaSearch, FaFilter } from 'react-icons/fa';
import inventoryApi from '../../api/inventoryApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const StockList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getAllInventory();
      setInventory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Loading Stock Levels..." />;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Stock Levels</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Live centralized inventory count shared between online shopping cart and POS counter checkout.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/inventory/stock-in" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <FaPlus /> Stock In
          </Link>
          <Link to="/inventory/adjust" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <FaExchangeAlt /> Adjust
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search stock by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: '180px' }}
        >
          <option value="">All Stock Statuses</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Current Stock</th>
                <th>Min Alert Threshold</th>
                <th>Status</th>
                <th>Last Restocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No stock records match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{item.productId}</td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.productName}</strong>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: item.currentQuantity <= item.minStockThreshold ? 'var(--danger-color)' : 'var(--primary-accent)',
                      }}>
                        {item.currentQuantity} units
                      </span>
                    </td>
                    <td>{item.minStockThreshold} units</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.lastRestockedAt ? new Date(item.lastRestockedAt).toLocaleDateString() : 'Initial'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to={`/inventory/stock-in?productId=${item.productId}`}
                          className="btn btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                          title="Restock this product"
                        >
                          <FaPlus /> Restock
                        </Link>
                        <Link
                          to={`/inventory/movements?productId=${item.productId}`}
                          className="btn btn-outline"
                          style={{ padding: '5px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                          title="View audit trail"
                        >
                          <FaHistory />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockList;
