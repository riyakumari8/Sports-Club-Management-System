import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaEdit, FaBoxOpen, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import productApi from '../../api/productApi';
import cartApi from '../../api/cartApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await productApi.getProductById(id);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.availableStock <= 0) return;
    setAddingToCart(true);
    try {
      // Default member session ID: 1
      await cartApi.addItem(1, { productId: product.id, quantity });
      toast.success(`Added ${quantity} x ${product.name} to cart!`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Product Details..." />;
  if (!product) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop/products" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.availableStock <= 0;
  const savings = product.discountPercentage > 0 ? (product.basePrice - product.sellingPrice).toFixed(2) : 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="card" style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        {/* Left: Product Image */}
        <div>
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#f8fafc', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
            <img
              src={product.mainImageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              {product.imageUrls.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.categoryName || 'Equipment'}
            </span>
            <StatusBadge status={product.stockStatus || 'IN_STOCK'} />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            {product.name}
          </h1>

          {/* Pricing */}
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                ₹{Number(product.sellingPrice).toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                    ₹{Number(product.basePrice).toFixed(2)}
                  </span>
                  <span style={{ backgroundColor: '#fee2e2', color: 'var(--danger-color)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                    {product.discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'var(--success-color)', fontWeight: 500 }}>
                You save ₹{savings} with this promotional discount!
              </p>
            )}
          </div>

          {/* Stock Info */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isOutOfStock ? (
              <span style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <FaExclamationCircle /> Out of Stock - Currently Unavailable
              </span>
            ) : (
              <span style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <FaCheckCircle /> In Stock ({product.availableStock} units ready for immediate dispatch or pickup)
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Product Description
            </h4>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-primary)', margin: 0 }}>
              {product.description || 'No detailed description provided for this product.'}
            </p>
          </div>

          {/* Add to Cart Controls */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: '36px', height: '36px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                >
                  -
                </button>
                <span style={{ width: '44px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.availableStock, q + 1))}
                  style={{ width: '36px', height: '36px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <FaShoppingCart /> {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Admin Management Links */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
            <Link to={`/shop/products/edit/${product.id}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', textDecoration: 'none' }}>
              <FaEdit /> Edit Product
            </Link>
            <Link to={`/inventory/stock`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', textDecoration: 'none' }}>
              <FaBoxOpen /> View in Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
