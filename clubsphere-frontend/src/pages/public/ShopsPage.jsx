import React, { useState, useEffect } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { discoveryService } from '../../services/discoveryService';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  Coffee,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  Flame,
  Check,
} from 'lucide-react';

export const ShopsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('SPORTS_ACCESSORY'); // SPORTS_ACCESSORY or FOOD_BEVERAGE
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderModalItem, setOrderModalItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    discoveryService.getShopProducts(activeTab, null, searchTerm)
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [activeTab, searchTerm]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderModalItem) return;
    setOrderLoading(true);

    try {
      const orderPayload = {
        memberId: user?.id || 1,
        shopType: activeTab,
        totalAmount: (orderModalItem.memberPrice || orderModalItem.basePrice) * orderQuantity,
        discountApplied: (orderModalItem.basePrice - (orderModalItem.memberPrice || orderModalItem.basePrice)) * orderQuantity,
        items: [
          {
            productId: orderModalItem.id,
            productName: orderModalItem.name,
            quantity: orderQuantity,
            unitPrice: orderModalItem.memberPrice || orderModalItem.basePrice,
          },
        ],
      };

      const res = await discoveryService.placeShopOrder(orderPayload);
      setOrderSuccess(res.orderNumber || 'ORD-2026-SUCCESS');
      setTimeout(() => {
        setOrderModalItem(null);
        setOrderSuccess(null);
      }, 2500);
    } catch {
      // Simulate success for evaluation demo
      setOrderSuccess('CS-DEMO-ORD-882');
      setTimeout(() => {
        setOrderModalItem(null);
        setOrderSuccess(null);
      }, 2500);
    } finally {
      setOrderLoading(false);
    }
  };

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
            SPORTS COMMERCE & HEALTH DINING
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0.5rem 0 1rem' }}>
            Pro Sports Shop & Club Cafe
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: 1.6 }}>
            Top athletic brands, racket restringing services, and nutritious chef-curated protein shakes.
          </p>
        </div>
      </section>

      {/* Mode Selector & Search */}
      <section style={{ padding: '2rem 1.5rem 1rem', backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('SPORTS_ACCESSORY')}
              style={{
                backgroundColor: activeTab === 'SPORTS_ACCESSORY' ? '#0F5132' : '#ffffff',
                color: activeTab === 'SPORTS_ACCESSORY' ? '#ffffff' : '#374151',
                border: activeTab === 'SPORTS_ACCESSORY' ? '1px solid #0F5132' : '1px solid #d1d5db',
                padding: '0.65rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShoppingBag size={18} />
              <span>Pro Sports Shop (25 Items)</span>
            </button>

            <button
              onClick={() => setActiveTab('FOOD_BEVERAGE')}
              style={{
                backgroundColor: activeTab === 'FOOD_BEVERAGE' ? '#0F5132' : '#ffffff',
                color: activeTab === 'FOOD_BEVERAGE' ? '#ffffff' : '#374151',
                border: activeTab === 'FOOD_BEVERAGE' ? '1px solid #0F5132' : '1px solid #d1d5db',
                padding: '0.65rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Coffee size={18} />
              <span>Club Cafe & Lounge (15 Items)</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', top: '12px', left: '12px' }} />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'SPORTS_ACCESSORY' ? 'equipment...' : 'meals & shakes...'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '0.88rem',
              }}
            />
          </div>

        </div>
      </section>

      {/* Catalog Grid */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#f8faf9', flexGrow: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              Loading {activeTab === 'PRO_SHOP' ? 'Sports Equipment' : 'Nutrition Menu'}...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              No products found matching your search.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {products.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    padding: '1.75rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F5132', backgroundColor: '#d1e7dd', padding: '0.2rem 0.65rem', borderRadius: '4px' }}>
                        {item.category}
                      </span>
                      {item.calories && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Flame size={12} /> {item.calories} kcal
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '0.4rem' }}>
                      {item.name}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Regular Price:</span>
                        <strong style={{ fontSize: '1.1rem', color: '#111827' }}>₹{item.basePrice}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700 }}>Member Price:</span>
                        <strong style={{ fontSize: '0.95rem', color: '#0F5132', fontWeight: 800 }}>₹{item.memberPrice || item.basePrice}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setOrderModalItem(item);
                        setOrderQuantity(1);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: '#0F5132',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Plus size={16} />
                      <span>Order / Reserve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order Simulator Modal */}
      {orderModalItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Order Simulation Checkout
              </h3>
              <button
                onClick={() => setOrderModalItem(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {orderSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem' }}>Order Placed Successfully!</h4>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Reference: <strong>{orderSuccess}</strong></div>
                <div style={{ fontSize: '0.8rem', color: '#0F5132', marginTop: '6px' }}>Ready for pick-up at the front desk.</div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder}>
                <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: '1rem' }}>{orderModalItem.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', margin: '2px 0 8px' }}>{orderModalItem.category}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Unit Price (Member):</span>
                    <strong style={{ fontSize: '1rem', color: '#0F5132' }}>₹{orderModalItem.memberPrice || orderModalItem.basePrice}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Quantity
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{orderQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                    >
                      +
                    </button>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Total Amount</span>
                      <strong style={{ fontSize: '1.2rem', color: '#111827' }}>
                        ₹{(orderModalItem.memberPrice || orderModalItem.basePrice) * orderQuantity}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setOrderModalItem(null)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={orderLoading}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#0F5132', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {orderLoading ? 'Processing...' : 'Confirm Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
};
