import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import productApi from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sku: '',
    description: '',
    basePrice: '',
    discountPercentage: 0,
    isActive: true,
  });

  const [imageUrls, setImageUrls] = useState(['']);
  const [availableStock, setAvailableStock] = useState(0);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getProductById(id),
        productApi.getAllCategories(),
      ]);

      const product = prodRes.data;
      setCategories(catRes.data?.length > 0 ? catRes.data : DEFAULT_CATEGORIES);
      setFormData({
        name: product.name || '',
        categoryId: product.categoryId || '',
        sku: product.sku || '',
        description: product.description || '',
        basePrice: product.basePrice || '',
        discountPercentage: product.discountPercentage || 0,
        isActive: product.isActive !== false,
      });

      setAvailableStock(product.availableStock || 0);

      if (product.imageUrls && product.imageUrls.length > 0) {
        setImageUrls(product.imageUrls);
      } else if (product.mainImageUrl) {
        setImageUrls([product.mainImageUrl]);
      } else {
        setImageUrls(['']);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load product for editing');
    } finally {
      setLoading(false);
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

    setSubmitting(true);
    try {
      const validImages = imageUrls.filter((url) => url.trim() !== '');
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        imageUrls: validImages.length > 0 ? validImages : [
          'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&q=80'
        ],
      };

      await productApi.updateProduct(id, payload);
      toast.success('Product updated successfully!');
      navigate(`/shop/products/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Product..." />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
              Edit Product #{id}
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Update catalogue details, promotional pricing, and images.
            </p>
          </div>
          <div style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontWeight: 600 }}>
            Current Stock: <span style={{ color: 'var(--primary-accent)' }}>{availableStock}</span> units
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
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
              <label className="form-label" style={{ fontWeight: 600 }}>SKU / Barcode</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Base Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

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
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>Product Images</label>
              <button
                type="button"
                onClick={addImageUrlField}
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FaPlus /> Add URL
              </button>
            </div>
            {imageUrls.map((url, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="url"
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

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active in Catalogue & E-Commerce Shop
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
            >
              <FaSave /> {submitting ? 'Saving...' : 'Update Product'}
            </button>
            <Link to={`/shop/products/${id}`} className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
