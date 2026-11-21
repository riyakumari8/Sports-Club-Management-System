import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { membershipService } from '../../services/membershipService';
import { Layers, Plus, Edit, Check, X, ShieldAlert, Sparkles, DollarSign, Clock } from 'lucide-react';

export const PlanManagementPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    planCode: '',
    name: '',
    category: 'GOLD',
    description: '',
    price: '',
    durationDays: 365,
    minAge: '',
    maxAge: '',
    benefits: '',
    isActive: true,
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await membershipService.getAllPlansAdmin();
      setPlans(data);
    } catch (err) {
      console.error('Failed to load plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      planCode: '',
      name: '',
      category: 'GOLD',
      description: '',
      price: '',
      durationDays: 365,
      minAge: '',
      maxAge: '',
      benefits: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      planCode: plan.planCode,
      name: plan.name,
      category: plan.category,
      description: plan.description || '',
      price: plan.price,
      durationDays: plan.durationDays,
      minAge: plan.minAge ?? '',
      maxAge: plan.maxAge ?? '',
      benefits: plan.benefits || '',
      isActive: plan.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        durationDays: parseInt(formData.durationDays, 10),
        minAge: formData.minAge ? parseInt(formData.minAge, 10) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge, 10) : null,
      };

      if (editingPlan) {
        await membershipService.updatePlan(editingPlan.id, payload);
      } else {
        await membershipService.createPlan(payload);
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Failed to save plan');
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
      title="Membership Plan Configuration"
      subtitle="Admin control over membership categories, pricing, durations, and benefits"
    >
      <div className="view-header">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Active Tier Catalog</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Prices and perks are dynamically configurable for Gold, Silver, and Junior tiers
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      {loading ? (
        <Loader message="Loading membership plans..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
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
                  borderTop: isGold
                    ? '4px solid #d4af37'
                    : isJunior
                    ? '4px solid #0284c7'
                    : '4px solid #6b7280',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
                        {p.planCode}
                      </span>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937' }}>{p.name}</h4>
                    </div>
                    <Badge type={p.category}>{p.category}</Badge>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1.25rem' }}>
                    {p.description}
                  </p>

                  <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F5132' }}>
                        {formatCurrency(p.price)}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>/ {p.durationDays} days</span>
                    </div>

                    {(p.minAge || p.maxAge) && (
                      <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600, marginTop: '4px' }}>
                        Age Requirement: {p.minAge ? `${p.minAge}+` : ''} {p.maxAge ? `Under ${p.maxAge + 1}` : ''}
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Included Privileges
                    </h5>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: 0 }}>
                      {benefitsList.map((b, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#374151' }}>
                          <Check size={16} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: p.isActive ? '#15803d' : '#9ca3af', fontWeight: 600 }}>
                    {p.isActive ? '● Published Active' : '○ Inactive'}
                  </span>
                  <button onClick={() => openEditModal(p)} className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
                    <Edit size={14} /> Edit Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CREATE / EDIT PLAN MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? `Edit ${editingPlan.name}` : 'Create Membership Plan'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Plan Code *</label>
              <input
                type="text"
                required
                disabled={!!editingPlan}
                placeholder="e.g. GOLD-YR"
                value={formData.planCode}
                onChange={(e) => setFormData({ ...formData, planCode: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="GOLD">GOLD (Premium Full Access)</option>
                <option value="SILVER">SILVER (Standard Club Access)</option>
                <option value="JUNIOR">JUNIOR (Under 18 Youth)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Plan Display Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gold Annual Membership"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price (INR) *</label>
              <input
                type="number"
                required
                min={0}
                step="50"
                placeholder="15000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Days) *</label>
              <input
                type="number"
                required
                min={1}
                placeholder="365"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Min Age (Optional)</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 5"
                value={formData.minAge}
                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Age (e.g. 17 for Junior)</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 17"
                value={formData.maxAge}
                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={2}
              placeholder="Summary of this plan's perks"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Benefits (Comma separated or JSON array)</label>
            <textarea
              rows={3}
              placeholder='Unlimited Court Access, 15% Shop Discount, Locker Service'
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              style={{ width: 'auto' }}
            />
            <label htmlFor="isActiveCheck" style={{ fontSize: '0.9rem', cursor: 'pointer', margin: 0 }}>
              Active (Visible in public membership catalog)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
