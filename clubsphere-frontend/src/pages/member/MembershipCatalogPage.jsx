import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { membershipService } from '../../services/membershipService';
import { Check, Sparkles, CreditCard, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export const MembershipCatalogPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await membershipService.getActivePlans();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const openSubscribeModal = (plan) => {
    setSelectedPlan(plan);
    setError('');
    setModalOpen(true);
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await membershipService.registerMembership({
        planId: selectedPlan.id,
        paymentMethod,
      });
      alert(`Congratulations! You have successfully subscribed to ${selectedPlan.name}.`);
      setModalOpen(false);
      navigate('/member/my-membership');
    } catch (err) {
      setError(err.message || 'Subscription failed. Please check requirements.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const parseBenefits = (benefitsStr) => {
    try {
      const parsed = JSON.parse(benefitsStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return benefitsStr ? benefitsStr.split(',').map((b) => b.trim()) : [];
  };

  return (
    <DashboardLayout
      title="Membership Catalog"
      subtitle="Explore ClubSphere tiers tailored for athletes, standard players, and junior champions"
    >
      <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem' }}>
          Select Your ClubSphere Experience
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
          Flexible duration packages granting all-court access, professional coaching, pro-shop discounts, and social clubhouse amenities.
        </p>
      </div>

      {loading ? (
        <Loader message="Loading membership tiers..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {plans.map((p) => {
            const benefitsList = parseBenefits(p.benefits);
            const isGold = p.category === 'GOLD';
            const isJunior = p.category === 'JUNIOR';

            return (
              <div
                key={p.id}
                className="cs-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                  border: isGold ? '2px solid #d4af37' : '1px solid #e5e7eb',
                  boxShadow: isGold ? '0 10px 25px rgba(212, 175, 55, 0.2)' : 'var(--shadow-sm)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isGold && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '-32px',
                    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '4px 36px',
                    transform: 'rotate(45deg)',
                    letterSpacing: '0.05em'
                  }}>
                    POPULAR
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                    <Badge type={p.category}>{p.category}</Badge>
                    {isJunior && (
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                        (Under 18 Youth Only)
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem' }}>
                    {p.name}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: '#6b7280', minHeight: '40px', marginBottom: '1.25rem' }}>
                    {p.description}
                  </p>

                  <div style={{ background: '#f9fafb', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F5132' }}>
                        {formatCurrency(p.price)}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>/ {p.durationDays} days</span>
                    </div>
                  </div>

                  <h5 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#4b5563', marginBottom: '0.75rem' }}>
                    Membership Perks & Privileges
                  </h5>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0 }}>
                    {benefitsList.map((b, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem', color: '#374151' }}>
                        <Check size={18} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <button
                    onClick={() => openSubscribeModal(p)}
                    className={isGold ? 'btn btn-gold' : 'btn btn-primary'}
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    Subscribe to {p.name} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= SUBSCRIBE MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedPlan ? `Join ${selectedPlan.name}` : 'Subscribe'}
      >
        {selectedPlan && (
          <form onSubmit={handleSubscribeSubmit}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f2937' }}>{selectedPlan.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Duration: {selectedPlan.durationDays} days</div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F5132' }}>
                  {formatCurrency(selectedPlan.price)}
                </div>
              </div>
              {selectedPlan.category === 'JUNIOR' && (
                <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '0.5rem', fontWeight: 600 }}>
                  ⚠️ Notice: Junior Membership requires the member to be under 18 years of age.
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Select Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI (GooglePay / PhonePe / QR)</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="CASH">Cash at Club Counter</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Processing Payment...' : 'Confirm Subscription'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
};
