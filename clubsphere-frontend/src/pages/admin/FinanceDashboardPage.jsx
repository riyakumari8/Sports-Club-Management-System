import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { financeService } from '../../services/financeService';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Calendar,
  Layers,
  ArrowRight,
  FileText,
  ShieldCheck,
  PlusCircle,
  PieChart,
  ShoppingBag,
  Coffee,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const FinanceDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('THIS_MONTH');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchDashboard = async (period = filterPeriod, start = customStart, end = customEnd) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const params = { filter: period };
      if (period === 'CUSTOM') {
        if (start) params.startDate = start;
        if (end) params.endDate = end;
      }
      const res = await financeService.getDashboard(params);
      if (res && res.data) {
        setDashboardData(res.data);
      } else if (res) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to fetch finance dashboard', err);
      setErrorMsg('Failed to load finance metrics. Please ensure backend services are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard('THIS_MONTH');
  }, []);

  const handlePeriodChange = (period) => {
    setFilterPeriod(period);
    if (period !== 'CUSTOM') {
      fetchDashboard(period);
    }
  };

  const handleCustomFilterSubmit = (e) => {
    e.preventDefault();
    if (!customStart || !customEnd) {
      alert('Please specify both start and end dates.');
      return;
    }
    fetchDashboard('CUSTOM', customStart, customEnd);
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout
      title="Finance & Accounting Dashboard"
      subtitle="Comprehensive revenue recognition, operational expenses, profit & loss, and audit trail"
    >
      {/* Top Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {/* Quick Period Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginRight: '4px' }}>
            Period:
          </span>
          {[
            { id: 'TODAY', label: 'Today' },
            { id: 'THIS_WEEK', label: 'This Week' },
            { id: 'THIS_MONTH', label: 'This Month' },
            { id: 'THIS_YEAR', label: 'This Year' },
            { id: 'CUSTOM', label: 'Custom Range' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlePeriodChange(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: filterPeriod === tab.id ? '#0F5132' : '#f3f4f6',
                color: filterPeriod === tab.id ? '#ffffff' : '#4b5563',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Action Navigation */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Link
            to="/admin/payments"
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#f8faf9',
              border: '1px solid #d1e7dd',
              color: '#0F5132',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CreditCard size={15} /> All Payments
          </Link>
          <Link
            to="/admin/expenses"
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#f8faf9',
              border: '1px solid #fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <TrendingDown size={15} /> Log Expense
          </Link>
          <Link
            to="/admin/finance-reports"
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#0F5132',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} /> 12 Financial Reports
          </Link>
          <Link
            to="/admin/reconciliation"
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#D4AF37',
              color: '#000000',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={15} /> Reconciliation
          </Link>
        </div>
      </div>

      {/* Custom Date Form (Shown when CUSTOM is active) */}
      {filterPeriod === 'CUSTOM' && (
        <form
          onSubmit={handleCustomFilterSubmit}
          style={{
            backgroundColor: '#f8faf9',
            border: '1px solid #d1e7dd',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>From:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              style={{
                padding: '0.4rem 0.65rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.82rem',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>To:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              style={{
                padding: '0.4rem 0.65rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.82rem',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#0F5132',
              color: '#ffffff',
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Apply Custom Range
          </button>
        </form>
      )}

      {loading ? (
        <Loader message="Calculating financial metrics from live transactions..." />
      ) : errorMsg ? (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #f87171',
          padding: '1.5rem',
          borderRadius: '12px',
          color: '#991b1b',
          textAlign: 'center',
        }}>
          <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ fontWeight: 700 }}>{errorMsg}</p>
        </div>
      ) : (
        <>
          {/* Main 5 Primary KPI Cards */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <StatCard
              title="Total Recognized Revenue"
              value={formatCurrency(dashboardData?.totalRevenue)}
              icon={DollarSign}
              color="#0F5132"
              bg="#d1e7dd"
              subtitle={`Completed transactions in ${filterPeriod.replace('_', ' ').toLowerCase()}`}
            />
            <StatCard
              title="Today's Revenue"
              value={formatCurrency(dashboardData?.todayRevenue)}
              icon={TrendingUp}
              color="#059669"
              bg="#d1fae5"
              subtitle="Logged since 00:00 IST today"
            />
            <StatCard
              title="Operating Expenses"
              value={formatCurrency(dashboardData?.totalExpenses)}
              icon={TrendingDown}
              color="#dc2626"
              bg="#fee2e2"
              subtitle="Staff payroll, maintenance, utilities"
            />
            <StatCard
              title="Net Operating Profit"
              value={formatCurrency(dashboardData?.netProfit)}
              icon={Activity}
              color={dashboardData?.netProfit >= 0 ? '#0F5132' : '#b91c1c'}
              bg={dashboardData?.netProfit >= 0 ? '#d1e7dd' : '#fef2f2'}
              subtitle="Recognized Revenue minus Expenses"
            />
          </div>

          {/* Secondary 4 Transaction State Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Completed Payments</span>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F5132', margin: '4px 0 0' }}>
                  {dashboardData?.totalCompletedCount || 0}
                </h4>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#d1e7dd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F5132' }}>
                <CheckCircle size={22} />
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Pending Payments</span>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#d97706', margin: '4px 0 0' }}>
                  {formatCurrency(dashboardData?.pendingAmount)}
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{dashboardData?.totalPendingCount || 0} pending review</span>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Clock size={22} />
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Total Refunds Issued</span>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#7c3aed', margin: '4px 0 0' }}>
                  {formatCurrency(dashboardData?.totalRefunds)}
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{dashboardData?.totalRefundedCount || 0} transactions</span>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                <RotateCcw size={22} />
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Failed Transactions</span>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#dc2626', margin: '4px 0 0' }}>
                  {dashboardData?.totalFailedCount || 0}
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Gateway drops / timeouts</span>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                <XCircle size={22} />
              </div>
            </div>
          </div>

          {/* Module Breakdown & Payment Method Breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            {/* Revenue by Module */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#0F5132" /> Revenue by Source Module
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                  {dashboardData?.filterPeriod?.replace('_', ' ')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dashboardData?.revenueByModule && Object.keys(dashboardData.revenueByModule).length > 0 ? (
                  Object.entries(dashboardData.revenueByModule).map(([module, amt]) => {
                    const total = dashboardData.totalRevenue || 1;
                    const pct = Math.min(100, Math.round(((amt || 0) / total) * 100));
                    return (
                      <div key={module}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                          <span style={{ color: '#374151' }}>{module.replace('_', ' ')}</span>
                          <span style={{ color: '#0F5132' }}>{formatCurrency(amt)} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#0F5132', borderRadius: '4px' }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                    No module revenue recorded for this period.
                  </p>
                )}
              </div>
            </div>

            {/* Revenue by Payment Method */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={18} color="#D4AF37" /> Collections by Payment Method
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                  All Completed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dashboardData?.revenueByPaymentMethod && Object.keys(dashboardData.revenueByPaymentMethod).length > 0 ? (
                  Object.entries(dashboardData.revenueByPaymentMethod).map(([method, amt]) => {
                    const total = dashboardData.totalRevenue || 1;
                    const pct = Math.min(100, Math.round(((amt || 0) / total) * 100));
                    return (
                      <div key={method}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                          <span style={{ color: '#374151' }}>{method}</span>
                          <span style={{ color: '#D4AF37', filter: 'brightness(0.8)' }}>{formatCurrency(amt)} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#D4AF37', borderRadius: '4px' }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                    No collections recorded for this period.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Recent Transactions & Finance Alerts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
          }}>
            {/* Recent Payments Table */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Recent Transactions
                </h3>
                <Link to="/admin/payments" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F5132', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#6b7280' }}>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Ref / Date</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Payer</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Source</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Amount</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentPayments && dashboardData.recentPayments.length > 0 ? (
                      dashboardData.recentPayments.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <div style={{ fontWeight: 700, color: '#111827' }}>{p.paymentReference}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{formatDate(p.paymentDate)}</div>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, color: '#374151' }}>{p.payerName}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{p.paymentMethod}</div>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                            }}>
                              {p.sourceModule}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem', fontWeight: 800, color: '#0F5132' }}>
                            {formatCurrency(p.amount)}
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor:
                                p.paymentStatus === 'COMPLETED' ? '#d1e7dd' :
                                p.paymentStatus === 'PENDING' ? '#fef3c7' :
                                p.paymentStatus === 'FAILED' ? '#fee2e2' : '#ede9fe',
                              color:
                                p.paymentStatus === 'COMPLETED' ? '#0F5132' :
                                p.paymentStatus === 'PENDING' ? '#92400e' :
                                p.paymentStatus === 'FAILED' ? '#991b1b' : '#6b21a8',
                            }}>
                              {p.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                          No recent transactions recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Finance Alerts */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="#d97706" /> Live Finance & Audit Alerts
                </h3>
                <Link to="/notifications" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F5132', textDecoration: 'none' }}>
                  Notifications Hub
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dashboardData?.activeAlerts && dashboardData.activeAlerts.length > 0 ? (
                  dashboardData.activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${
                          alert.severity === 'CRITICAL' ? '#dc2626' :
                          alert.severity === 'HIGH' ? '#ea580c' : '#0F5132'
                        }`,
                        backgroundColor: '#f8faf9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>
                          {alert.title}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: alert.severity === 'HIGH' ? '#ffedd5' : '#e0e7ff',
                          color: alert.severity === 'HIGH' ? '#c2410c' : '#3730a3',
                        }}>
                          {alert.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, lineHeight: 1.4 }}>
                        {alert.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                    No active finance alerts at this time. All ledgers balanced.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default FinanceDashboardPage;
