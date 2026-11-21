import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null, itemName: '' });

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    discount: 0,
    imageUrl: '',
    isAvailable: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemRes, catRes] = await Promise.all([
        cafeApi.getAllMenuItems(),
        cafeApi.getAllMenuCategories(),
      ]);
      setMenuItems(itemRes.data || []);
      setCategories(catRes.data || []);
      if (catRes.data?.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      price: '',
      discount: 0,
      imageUrl: '',
      isAvailable: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId || categories[0]?.id || '',
      description: item.description || '',
      price: item.price,
      discount: item.discount || 0,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable !== false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      toast.error('Name and price are required');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
      };

      if (editingItem) {
        await cafeApi.updateMenuItem(editingItem.id, payload);
        toast.success('Menu item updated');
      } else {
        await cafeApi.createMenuItem(payload);
        toast.success('Menu item added');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await cafeApi.toggleAvailability(item.id, !item.isAvailable);
      toast.info(`Updated availability for "${item.name}"`);
      setMenuItems(menuItems.map((m) => (m.id === item.id ? { ...m, isAvailable: !m.isAvailable } : m)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle availability');
    }
  };

  const handleDelete = async () => {
    try {
      await cafeApi.deleteMenuItem(deleteModal.itemId);
      toast.success(`Removed "${deleteModal.itemName}"`);
      setMenuItems(menuItems.filter((m) => m.id !== deleteModal.itemId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete menu item');
    } finally {
      setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Menu..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Menu Item Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Add, update pricing, upload food images, and toggle daily kitchen availability.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Add Menu Item
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80'}
                        alt={item.name}
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {item.description ? item.description.slice(0, 45) + '...' : '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.categoryName}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                    ₹{Number(item.price).toFixed(2)}
                  </td>
                  <td>{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                  <td>
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: item.isAvailable ? 'var(--success-color)' : 'var(--danger-color)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      {item.isAvailable ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                      {item.isAvailable ? 'In Kitchen' : 'Sold Out'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 8px', fontSize: '0.8rem' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, itemId: item.id, itemName: item.name })}
                        className="btn btn-danger"
                        style={{ padding: '5px 8px', fontSize: '0.8rem' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Dish Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Avocado Toast & Poached Egg"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="form-control"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="250.00"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, dietary notes..."
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Food Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                  Mark Available in Kitchen
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Menu Item"
        message={`Are you sure you want to remove "${deleteModal.itemName}" from the cafe menu?`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, itemId: null, itemName: '' })}
      />
    </div>
  );
};

export default MenuManagement;
