import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaTh, FaList, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import productApi from '../../api/productApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { toast } from 'react-toastify';

const ProductCatalogue = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getAllProducts(),
        productApi.getAllCategories(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data?.length > 0 ? catRes.data : DEFAULT_CATEGORIES);
    } catch (err) {
      console.error(err);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productApi.deleteProduct(deleteModal.productId);
      toast.success(`Product "${deleteModal.productName}" deleted successfully`);
      setProducts(products.filter((p) => p.id !== deleteModal.productId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    } finally {
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    }
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || String(p.categoryId) === String(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'stock') return b.availableStock - a.availableStock;
      return a.name.localeCompare(b.name);
    });

  if (loading) return <LoadingSpinner message="Loading Product Catalogue..." />;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Sports Shop Catalogue</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <Link to="/shop/products/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <FaPlus /> Add New Product
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ maxWidth: '300px' }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
            style={{ maxWidth: '200px' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
            style={{ maxWidth: '180px' }}
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Highest Stock</option>
          </select>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('grid')}
            style={{ padding: '8px 12px' }}
            title="Grid View"
          >
            <FaTh />
          </button>
          <button
            className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('table')}
            style={{ padding: '8px 12px' }}
            title="Table View"
          >
            <FaList />
          </button>
        </div>
      </div>

      {/* Product Content: Grid or Table */}
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No products found</h3>
          <p>Try adjusting your search query or filter settings.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '22px' }}>
          {filteredProducts.map((p) => (
            <div key={p.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px', backgroundColor: '#f1f5f9' }}>
                <img
                  src={p.mainImageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400&q=80'}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {p.discountPercentage > 0 && (
                  <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'var(--danger-color)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {p.discountPercentage}% OFF
                  </span>
                )}
                <span style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <StatusBadge status={p.stockStatus || 'IN_STOCK'} />
                </span>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {p.categoryName || 'Equipment'}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', flex: 1 }}>
                  {p.description ? p.description.slice(0, 75) + '...' : 'Premium quality sports gear.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                    ₹{Number(p.sellingPrice).toFixed(2)}
                  </span>
                  {p.discountPercentage > 0 && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                      ₹{Number(p.basePrice).toFixed(2)}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: p.availableStock > 5 ? 'var(--text-secondary)' : 'var(--danger-color)', fontWeight: 500 }}>
                    Stock: {p.availableStock}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <Link to={`/shop/products/${p.id}`} className="btn btn-outline" style={{ flex: 1, padding: '6px', fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}>
                    <FaEye /> View
                  </Link>
                  <Link to={`/shop/products/edit/${p.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, productId: p.id, productName: p.name })}
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '20px' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Discount</th>
                  <th>Final Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.mainImageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=80&q=80'}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.categoryName}</td>
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
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/shop/products/${p.id}`} className="btn btn-outline" style={{ padding: '5px 8px', fontSize: '0.8rem', textDecoration: 'none' }}>
                          <FaEye />
                        </Link>
                        <Link to={`/shop/products/edit/${p.id}`} className="btn btn-secondary" style={{ padding: '5px 8px', fontSize: '0.8rem', textDecoration: 'none' }}>
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, productId: p.id, productName: p.name })}
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
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
        confirmText="Delete Product"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
      />
    </div>
  );
};

export default ProductCatalogue;
