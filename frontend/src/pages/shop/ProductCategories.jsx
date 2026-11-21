import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTags } from 'react-icons/fa';
import productApi from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { toast } from 'react-toastify';

const ProductCategories = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAllCategories();
      setCategories(res.data?.length > 0 ? res.data : DEFAULT_CATEGORIES);
    } catch (err) {
      console.error(err);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await productApi.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await productApi.createCategory(formData);
        toast.success('Category added successfully');
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await productApi.deleteCategory(deleteModal.categoryId);
      toast.success(`Category "${deleteModal.categoryName}" removed`);
      setCategories(categories.filter((c) => c.id !== deleteModal.categoryId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    } finally {
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Categories..." />;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Product Categories</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Organize products into logical sport equipment classifications.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '220px' }}>Category Name</th>
                <th>Description</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{c.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <FaTags style={{ color: 'var(--primary-color)' }} /> {c.name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.description || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, categoryId: c.id, categoryName: c.name })}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tennis Balls"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category scope and gear types..."
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteModal.categoryName}"? Existing products in this category may become uncategorized.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' })}
      />
    </div>
  );
};

export default ProductCategories;
