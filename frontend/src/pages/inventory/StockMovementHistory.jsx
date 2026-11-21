import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaHistory, FaFilter, FaDownload } from 'react-icons/fa';
import inventoryApi from '../../api/inventoryApi';
import productApi from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const StockMovementHistory = () => {
  const [searchParams] = useSearchParams();
  const preselectedProductId = searchParams.get('productId');

  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(preselectedProductId || '');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedProduct]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [movRes, prodRes] = await Promise.all([
        selectedProduct
          ? inventoryApi.getProductMovements(selectedProduct)
          : inventoryApi.getAllMovements(),
        productApi.getAllProducts(),
      ]);

      setMovements(movRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovements = movements.filter((m) => {
    const matchesType = !selectedType || m.movementType === selectedType;
    return matchesType;
  });

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'STOCK_IN':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'STOCK_OUT':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'ADJUSTMENT':
        return { backgroundColor: '#e0e7ff', color: '#3730a3' };
      case 'RETURN':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#475569' };
    }
  };

  if (loading) return <LoadingSpinner message="Loading Movement Log..." />;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Stock Movement History & Audit</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Immutable ledger of every inventory change: supplier purchases, online checkouts, counter sales, adjustments, and returns.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        <div style={{ minWidth: '240px', flex: 1 }}>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="form-control"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: '200px' }}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-control"
          >
            <option value="">All Movement Types</option>
            <option value="STOCK_IN">STOCK_IN (Restock)</option>
            <option value="STOCK_OUT">STOCK_OUT (Order / POS)</option>
            <option value="ADJUSTMENT">ADJUSTMENT (Audit)</option>
            <option value="RETURN">RETURN (Customer Return)</option>
          </select>
        </div>

        {selectedProduct && (
          <button
            onClick={() => setSelectedProduct('')}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            Clear Product Filter
          </button>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Log ID</th>
                <th>Product</th>
                <th>Movement Type</th>
                <th>Qty</th>
                <th>Prev Stock</th>
                <th>New Stock</th>
                <th>Reason / Reference</th>
                <th>Recorded By</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                    No stock movements found matching filter.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => {
                  const badge = getBadgeStyle(m.movementType);
                  const isPositive = m.movementType === 'STOCK_IN' || m.movementType === 'RETURN';
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{m.id}</td>
                      <td style={{ fontWeight: 600 }}>{m.productName}</td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, ...badge }}>
                          {m.movementType}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: isPositive ? 'var(--success-color)' : 'var(--danger-color)' }}>
                        {isPositive ? `+${m.quantity}` : `-${m.quantity}`}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{m.previousStock}</td>
                      <td style={{ fontWeight: 700 }}>{m.updatedStock}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{m.reason || '-'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.recordedBy || 'System'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(m.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockMovementHistory;
