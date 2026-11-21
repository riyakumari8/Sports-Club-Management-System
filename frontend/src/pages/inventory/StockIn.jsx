import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPlusCircle, FaBoxes } from 'react-icons/fa';
import inventoryApi from '../../api/inventoryApi';
import productApi from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const StockIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedProductId = searchParams.get('productId');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productId: preselectedProductId || '',
    quantity: 10,
    reason: 'Regular Supplier Purchase',
    recordedBy: 'Admin Balaji',
  });

  const [selectedProductInfo, setSelectedProductInfo] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAllProducts();
      setProducts(res.data || []);

      if (preselectedProductId) {
        const found = res.data?.find((p) => String(p.id) === String(preselectedProductId));
        if (found) setSelectedProductInfo(found);
      } else if (res.data?.length > 0) {
        setFormData((prev) => ({ ...prev, productId: res.data[0].id }));
        setSelectedProductInfo(res.data[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    const pId = e.target.value;
    setFormData((prev) => ({ ...prev, productId: pId }));
    const found = products.find((p) => String(p.id) === String(pId));
    setSelectedProductInfo(found || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      await inventoryApi.addStock(formData.productId, {
        quantity: parseInt(formData.quantity, 10),
        reason: formData.reason,
        recordedBy: formData.recordedBy,
      });

      toast.success(`Successfully added ${formData.quantity} units to stock!`);
      navigate('/inventory/stock');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to record stock intake');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Form..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 8px 0' }}>
          Record Stock Intake (Stock In)
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Add inventory units from supplier purchases or new consignments. Stock increases immediately across online and POS channels.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Product Select */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Select Product *</label>
            <select
              value={formData.productId}
              onChange={handleProductChange}
              className="form-control"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current Stock: {p.availableStock})
                </option>
              ))}
            </select>
          </div>

          {/* Current Stock Preview Card */}
          {selectedProductInfo && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {selectedProductInfo.categoryName}
                </span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedProductInfo.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Stock Level</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                  {selectedProductInfo.availableStock} units
                </div>
              </div>
            </div>
          )}

          {/* Quantity to Add */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Quantity to Add *</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || '' })}
                className="form-control"
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Projected New Stock</label>
              <input
                type="text"
                readOnly
                value={
                  selectedProductInfo
                    ? `${(selectedProductInfo.availableStock || 0) + (parseInt(formData.quantity, 10) || 0)} units`
                    : '-'
                }
                className="form-control"
                style={{ backgroundColor: '#f1f5f9', fontWeight: 700, color: 'var(--success-color)' }}
              />
            </div>
          </div>

          {/* Reason / Reference */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Intake Reason / Invoice Reference *</label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g. Supplier PO #4401 - Head Sports Distributor"
              className="form-control"
              required
            />
          </div>

          {/* Recorded By */}
          <div style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Staff Name / Recorded By *</label>
            <input
              type="text"
              value={formData.recordedBy}
              onChange={(e) => setFormData({ ...formData, recordedBy: e.target.value })}
              className="form-control"
              required
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
            >
              <FaPlusCircle /> {submitting ? 'Recording...' : 'Record Stock In'}
            </button>
            <Link to="/inventory/stock" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockIn;
