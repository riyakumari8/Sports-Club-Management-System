import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { sportsShopStaffService } from '../../services/sportsShopStaffService';
import {
  Boxes,
  PlusCircle,
  History,
  AlertTriangle,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Edit,
} from 'lucide-react';

export const SportsInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'movements'
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  // Stock Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    productId: '',
    movementType: 'RESTOCK',
    quantity: 10,
    reason: 'Regular inventory shipment',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsData, movsData] = await Promise.all([
        sportsShopStaffService.getProducts({ search: searchQuery || undefined }),
        sportsShopStaffService.getInventoryMovements(),
      ]);
      setProducts(Array.isArray(prodsData) ? prodsData : []);
      setMovements(Array.isArray(movsData) ? movsData : []);
    } catch (err) {
      console.error('Failed to load inventory data', err);
      setNotification({ type: 'error', message: err.message || 'Failed to fetch inventory' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustmentForm({
      productId: product ? product.id : (products[0]?.id || ''),
      movementType: 'RESTOCK',
      quantity: 10,
      reason: 'Regular inventory shipment',
    });
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const qtyChange = adjustmentForm.movementType === 'DAMAGED' || adjustmentForm.movementType === 'SHRINKAGE'
        ? -Math.abs(Number(adjustmentForm.quantity))
        : Math.abs(Number(adjustmentForm.quantity));

      await sportsShopStaffService.adjustStock({
        productId: adjustmentForm.productId,
        quantity: qtyChange,
        movementType: adjustmentForm.movementType,
        reason: adjustmentForm.reason,
      });

      setNotification({ type: 'success', message: 'Inventory stock level successfully updated!' });
      setAdjustModalOpen(false);
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Stock adjustment failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockCount = products.filter(p => p.stockQuantity <= p.reorderLevel).length;

  return (
    <DashboardLayout
      title="Sports Shop Inventory & Stock Control"
      subtitle="Track stock levels, record restocks, wastage and review real-time movement history"
    >
      {/* Notification banner */}
      {notification && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: notification.type === 'success' ? '#d1e7dd' : '#f8d7da',
          color: notification.type === 'success' ? '#0f5132' : '#842029',
          border: `1px solid ${notification.type === 'success' ? '#badbcc' : '#f5c2c7'}`,
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

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Total Products</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937' }}>{products.length}</h3>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Boxes size={22} />
            </div>
          </div>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Low Stock Alert</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: lowStockCount > 0 ? '#dc2626' : '#059669' }}>
                {lowStockCount}
              </h3>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: lowStockCount > 0 ? '#fee2e2' : '#d1fae5', color: lowStockCount > 0 ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Recorded Movements</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937' }}>{movements.length}</h3>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="cs-card">
        {/* Navigation Tabs and Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`btn btn-sm ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
            >
              <Boxes size={16} /> Product Inventory
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`btn btn-sm ${activeTab === 'movements' ? 'btn-primary' : 'btn-outline'}`}
            >
              <History size={16} /> Audit Movements Log
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {activeTab === 'inventory' && (
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Search SKU, name, brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ height: '36px', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  <Search size={14} />
                </button>
              </form>
            )}
            <button
              onClick={() => openAdjustModal(null)}
              className="btn btn-gold btn-sm"
            >
              <PlusCircle size={16} /> Adjust Stock / Restock
            </button>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading stock inventory..." />
        ) : activeTab === 'inventory' ? (
          /* Products Inventory Table */
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category / Brand</th>
                  <th>Selling Price</th>
                  <th>Stock Available</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isLow = p.stockQuantity <= p.reorderLevel;
                  const isOut = p.stockQuantity === 0;

                  return (
                    <tr key={p.id} style={{ background: isOut ? '#fef2f2' : isLow ? '#fffbeb' : 'transparent' }}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{p.sku}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.description ? p.description.slice(0, 50) + '...' : ''}</div>
                      </td>
                      <td>
                        <div>{p.category?.name || 'General'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{p.brand || '--'}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#1f2937' }}>₹{Number(p.sellingPrice).toLocaleString()}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            color: isOut ? '#dc2626' : isLow ? '#d97706' : '#059669',
                          }}>
                            {p.stockQuantity}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>units</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{p.reorderLevel} units</span>
                      </td>
                      <td>
                        {isOut ? (
                          <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                            OUT OF STOCK
                          </span>
                        ) : isLow ? (
                          <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                            LOW STOCK
                          </span>
                        ) : (
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                            IN STOCK
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => openAdjustModal(p)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <PlusCircle size={14} /> Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Movements History Table */
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Change</th>
                  <th>Stock Levels</th>
                  <th>Reason / Context</th>
                  <th>Handled By</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                    </td>
                    <td>
                      <strong>{m.product?.name || 'Unknown Product'}</strong>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#9ca3af' }}>
                        {m.product?.sku}
                      </div>
                    </td>
                    <td>
                      <Badge type={m.movementType}>{m.movementType}</Badge>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: m.quantity > 0 ? '#059669' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}>
                        {m.quantity > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {m.stockBefore} &rarr; <strong>{m.stockAfter}</strong>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                      {m.reason || '--'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {m.performedBy?.fullName || 'Staff Lead'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && (
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
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2937' }}>
                Inventory Stock Adjustment
              </h3>
              <button
                onClick={() => setAdjustModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit}>
              <div className="form-group">
                <label className="form-label">Select Product *</label>
                <select
                  value={adjustmentForm.productId}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, productId: e.target.value })}
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.name} (Current Stock: {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Movement Type *</label>
                <select
                  value={adjustmentForm.movementType}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, movementType: e.target.value })}
                  required
                >
                  <option value="RESTOCK">RESTOCK (Supplier Inward +)</option>
                  <option value="CORRECTION">CORRECTION (Stock count adjustment +/-)</option>
                  <option value="DAMAGED">DAMAGED (Damaged / defective item write-off -)</option>
                  <option value="SHRINKAGE">SHRINKAGE (Missing item write-off -)</option>
                  <option value="CUSTOMER_RETURN">CUSTOMER RETURN (Restocked item +)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity Adjustment *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustmentForm.quantity}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px', display: 'block' }}>
                  {['DAMAGED', 'SHRINKAGE'].includes(adjustmentForm.movementType)
                    ? 'This will automatically deduct units from current stock.'
                    : 'This will add units to current stock.'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Supplier Inward Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PO #8892 from Yonex Distributor"
                  value={adjustmentForm.reason}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Applying...' : 'Save Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SportsInventoryPage;
