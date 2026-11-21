import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';
import inventoryApi from '../../api/inventoryApi';
import productApi from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const StockAdjustment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedProductId = searchParams.get('productId');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productId: preselectedProductId || '',
    newQuantity: '',
    reason: 'Monthly physical stock audit discrepancy',
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
        if (found) {
          setSelectedProductInfo(found);
          setFormData((prev) => ({ ...prev, newQuantity: found.availableStock }));
        }
      } else if (res.data?.length > 0) {
        const first = res.data[0];
        setFormData((prev) => ({ ...prev, productId: first.id, newQuantity: first.availableStock }));
        setSelectedProductInfo(first);
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
    const found = products.find((p) => String(p.id) === String(pId));
    setFormData((prev) => ({
      ...prev,
      productId: pId,
      newQuantity: found ? found.availableStock : '',
    }));
    setSelectedProductInfo(found || null);
  };

  const calculateDifference = () => {
    if (!selectedProductInfo || formData.newQuantity === '') return 0;
    const current = selectedProductInfo.availableStock || 0;
    const next = parseInt(formData.newQuantity, 10) || 0;
    return next - current;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }
    if (formData.newQuantity === '' || parseInt(formData.newQuantity, 10) < 0) {
      toast.error('New physical count cannot be negative');
      return;
    }

    setSubmitting(true);
    try {
      await inventoryApi.adjustStock(formData.productId, {
        newQuantity: parseInt(formData.newQuantity, 10),
        reason: formData.reason,
        recordedBy: formData.recordedBy,
      });

      toast.success('Stock level adjusted and audit log entry created!');
      navigate('/inventory/stock');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Form..." />;

  const diff = calculateDifference();

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
          Stock Count Adjustment
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Reconcile system records with physical shelf counts. Use for damaged stock write-offs, audit corrections, or samples.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Product Select */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Product *</label>
            <select
              value={formData.productId}
              onChange={handleProductChange}
              className="form-control"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.availableStock} units)
                </option>
              ))}
            </select>
          </div>

          {/* Current vs New Count */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>System Count</label>
              <input
                type="text"
                readOnly
                value={selectedProductInfo ? `${selectedProductInfo.availableStock} units` : '-'}
                className="form-control"
                style={{ backgroundColor: '#f1f5f9', fontWeight: 600 }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Actual Count *</label>
              <input
                type="number"
                min="0"
                value={formData.newQuantity}
                onChange={(e) => setFormData({ ...formData, newQuantity: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Adjustment Delta</label>
              <input
                type="text"
                readOnly
                value={diff > 0 ? `+${diff} units` : `${diff} units`}
                className="form-control"
                style={{
                  backgroundColor: '#f1f5f9',
                  fontWeight: 700,
                  color: diff > 0 ? 'var(--success-color)' : diff < 0 ? 'var(--danger-color)' : 'var(--text-secondary)',
                }}
              />
            </div>
          </div>

          {/* Reason */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Reason for Adjustment *</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="form-control"
              style={{ marginBottom: '8px' }}
            >
              <option value="Monthly physical stock audit discrepancy">Physical Stock Audit Discrepancy</option>
              <option value="Damaged goods written off">Damaged Goods Written Off</option>
              <option value="Product return inspection restock">Return Inspection Restock</option>
              <option value="Club coach demo sample provided">Club Demo Sample Provided</option>
              <option value="Supplier invoice recount correction">Supplier Invoice Recount Correction</option>
            </select>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Or write custom reason..."
              className="form-control"
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
              <FaExchangeAlt /> {submitting ? 'Applying...' : 'Apply Stock Adjustment'}
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

export default StockAdjustment;
