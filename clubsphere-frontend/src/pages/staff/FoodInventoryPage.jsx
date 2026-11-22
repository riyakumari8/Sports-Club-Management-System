import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { foodShopStaffService } from '../../services/foodShopStaffService';
import {
  Package,
  PlusCircle,
  History,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CookingPot,
} from 'lucide-react';

export const FoodInventoryPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'movements'
  const [notification, setNotification] = useState(null);

  // Adjust modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    ingredientId: '',
    movementType: 'RESTOCK',
    quantity: 5,
    reason: 'Daily kitchen restock from local vendor',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await foodShopStaffService.getInventory();
      setIngredients(Array.isArray(data?.ingredients) ? data.ingredients : []);
      setMovements(Array.isArray(data?.movements) ? data.movements : []);
    } catch (err) {
      console.error('Failed to load kitchen inventory', err);
      setNotification({ type: 'error', message: err.message || 'Failed to fetch inventory' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdjustModal = (item) => {
    setSelectedIngredient(item);
    setAdjustmentForm({
      ingredientId: item ? item.id : (ingredients[0]?.id || ''),
      movementType: 'RESTOCK',
      quantity: 5,
      reason: 'Daily kitchen restock from local vendor',
    });
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isDeduction = ['USAGE', 'WASTAGE', 'EXPIRED'].includes(adjustmentForm.movementType);
      const qtyChange = isDeduction
        ? -Math.abs(Number(adjustmentForm.quantity))
        : Math.abs(Number(adjustmentForm.quantity));

      await foodShopStaffService.adjustIngredientStock({
        ingredientId: adjustmentForm.ingredientId,
        quantity: qtyChange,
        movementType: adjustmentForm.movementType,
        reason: adjustmentForm.reason,
      });

      setNotification({ type: 'success', message: 'Kitchen ingredient stock level successfully updated!' });
      setAdjustModalOpen(false);
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Stock adjustment failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockCount = ingredients.filter((i) => Number(i.currentStock) <= Number(i.minStockThreshold)).length;

  return (
    <DashboardLayout
      title="Cafe Kitchen Inventory & Raw Ingredients"
      subtitle="Track kitchen pantry levels, record restocks, log prep wastage, and inspect movements"
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

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Pantry Ingredients</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937' }}>{ingredients.length}</h3>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CookingPot size={22} />
            </div>
          </div>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Below Min Threshold</span>
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
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Recent Logs</span>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`btn btn-sm ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
            >
              <CookingPot size={16} /> Ingredients Inventory
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`btn btn-sm ${activeTab === 'movements' ? 'btn-primary' : 'btn-outline'}`}
            >
              <History size={16} /> Wastage & Restock Log
            </button>
          </div>

          <button
            onClick={() => openAdjustModal(null)}
            className="btn btn-gold btn-sm"
          >
            <PlusCircle size={16} /> Record Kitchen Restock / Wastage
          </button>
        </div>

        {loading ? (
          <Loader message="Loading kitchen pantry..." />
        ) : activeTab === 'inventory' ? (
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Ingredient Name</th>
                  <th>Current Stock</th>
                  <th>Unit</th>
                  <th>Min Required Threshold</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item) => {
                  const isLow = Number(item.currentStock) <= Number(item.minStockThreshold);
                  return (
                    <tr key={item.id} style={{ background: isLow ? '#fffbeb' : 'transparent' }}>
                      <td>
                        <strong style={{ color: '#1f2937' }}>{item.name}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isLow ? '#dc2626' : '#059669' }}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.unit}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.minStockThreshold} {item.unit}</span>
                      </td>
                      <td>
                        {isLow ? (
                          <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                            REORDER REQUIRED
                          </span>
                        ) : (
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                            SUFFICIENT
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => openAdjustModal(item)}
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
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Ingredient</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Stock Change</th>
                  <th>Context / Reason</th>
                  <th>Staff Member</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                    </td>
                    <td>
                      <strong>{m.ingredient?.name || 'Unknown'}</strong>
                    </td>
                    <td>
                      <Badge type={m.movementType}>{m.movementType}</Badge>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: Number(m.quantity) > 0 ? '#059669' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}>
                        {Number(m.quantity) > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Number(m.quantity) > 0 ? `+${m.quantity}` : m.quantity} {m.ingredient?.unit || ''}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {m.stockBefore} &rarr; <strong>{m.stockAfter}</strong>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                      {m.reason || '--'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {m.performedBy?.fullName || 'Cafe Chef'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Modal */}
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
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2937' }}>
                Ingredient Stock Adjustment
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
                <label className="form-label">Ingredient *</label>
                <select
                  value={adjustmentForm.ingredientId}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, ingredientId: e.target.value })}
                  required
                >
                  {ingredients.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} (Current: {i.currentStock} {i.unit})
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
                  <option value="RESTOCK">RESTOCK (Vendor delivery +)</option>
                  <option value="USAGE">USAGE (Batch kitchen prep consumption -)</option>
                  <option value="WASTAGE">WASTAGE (Kitchen spill / trim waste -)</option>
                  <option value="EXPIRED">EXPIRED (Expired ingredient write-off -)</option>
                  <option value="CORRECTION">CORRECTION (Physical stock count audit +/-)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  required
                  value={adjustmentForm.quantity}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Vendor Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Received weekly dairy shipment from vendor"
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
                  {submitting ? 'Applying...' : 'Save Stock Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FoodInventoryPage;
