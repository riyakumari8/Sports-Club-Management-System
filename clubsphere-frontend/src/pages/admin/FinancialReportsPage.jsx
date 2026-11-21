import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Loader } from '../../components/common/Loader';
import { financeService } from '../../services/financeService';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Layers,
  Filter,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const REPORT_CATALOG = [
  { id: 'PROFIT_AND_LOSS', name: 'Statement of Profit and Loss (P&L)', icon: Layers, desc: 'Consolidated view of recognized revenue versus operational expenses' },
  { id: 'DAILY_REVENUE', name: 'Daily Revenue Audit Report', icon: TrendingUp, desc: 'Day-by-day revenue receipts across all facilities' },
  { id: 'WEEKLY_REVENUE', name: 'Weekly Revenue Consolidated Report', icon: TrendingUp, desc: 'Weekly trend analysis and court utilization collections' },
  { id: 'MONTHLY_REVENUE', name: 'Monthly Revenue Breakdown Report', icon: TrendingUp, desc: 'Monthly financial summary across memberships, courts, and cafes' },
  { id: 'YEARLY_REVENUE', name: 'Annual Comprehensive Revenue Report', icon: TrendingUp, desc: 'Full fiscal year revenue figures' },
  { id: 'MEMBERSHIP_REVENUE', name: 'Membership Subscriptions & Renewals', icon: DollarSign, desc: 'Gold, Silver, and Junior tier dues collections' },
  { id: 'COURT_BOOKING_REVENUE', name: 'Court Booking & Green Fees', icon: DollarSign, desc: 'Hourly court reservations and floodlight surcharge fees' },
  { id: 'SPORTS_SHOP_SALES', name: 'Pro Sports Shop Equipment Sales', icon: DollarSign, desc: 'Rackets, cricket bats, apparel, and tournament gear' },
  { id: 'FOOD_SHOP_SALES', name: 'Club Cafe & Nutrition Lounge Sales', icon: DollarSign, desc: 'Smoothies, energy snacks, and cafe beverages' },
  { id: 'EXPENSE_REPORT', name: 'Comprehensive Operational Expenses', icon: TrendingDown, desc: 'Staff payroll, resurfacing, utilities, inventory, and events' },
  { id: 'PENDING_PAYMENTS', name: 'Outstanding & Pending Payments', icon: Clock, desc: 'Unsettled or pending cashier verifications' },
  { id: 'REFUND_REPORT', name: 'Customer Refunds & Adjustments', icon: RotateCcw, desc: 'Rain delays, court cancellations, and billing corrections' },
];

export const FinancialReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('PROFIT_AND_LOSS');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter params
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  const loadReport = async (repType = selectedReport) => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (category) params.category = category;

      const res = await financeService.getReport(repType, params);
      const data = res?.data || res;
      setReportData(data);
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedReport);
  }, [selectedReport]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadReport(selectedReport);
  };

  const handleExportCsv = () => {
    if (!reportData || !reportData.detailedRows || reportData.detailedRows.length === 0) {
      alert('No rows available to export.');
      return;
    }

    const rows = reportData.detailedRows;
    const isExpense = selectedReport === 'EXPENSE_REPORT';

    let headers = [];
    let formattedRows = [];

    if (isExpense) {
      headers = ['Ref', 'Date', 'Category', 'Description', 'Vendor', 'Method', 'Amount (INR)'];
      formattedRows = rows.map((e) => [
        e.expenseReference,
        e.expenseDate,
        e.category,
        `"${e.description}"`,
        `"${e.vendorName || ''}"`,
        e.paymentMethod,
        e.amount,
      ]);
    } else {
      headers = ['Ref', 'Transaction ID', 'Date', 'Payer', 'Email', 'Source', 'Method', 'Status', 'Amount (INR)', 'Refund'];
      formattedRows = rows.map((p) => [
        p.paymentReference,
        p.transactionId,
        p.paymentDate,
        `"${p.payerName}"`,
        p.payerEmail,
        p.sourceModule,
        p.paymentMethod,
        p.paymentStatus,
        p.amount,
        p.refundAmount || 0,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...formattedRows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ClubSphere_${selectedReport}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
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
      title="Financial Accounting Reports"
      subtitle="12 distinct certified audit reports covering revenues, operating expenditures, and profit/loss statements"
    >
      {/* Catalog Selector Grid */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            Select Financial Report (12 Distinct Statements)
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#0F5132', fontWeight: 700 }}>
            Active: {REPORT_CATALOG.find((r) => r.id === selectedReport)?.name}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '0.6rem',
        }}>
          {REPORT_CATALOG.map((rep) => {
            const isSelected = selectedReport === rep.id;
            return (
              <button
                key={rep.id}
                onClick={() => setSelectedReport(rep.id)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #0F5132' : '1px solid #e5e7eb',
                  backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <rep.icon size={15} color={isSelected ? '#0F5132' : '#6b7280'} />
                  <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 700, color: isSelected ? '#0F5132' : '#374151' }}>
                    {rep.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.3 }}>
                  {rep.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Export Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
      }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: '0.45rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: '0.45rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem' }}
            />
          </div>

          {selectedReport === 'EXPENSE_REPORT' && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '0.45rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem' }}
            >
              <option value="">All Categories</option>
              <option value="STAFF_SALARY">Staff Salary</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="UTILITIES">Utilities</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="INVENTORY">Inventory</option>
              <option value="EVENTS">Events</option>
              <option value="OTHER">Other</option>
            </select>
          )}

          <button
            type="submit"
            style={{
              padding: '0.45rem 1rem',
              backgroundColor: '#0F5132',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Apply Dates
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={handleExportCsv}
            style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: '#D4AF37',
              border: 'none',
              color: '#000000',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Main Report View */}
      {loading ? (
        <Loader message="Compiling report metrics and transaction rows..." />
      ) : !reportData ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Failed to generate report.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Printable Report Header */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  CLUBSPHERE SPORTS CLUB MANAGEMENT SYSTEM
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F5132', margin: '4px 0' }}>
                  {reportData.reportTitle}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                  Audit Period: <strong>{reportData.startDate}</strong> to <strong>{reportData.endDate}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Generated On:</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
                  {new Date().toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0F5132', fontWeight: 700 }}>
                  Verified by System Audit Engine
                </div>
              </div>
            </div>

            {/* Summary KPI Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {reportData.totalIncome > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #d1e7dd' }}>
                  <span style={{ fontSize: '0.75rem', color: '#0F5132', fontWeight: 700 }}>Total Recognized Revenue</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F5132', marginTop: '4px' }}>
                    {formatCurrency(reportData.totalIncome)}
                  </div>
                </div>
              )}

              {reportData.totalExpense > 0 && (
                <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Total Operating Expenses</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#dc2626', marginTop: '4px' }}>
                    {formatCurrency(reportData.totalExpense)}
                  </div>
                </div>
              )}

              {selectedReport === 'PROFIT_AND_LOSS' && (
                <div style={{
                  backgroundColor: reportData.netProfit >= 0 ? '#f0fdf4' : '#fff1f2',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `1px solid ${reportData.netProfit >= 0 ? '#bbf7d0' : '#fecdd3'}`,
                }}>
                  <span style={{ fontSize: '0.75rem', color: reportData.netProfit >= 0 ? '#0F5132' : '#be123c', fontWeight: 700 }}>
                    Net Operating Profit / (Loss)
                  </span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: reportData.netProfit >= 0 ? '#0F5132' : '#be123c', marginTop: '4px' }}>
                    {formatCurrency(reportData.netProfit)}
                  </div>
                </div>
              )}

              {reportData.totalRefunds > 0 && (
                <div style={{ backgroundColor: '#faf5ff', padding: '1rem', borderRadius: '8px', border: '1px solid #ede9fe' }}>
                  <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700 }}>Total Customer Refunds</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7c3aed', marginTop: '4px' }}>
                    {formatCurrency(reportData.totalRefunds)}
                  </div>
                </div>
              )}

              {reportData.pendingAmount > 0 && (
                <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                  <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>Pending Collections</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#d97706', marginTop: '4px' }}>
                    {formatCurrency(reportData.pendingAmount)}
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: 700 }}>Records Audited</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827', marginTop: '4px' }}>
                  {reportData.totalRecordsCount} transactions
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Transaction Rows */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8faf9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
                Audit Ledger Items ({reportData.detailedRows?.length || 0})
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Amounts in Indian Rupees (INR)
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563', backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Reference</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Description / Module</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Party / Vendor</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Mode</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700, textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.detailedRows && reportData.detailedRows.length > 0 ? (
                    reportData.detailedRows.map((item, idx) => {
                      const isExp = selectedReport === 'EXPENSE_REPORT';
                      const ref = isExp ? item.expenseReference : item.paymentReference;
                      const date = isExp ? item.expenseDate : formatDate(item.paymentDate);
                      const desc = isExp ? item.description : item.notes || item.sourceModule?.replace('_', ' ');
                      const party = isExp ? item.vendorName || 'Internal' : item.payerName;
                      const mode = item.paymentMethod;
                      const amt = item.amount;

                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#0F5132' }}>
                            {ref}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                            {date}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#111827', fontWeight: 600 }}>
                            {desc}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>
                            {party}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>
                            <span style={{ fontSize: '0.72rem', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              {mode}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800, color: isExp ? '#dc2626' : '#0F5132' }}>
                            {formatCurrency(amt)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                        No records match the requested report criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FinancialReportsPage;
