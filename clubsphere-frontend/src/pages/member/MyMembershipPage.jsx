import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { membershipService } from '../../services/membershipService';
import { CreditCard, RotateCw, QrCode, Calendar, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const MyMembershipPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Renewal
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const data = await membershipService.getMyMemberships();
      setMemberships(data);
    } catch (err) {
      console.error('Failed to load memberships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const openRenewModal = (m) => {
    setSelectedMembership(m);
    setRenewModalOpen(true);
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await membershipService.renewMembership(selectedMembership.id, { paymentMethod });
      alert('Membership successfully extended and renewed!');
      setRenewModalOpen(false);
      fetchMemberships();
    } catch (err) {
      alert(err.message || 'Renewal failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <DashboardLayout
      title="My Membership & History"
      subtitle="View your subscription validity, renewal status, and past transactions"
    >
      <div className="view-header">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Subscription Records</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>All active and historical plans registered under your profile</p>
        </div>
        <Link to="/member/plans" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <Sparkles size={16} /> Browse New Tiers
        </Link>
      </div>

      {loading ? (
        <Loader message="Loading membership history..." />
      ) : memberships.length > 0 ? (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Membership ID</th>
                <th>Plan Tier</th>
                <th>Price Paid</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0F5132' }}>
                      {m.membershipNumber}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Badge type={m.planCategory}>{m.planCategory}</Badge>
                      <span style={{ fontWeight: 600 }}>{m.planName}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(m.planPrice)}</td>
                  <td style={{ fontSize: '0.85rem' }}>{m.startDate}</td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.endDate}</td>
                  <td>
                    <Badge type={m.status}>{m.status}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <Link to="/member/qr-card" className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
                        <QrCode size={15} /> Pass
                      </Link>
                      <button
                        onClick={() => openRenewModal(m)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '4px' }}
                      >
                        <RotateCw size={15} /> Renew
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <CreditCard size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
            No Active Memberships Found
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You haven't subscribed to any ClubSphere membership plan yet. Select a plan to start playing!
          </p>
          <Link to="/member/plans" className="btn btn-primary">
            Explore Membership Plans
          </Link>
        </div>
      )}

      {/* ================= RENEW MEMBERSHIP MODAL ================= */}
      <Modal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        title={selectedMembership ? `Renew ${selectedMembership.planName}` : 'Renew Plan'}
      >
        {selectedMembership && (
          <form onSubmit={handleRenewSubmit}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#1f2937' }}>{selectedMembership.planName}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Current Expiry: <strong>{selectedMembership.endDate}</strong>
                  </p>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F5132' }}>
                  {formatCurrency(selectedMembership.planPrice)}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="CASH">Cash at Club Counter</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setRenewModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Renewing...' : 'Confirm Renewal'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
};
