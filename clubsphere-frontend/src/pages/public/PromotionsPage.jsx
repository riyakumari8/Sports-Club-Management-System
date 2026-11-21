import React, { useState, useEffect } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { discoveryService } from '../../services/discoveryService';
import { Copy, Check, Flame, Tag, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    discoveryService.getPromotions(selectedCategory === 'ALL' ? null : selectedCategory)
      .then((data) => {
        setPromotions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // Fallback default sample promotions
        setPromotions([
          { id: 1, promoCode: 'WELCOME50', title: 'New Member 50% Off', description: 'Get 50% discount on first month gym & court access.', discountPercentage: 50, bannerTag: 'STUDENT SPECIAL', category: 'MEMBERSHIP', validUntil: '2026-12-31' },
          { id: 2, promoCode: 'SUMMERSPORTS', title: 'Summer Season Pass', description: 'Flat 20% off on all annual membership tiers.', discountPercentage: 20, bannerTag: 'LIMITED TIME', category: 'MEMBERSHIP', validUntil: '2026-06-30' },
          { id: 3, promoCode: 'COURT10', title: 'Weekday Off-Peak 10% Off', description: 'Special pricing on morning court reservations (6 AM - 10 AM).', discountPercentage: 10, bannerTag: 'HOURLY PASS', category: 'COURT_BOOKING', validUntil: '2026-08-31' },
          { id: 4, promoCode: 'YONEX20', title: 'Yonex Racket Bonanza', description: '20% discount on all Yonex Astrox & Nanoflare rackets at Pro Shop.', discountPercentage: 20, bannerTag: 'PRO SHOP', category: 'SHOP', validUntil: '2026-05-31' },
          { id: 5, promoCode: 'SHAKE15', title: 'Post-Workout Fuel 15% Off', description: '15% discount on all whey protein smoothies and energy shakes.', discountPercentage: 15, bannerTag: 'CAFE SPECIAL', category: 'CAFE', validUntil: '2026-09-30' },
          { id: 6, promoCode: 'FRIDAYFUN', title: 'Friday Social Mix-In Perk', description: 'Free recovery sports drink when you RSVP for Friday Social Play.', discountPercentage: 100, bannerTag: 'SOCIAL PLAY', category: 'COURT_BOOKING', validUntil: '2026-12-31' },
        ]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const categories = [
    { key: 'ALL', label: 'All Offers' },
    { key: 'MEMBERSHIP', label: 'Memberships' },
    { key: 'COURT_BOOKING', label: 'Courts' },
    { key: 'SHOP', label: 'Pro Shop' },
    { key: 'CAFE', label: 'Sports Cafe' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#1f2937' }}>
      <PublicNavbar />

      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #072a18 0%, #0F5132 100%)',
        color: '#ffffff',
        padding: '4.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            STUDENT OFFERS & VOUCHERS
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0.5rem 0 1rem' }}>
            Exclusive Promotions & Savings
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: 1.6 }}>
            Apply promotional coupon codes during court checkouts, membership renewals, and Pro Shop orders.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section style={{ padding: '2rem 1.5rem 1rem', backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                backgroundColor: selectedCategory === cat.key ? '#0F5132' : '#ffffff',
                color: selectedCategory === cat.key ? '#ffffff' : '#374151',
                border: selectedCategory === cat.key ? '1px solid #0F5132' : '1px solid #d1d5db',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Promotions Cards Grid */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#f8faf9', flexGrow: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              Fetching latest promotional offers...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}>
                    {promo.bannerTag || 'SPECIAL'}
                  </div>

                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F5132', marginBottom: '0.25rem' }}>
                      {promo.discountPercentage}% OFF
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                      {promo.title}
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {promo.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
                      <Calendar size={14} color="#0F5132" />
                      <span>Valid through: <strong>{promo.validUntil || '2026-12-31'}</strong></span>
                    </div>

                    <div style={{
                      backgroundColor: '#f9fafb',
                      border: '1px dashed #d1d5db',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          PROMO CODE
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F5132', letterSpacing: '0.05em' }}>
                          {promo.promoCode}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(promo.promoCode)}
                        style={{
                          backgroundColor: copiedCode === promo.promoCode ? '#0F5132' : '#ffffff',
                          color: copiedCode === promo.promoCode ? '#ffffff' : '#374151',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '0.45rem 0.95rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {copiedCode === promo.promoCode ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedCode === promo.promoCode ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
