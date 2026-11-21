import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import productApi from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '1',
    sku: '',
    description: '',
    basePrice: '',
    discountPercentage: 0,
    initialStock: 10,
    minStockThreshold: 5,
    isActive: true,
  });

  const [imageUrls, setImageUrls] = useState(['']);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await productApi.getAllCategories();
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
        setFormData((prev) => ({
          ...prev,
          categoryId: prev.categoryId || String(res.data[0].id),
        }));
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (err) {
      console.warn('Using default sports categories', err);
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrlField = (index) => {
    setImageUrls(imageUrls.filter((_, idx) => idx !== index));
  };

  const calculatedFinalPrice = () => {
    const base = parseFloat(formData.basePrice) || 0;
    const discount = parseFloat(formData.discountPercentage) || 0;
    return (base * (1 - discount / 100)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      toast.error('Valid base price is required');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    setSubmitting(true);
    try {
      const validImages = imageUrls.filter((url) => url.trim() !== '');
      const selectedCategoryObj = categories.find((c) => String(c.id) === String(formData.categoryId));

      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        categoryName: selectedCategoryObj?.name || 'Sports Equipment',
        basePrice: parseFloat(formData.basePrice),
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        initialStock: parseInt(formData.initialStock, 10) || 0,
        minStockThreshold: parseInt(formData.minStockThreshold, 10) || 5,
        imageUrls: validImages.length > 0 ? validImages : [
          'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&q=80'
        ],
      };

      await productApi.createProduct(payload);
      toast.success('Product created successfully with initial stock recorded!');
      navigate('/shop/products');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Form..." />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <FaArrowLeft /> Back to Catalogue
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 8px 0' }}>
          Add New Sports Product
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Configure product details, category, pricing, discounts, and initial inventory.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Product Name */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kids Skipping Rope - Blue"
                className="form-control"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SKU / Code */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>SKU / Barcode</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. ID 8538684"
                className="form-control"
              />
            </div>

            {/* Base Price */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Base Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="e.g. 150.00"
                className="form-control"
                required
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Discount (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Selling Price Preview */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Final Calculated Price (₹)</label>
              <input
                type="text"
                value={`₹ ${calculatedFinalPrice()}`}
                readOnly
                className="form-control"
                style={{ backgroundColor: '#f1f5f9', fontWeight: 700, color: 'var(--primary-accent)' }}
              />
            </div>

            {/* Initial Stock */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Initial Stock Quantity *</label>
              <input
                type="number"
                min="0"
                name="initialStock"
                value={formData.initialStock}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Low Stock Alert Threshold *</label>
              <input
                type="number"
                min="1"
                name="minStockThreshold"
                value={formData.minStockThreshold}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description, specifications, and club usage tips..."
              className="form-control"
            />
          </div>

          {/* Product Image URLs */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>Product Image URLs</label>
              <button
                type="button"
                onClick={addImageUrlField}
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FaPlus /> Add Another Image URL
              </button>
            </div>
            {imageUrls.map((url, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="url"
                  placeholder="https://example.com/sports-gear.jpg"
                  value={url}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  className="form-control"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrlField(idx)}
                    className="btn btn-danger"
                    style={{ padding: '8px 12px' }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active status */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Make this product immediately visible in catalogue and customer shop
            </label>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
            >
              <FaSave /> {submitting ? 'Saving...' : 'Save Product'}
            </button>
            <Link to="/shop/products" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
