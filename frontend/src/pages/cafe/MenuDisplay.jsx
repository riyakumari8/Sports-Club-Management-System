import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const MenuDisplay = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const [itemRes, catRes] = await Promise.all([
        cafeApi.getAllMenuItems(),
        cafeApi.getAllMenuCategories(),
      ]);
      setMenuItems(itemRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !selectedCategory || String(item.categoryId) === String(selectedCategory);
    return matchesSearch && matchesCat;
  });

  if (loading) return <LoadingSpinner message="Opening Cafe & Bar Menu..." />;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Club Cafe & Bar Menu</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Fresh snacks, healthy shakes, meals, and beverages prepared daily for club members and players.
          </p>
        </div>
        <Link to="/cafe/orders/place" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <FaPlus /> Place Cafe Order
        </Link>
      </div>

      {/* Filter and Category Pills */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <input
            type="text"
            placeholder="Search food or beverage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ maxWidth: '360px' }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('')}
            className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            All Items
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`btn ${String(selectedCategory) === String(c.id) ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filteredItems.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '170px', position: 'relative', backgroundColor: '#f1f5f9' }}>
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {!item.isAvailable && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                  CURRENTLY UNAVAILABLE
                </div>
              )}
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                  {item.name}
                </h3>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                  ₹{Number(item.price).toFixed(2)}
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 14px 0', flex: 1 }}>
                {item.description || 'Nutritious & delicious sports club cafe selection.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: item.isAvailable ? 'var(--success-color)' : 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  {item.isAvailable ? <FaCheck size={11} /> : <FaTimes size={11} />} {item.isAvailable ? 'Available' : 'Sold Out'}
                </span>

                <Link
                  to={`/cafe/orders/place?itemId=${item.id}`}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                >
                  Order This
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuDisplay;
