import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { integrationService } from '../../services/integrationService';
import { membershipService } from '../../services/membershipService';
import {
  Share2,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Coffee,
  CalendarCheck,
  TrendingUp,
  Code,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const TeamIntegrationDemoPage = () => {
  // Swathi Testing State
  const [swathiInput, setSwathiInput] = useState('CS-MEM-2026-00101');
  const [swathiResult, setSwathiResult] = useState(null);
  const [swathiLoading, setSwathiLoading] = useState(false);

  // Balaji Testing State
  const [balajiMemberId, setBalajiMemberId] = useState('1');
  const [balajiResult, setBalajiResult] = useState(null);
  const [balajiLoading, setBalajiLoading] = useState(false);

  // Anish Testing State
  const [anishSummary, setAnishSummary] = useState(null);
  const [anishLoading, setAnishLoading] = useState(false);

  // Member shortcuts
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    membershipService.getAllMemberships().then((data) => {
      setMemberships(data);
      if (data.length > 0) {
        setSwathiInput(data[0].membershipNumber);
        setBalajiMemberId(data[0].memberId.toString());
      }
    }).catch(() => {});

    loadAnishData();
  }, []);

  const testSwathiCourtVerification = async (e) => {
    if (e) e.preventDefault();
    setSwathiLoading(true);
    try {
      const res = await integrationService.verifyMemberForCourtBooking(swathiInput);
      setSwathiResult(res);
    } catch (err) {
      setSwathiResult({ valid: false, message: err.message });
    } finally {
      setSwathiLoading(false);
    }
  };

  const testBalajiDiscounts = async (e) => {
    if (e) e.preventDefault();
    setBalajiLoading(true);
    try {
      const res = await integrationService.getMemberDiscounts(balajiMemberId);
      setBalajiResult(res);
    } catch (err) {
      setBalajiResult({ eligible: false, message: err.message });
    } finally {
      setBalajiLoading(false);
    }
  };

  const loadAnishData = async () => {
    setAnishLoading(true);
    try {
      const res = await integrationService.getClubSummary();
      setAnishSummary(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnishLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <DashboardLayout
      title="Inter-Module Team Integration Console"
      subtitle="Live verification of reusable API contracts created for Swathi, Balaji, and Anish"
    >
      {/* Intro Banner */}
      <div className="cs-card" style={{ background: 'linear-gradient(135deg, #072a18, #0F5132)', color: '#ffffff', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <Sparkles size={22} color="#d4af37" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Seamless Team Integration Architecture</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '850px', lineHeight: 1.6 }}>
          As assigned in the project requirements, Riya's core module serves as the primary system of record for Users, Members, and Staff.
          Instead of creating redundant database tables, Swathi, Balaji, and Anish interact with these secure, reusable micro-endpoints.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* ================= SWATHI'S MODULE ================= */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>
                Swathi: Court Booking Verification
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Endpoint: <code>GET /api/integration/members/verify/&#123;id&#125;</code>
              </p>
            </div>
          </div>

          <form onSubmit={testSwathiCourtVerification} style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Test Membership Number or QR Token</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                required
                placeholder="e.g. CS-MEM-2026-00101"
                value={swathiInput}
                onChange={(e) => setSwathiInput(e.target.value)}
              />
              <button type="submit" disabled={swathiLoading} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                {swathiLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>

          {swathiResult && (
            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                {swathiResult.valid ? (
                  <Badge type="active">Access Granted</Badge>
                ) : (
                  <Badge type="expired">Access Denied</Badge>
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{swathiResult.message}</span>
              </div>

              {swathiResult.valid && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Member:</span> <strong>{swathiResult.memberName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Tier Category:</span> <Badge type={swathiResult.planCategory}>{swathiResult.planCategory}</Badge>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Advance Booking:</span> <strong>{swathiResult.maxBookingDaysInAdvance} Days</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Court Discount:</span> <strong>{swathiResult.courtBookingDiscountPercent}%</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= BALAJI'S MODULE ================= */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>
                Balaji: Shop & Cafe Discount Eligibility
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Endpoint: <code>GET /api/integration/members/discount-eligibility/&#123;id&#125;</code>
              </p>
            </div>
          </div>

          <form onSubmit={testBalajiDiscounts} style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Select / Enter Member ID</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                required
                min={1}
                placeholder="e.g. 1"
                value={balajiMemberId}
                onChange={(e) => setBalajiMemberId(e.target.value)}
              />
              <button type="submit" disabled={balajiLoading} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                {balajiLoading ? 'Checking...' : 'Check Perks'}
              </button>
            </div>
          </form>

          {balajiResult && (
            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                {balajiResult.eligible ? (
                  <Badge type="active">Discount Eligible</Badge>
                ) : (
                  <Badge type="expired">No Discount</Badge>
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{balajiResult.memberName || 'Member'}</span>
              </div>

              {balajiResult.eligible && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F5132', fontWeight: 700 }}>
                      <ShoppingBag size={16} /> Sports Shop Discount
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#0F5132' }}>
                      {balajiResult.sportsShopDiscountPercent}% OFF
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700 }}>
                      <Coffee size={16} /> Cafe & Bar Discount
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#b45309' }}>
                      {balajiResult.cafeBarDiscountPercent}% OFF
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= ANISH'S MODULE ================= */}
      <div className="cs-card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>
                Anish: Central Finance Ledger & Analytics Dashboard Feed
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Endpoints: <code>/api/integration/finance/...</code> and <code>/api/integration/analytics/club-summary</code>
              </p>
            </div>
          </div>
          <button onClick={loadAnishData} className="btn btn-secondary btn-sm">
            Refresh Feed
          </button>
        </div>

        {anishLoading ? (
          <Loader message="Aggregating club ledger feed..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Total Club Accounts</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', marginTop: '2px' }}>
                {anishSummary?.totalUsers ?? 0}
              </div>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Active Members</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F5132', marginTop: '2px' }}>
                {anishSummary?.activeMembers ?? 0}
              </div>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Active Employees</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                {anishSummary?.activeEmployees ?? 0}
              </div>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Membership Revenue (MTD)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                {formatCurrency(anishSummary?.monthlyMembershipRevenue)}
              </div>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Payroll Disbursed (MTD)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                {formatCurrency(anishSummary?.monthlyPayrollExpense)}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
