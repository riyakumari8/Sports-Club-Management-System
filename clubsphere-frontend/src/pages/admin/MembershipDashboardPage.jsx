import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { QrMembershipCard } from '../../components/cards/QrMembershipCard';
import { membershipService } from '../../services/membershipService';
import {
  CreditCard,
  Users,
  AlertTriangle,
  RotateCw,
  QrCode,
  DollarSign,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';

export const MembershipDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // QR Modal
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [activeCardData, setActiveCardData] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);

  // Renewal Modal
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewingId, setRenewingId] = useState(null);
  const [renewPaymentMethod, setRenewPaymentMethod] = useState('UPI');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, allData] = await Promise.all([
        membershipService.getDashboardStats(),
        membershipService.getAllMemberships(),
      ]);
      setStats(statsData);
      setMemberships(allData);
    } catch (err) {
      console.error('Failed to load membership records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openQrCard = async (membershipId) => {
    setCardLoading(true);
    setCardModalOpen(true);
    try {
      const card = await membershipService.getQrMembershipCard(membershipId);
      setActiveCardData(card);
    } catch (err) {
      alert('Failed to generate QR card: ' + err.message);
      setCardModalOpen(false);
    } finally {
      setCardLoading(false);
    }
  };

  const openRenew = (membershipId) => {
    setRenewingId(membershipId);
    setRenewModalOpen(true);
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    try {
      await membershipService.renewMembership(renewingId, { paymentMethod: renewPaymentMethod });
      alert('Membership successfully renewed!');
      setRenewModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Renewal failed');
    }
  };

  // Filtered list
  const filtered = memberships.filter((m) => {
    const matchSearch =
      !search ||
      m.memberName?.toLowerCase().includes(search.toLowerCase()) ||
      m.membershipNumber?.toLowerCase().includes(search.toLowerCase()) ||
      m.memberCode?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = !categoryFilter || m.planCategory === categoryFilter;
    const matchStatus = !statusFilter || m.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <DashboardLayout
      title="Membership Management"
      subtitle="Subscriptions, renewals, QR identity cards, and tier tracking"
    >
      {/* Metric Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Club Members"
          value={stats?.totalMembers ?? 0}
          icon={Users}
          color="#0F5132"
          bg="#d1e7dd"
        />
        <StatCard
          title="Active Memberships"
          value={stats?.activeMembers ?? 0}
          icon={CreditCard}
          color="#059669"
          bg="#d1fae5"
        />
        <StatCard
          title="Gold Tier VIPs"
          value={stats?.goldMembers ?? 0}
          icon={CreditCard}
          color="#b45309"
          bg="#fef3c7"
        />
        <StatCard
          title="Silver Tier Members"
          value={stats?.silverMembers ?? 0}
          icon={CreditCard}
          color="#4b5563"
          bg="#f3f4f6"
        />
        <StatCard
          title="Junior Members (<18)"
          value={stats?.juniorMembers ?? 0}
          icon={CreditCard}
          color="#0284c7"
          bg="#e0f2fe"
        />
        <StatCard
          title="Expired Memberships"
          value={stats?.expiredMembers ?? 0}
          icon={AlertTriangle}
          color="#dc2626"
          bg="#fee2e2"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="view-header">
        <div className="filters-bar" style={{ margin: 0 }}>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by member name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Tiers</option>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
            <option value="JUNIOR">Junior</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
          </select>
        </div>

        <button onClick={fetchData} className="btn btn-secondary btn-sm" title="Refresh">
          <RotateCw size={15} /> Refresh Data
        </button>
      </div>

      {/* Memberships Table */}
      {loading ? (
        <Loader message="Loading membership database..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Membership ID</th>
                <th>Member Name</th>
                <th>Plan Details</th>
                <th>Validity Window</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0F5132' }}>
                        {m.membershipNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{m.memberCode}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{m.memberName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{m.memberEmail}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Badge type={m.planCategory}>{m.planCategory}</Badge>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.planName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {m.startDate} to <strong>{m.endDate}</strong>
                      </div>
                    </td>
                    <td>
                      <Badge type={m.status}>{m.status}</Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openQrCard(m.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '4px' }}
                          title="Generate QR Pass"
                        >
                          <QrCode size={15} /> QR Pass
                        </button>
                        <button
                          onClick={() => openRenew(m.id)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '4px' }}
                          title="Renew Membership"
                        >
                          <RotateCw size={15} /> Renew
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No membership records found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= QR MEMBERSHIP CARD MODAL ================= */}
      <Modal
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        title="Official QR Membership Pass"
      >
        {cardLoading ? (
          <Loader message="Rendering digital membership card & QR code..." />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
            <QrMembershipCard cardData={activeCardData} />
          </div>
        )}
      </Modal>

      {/* ================= RENEW MEMBERSHIP MODAL ================= */}
      <Modal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        title="Renew Member Subscription"
      >
        <form onSubmit={handleRenewSubmit}>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '1.25rem' }}>
            Extending the duration of this membership automatically updates the validity dates and logs a new transaction.
          </p>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              value={renewPaymentMethod}
              onChange={(e) => setRenewPaymentMethod(e.target.value)}
            >
              <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="CASH">Cash at Club Desk</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setRenewModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm & Renew
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
