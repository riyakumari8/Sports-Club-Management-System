import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaBoxes, FaExclamationTriangle, FaPlusCircle, FaList, FaTags } from 'react-icons/fa';
import productApi from '../../api/productApi';
import inventoryApi from '../../api/inventoryApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const ShopDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, lowRes, outRes] = await Promise.all([
        productApi.getAllProducts(),
        productApi.getAllCategories(),
        inventoryApi.getLowStockItems(),
        inventoryApi.getOutOfStockItems(),
      ]);

      const products = prodRes.data || [];
      const cats = catRes.data || [];
      const low = lowRes.data || [];
      const out = outRes.data || [];

      setStats({
        totalProducts: products.length,
        categoriesCount: cats.length,
        lowStockCount: low.length,
        outOfStockCount: out.length,
      });

      setRecentProducts(products.slice(0, 6));
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load shop dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Sports Shop Overview..." />;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Sports Shop Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            Catalogue, pricing, stock levels, and promotional discounts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/shop/products/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FaPlusCircle /> Add New Product
          </Link>
          <Link to="/shop/categories" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FaTags /> Manage Categories
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaShoppingBag />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Products</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.totalProducts}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--primary-accent)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#e8f5e9', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaTags />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Categories</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.categoriesCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--warning-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fffbeb', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaExclamationTriangle />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Low Stock Items</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--warning-color)' }}>{stats.lowStockCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--danger-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fef2f2', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaBoxes />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Out of Stock</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--danger-color)' }}>{stats.outOfStockCount}</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Categories Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
          {categories.map((cat) => (
            <div key={cat.id} className="card" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {cat.description || 'Active catalog category'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Recent Catalogue Items
          </h2>
          <Link to="/shop/products" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
            View Full Catalogue &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Discount</th>
                <th>Selling Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No products added yet.
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.mainImageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=100&q=80'}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.categoryName || 'Unassigned'}</td>
                    <td>₹{Number(p.basePrice).toFixed(2)}</td>
                    <td>{p.discountPercentage > 0 ? `${p.discountPercentage}%` : '-'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                      ₹{Number(p.sellingPrice).toFixed(2)}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: p.availableStock > 5 ? 'inherit' : 'var(--danger-color)' }}>
                        {p.availableStock}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={p.stockStatus || 'IN_STOCK'} />
                    </td>
                    <td>
                      <Link to={`/shop/products/edit/${p.id}`} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', textDecoration: 'none' }}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
