import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, Tag, CheckCircle2 } from 'lucide-react';
import { getPublicShopPreview } from '../services/api';

export default function ShopPreview() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicShopPreview().then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL'
    ? products
    : products.filter(p => p.category === filter);

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>
            <ShoppingBag size={13} /> Pro Sports Shop Preview
          </span>
          <h1 className="title-serif" style={{ fontSize: '2.8rem', color: '#0f3e2e', marginBottom: 12 }}>
            Champions Gear & Accessories
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Browse top-tier tennis rackets, English willow cricket bats, tournament balls, and high-performance footwear available at the club counter and online pickup.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
          {['ALL', 'TENNIS', 'CRICKET', 'APPAREL', 'ACCESSORIES'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 9999, padding: '8px 20px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            Loading sports products...
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 240, position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge badge-primary" style={{ position: 'absolute', top: 12, left: 12 }}>
                    {p.badge}
                  </span>
                </div>

                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {p.category}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f3e2e', marginTop: 4, marginBottom: 8 }}>
                      {p.name}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16 }}>
                      {p.stock}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                    <div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f3e2e' }}>
                        ₹ {p.price.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                        Gold members save 20%
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Inquire at club pro shop counter for: ${p.name}`)}
                      className="btn btn-outline btn-sm"
                    >
                      Reserve in Shop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
