import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { FaShoppingCart } from 'react-icons/fa';

export const ProductCard = ({ product, onAddToCart, showAddToCart = true }) => {
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK' || (product.stockQuantity !== undefined && product.stockQuantity <= 0);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        margin: 0,
        padding: '16px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '180px',
          backgroundColor: '#f1f5f9',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80';
            }}
          />
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No Image</span>
        )}
      </div>

      {/* Category & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: '600', textTransform: 'uppercase' }}>
          {product.categoryName || 'Equipment'}
        </span>
        <StatusBadge status={product.stockStatus || 'IN_STOCK'} />
      </div>

      {/* Title */}
      <Link
        to={`/shop/products/${product.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h4
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '8px',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h4>
      </Link>

      {/* Description Snippet */}
      {product.description && (
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>
      )}

      {/* Pricing & Add to Cart */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
            ₹{Number(product.sellingPrice || product.originalPrice || 0).toFixed(2)}
          </span>
          {product.discountPercent > 0 && (
            <>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{Number(product.originalPrice).toFixed(2)}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>
                {product.discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {showAddToCart && (
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isOutOfStock}
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            <FaShoppingCart /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
