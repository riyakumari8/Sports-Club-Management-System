import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { foodShopStaffService } from '../../services/foodShopStaffService';
import {
  Utensils,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Leaf,
} from 'lucide-react';

export const FoodMenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState(null);

  // Edit item modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    price: '',
    prepTimeMinutes: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await foodShopStaffService.getMenu({
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
      });
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load menu', err);
      setNotification({ type: 'error', message: err.message || 'Failed to fetch cafe menu' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory]);

  const handleToggleAvailability = async (item) => {
    try {
      const newStatus = !item.getIsAvailable && !item.isAvailable;
      const updated = await foodShopStaffService.toggleAvailability(item.id, !item.isAvailable);
      setMenuItems((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, isAvailable: updated.isAvailable } : m))
      );
      setNotification({
        type: 'success',
        message: `${item.name} is now marked as ${updated.isAvailable ? 'AVAILABLE' : '86ed / UNAVAILABLE'}!`,
      });
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Toggle failed' });
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditForm({
      price: item.price,
      prepTimeMinutes: item.prepTimeMinutes || 10,
      description: item.description || '',
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      const updated = await foodShopStaffService.updateMenuItem(editingItem.id, editForm);
      setMenuItems((prev) =>
        prev.map((m) => (m.id === editingItem.id ? { ...m, ...updated } : m))
      );
      setNotification({ type: 'success', message: `${editingItem.name} details successfully updated!` });
      setEditModalOpen(false);
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to update item' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Cafe Menu & Item Availability"
      subtitle="Instantly 86 unavailable dishes, adjust prices, and manage kitchen prep time targets"
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

      {/* Search and Category Filter */}
      <div className="cs-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); fetchMenu(); }} style={{ display: 'flex', gap: '0.5rem', minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search food, coffee, smoothie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">
              Search
            </button>
          </form>

          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Total Menu Items: <strong>{menuItems.length}</strong>
          </span>
        </div>
      </div>

      {/* Menu Catalog Table */}
      <div className="cs-card">
        {loading ? (
          <Loader message="Loading menu items..." />
        ) : menuItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
            <Utensils size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h4>No menu items found</h4>
          </div>
        ) : (
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Dish / Beverage</th>
                  <th>Category</th>
                  <th>Dietary</th>
                  <th>Price</th>
                  <th>Prep Time</th>
                  <th>Availability (Live)</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => {
                  const isAvailable = item.isAvailable !== false;
                  return (
                    <tr key={item.id} style={{ opacity: isAvailable ? 1 : 0.6, background: isAvailable ? 'transparent' : '#f9fafb' }}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#1f2937' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: '300px' }}>
                          {item.description || '--'}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{item.category?.name || 'Cafe Special'}</span>
                      </td>
                      <td>
                        {item.isVegetarian ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.75rem', fontWeight: 700, background: '#d1fae5', padding: '2px 8px', borderRadius: '12px' }}>
                            <Leaf size={12} /> Veg
                          </span>
                        ) : (
                          <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, background: '#fee2e2', padding: '2px 8px', borderRadius: '12px' }}>
                            Non-Veg
                          </span>
                        )}
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.95rem', color: '#0F5132' }}>₹{Number(item.price).toLocaleString()}</strong>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#6b7280' }}>
                          <Clock size={14} /> {item.prepTimeMinutes || 10} min
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isAvailable ? '#d1fae5' : '#fee2e2',
                            color: isAvailable ? '#065f46' : '#991b1b',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {isAvailable ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          {isAvailable ? 'IN STOCK' : 'UNAVAILABLE (86)'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Menu Item Modal */}
      {editModalOpen && editingItem && (
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
            maxWidth: '480px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2937' }}>
                Edit {editingItem.name}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Selling Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Average Kitchen Prep Time (Minutes) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editForm.prepTimeMinutes}
                  onChange={(e) => setEditForm({ ...editForm, prepTimeMinutes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Ingredients *</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FoodMenuManagementPage;
