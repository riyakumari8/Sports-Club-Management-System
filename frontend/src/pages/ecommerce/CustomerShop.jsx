import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaTag, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import productApi from '../../api/productApi';
import cartApi from '../../api/cartApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';

const CustomerShop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Default member session ID = 1
  const memberId = 1;

  useEffect(() => {
    loadStore();
    loadCartCount();
  }, []);

  const loadStore = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getAllProducts(),
        productApi.getAllCategories(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load store products');
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const res = await cartApi.getCart(memberId);
      const items = res.data?.items || [];
      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    } catch (err) {
      // Cart might be empty
    }
  };

  const handleAddToCart = async (product) => {
    if (product.availableStock <= 0) return;
    try {
      await cartApi.addItem(memberId, { productId: product.id, quantity: 1 });
      toast.success(`Added 1 x ${product.name} to cart!`);
      loadCartCount();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Could not add to cart');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !selectedCategory || String(p.categoryId) === String(selectedCategory);
    return matchesSearch && matchesCat && p.isActive !== false;
  });

  if (loading) return <LoadingSpinner message="Opening ClubSphere Sports Store..." />;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        color: 'white',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            ClubSphere Official Pro Shop
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '12px 0 8px 0', letterSpacing: '-0.5px' }}>
            High-Performance Sports Gear
          </h1>
          <p style={{ margin: 0, opacity: 0.9, maxWidth: '600px', fontSize: '1rem' }}>
            Equip yourself with tournament-grade rackets, balls, footwear, and accessories. Exclusive club member discounts applied automatically.
          </p>
        </div>

        <Link
          to="/customer/cart"
          className="btn"
          style={{
            backgroundColor: 'white',
            color: 'var(--primary-color)',
            fontWeight: 700,
            padding: '12px 24px',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <FaShoppingCart /> View Cart ({cartCount})
        </Link>
      </div>

      {/* Filter and Search controls */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search sports gear..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ minWidth: '200px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
          >
            <option value="">All Gear Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {filteredProducts.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <h3>No products found</h3>
            <p>Try searching with another keyword or resetting the category filter.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isOutOfStock = p.availableStock <= 0;
            return (
              <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '200px', backgroundColor: '#f8fafc' }}>
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
                  {isOutOfStock && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--danger-color)', fontSize: '1rem' }}>
                      OUT OF STOCK
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {p.categoryName || 'Equipment'}
                  </span>
                  <Link to={`/shop/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                      {p.name}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: 'auto 0 14px 0' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                      ₹{Number(p.sellingPrice).toFixed(2)}
                    </span>
                    {p.discountPercentage > 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                        ₹{Number(p.basePrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to={`/shop/products/${p.id}`}
                      className="btn btn-outline"
                      style={{ padding: '8px 12px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(p)}
                      disabled={isOutOfStock}
                      className="btn btn-primary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 12px' }}
                    >
                      <FaShoppingCart /> {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerShop;
