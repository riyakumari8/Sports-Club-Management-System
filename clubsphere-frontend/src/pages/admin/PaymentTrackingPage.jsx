import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { financeService } from '../../services/financeService';
import {
  CreditCard,
  Search,
  Filter,
  RotateCcw,
  Eye,
  PlusCircle,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Hash,
  Layers,
  FileText,
  IndianRupee,
} from 'lucide-react';

export const PaymentTrackingPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected payment for Details Modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Refund Modal state
  const [refundTarget, setRefundTarget] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);

  // Demo Payment Simulation Modal state
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simulateForm, setSimulateForm] = useState({
    payerName: 'Vikram Singh',
    payerEmail: 'vikram.singh@example.com',
    sourceModule: 'MEMBERSHIP_PURCHASE',
    amount: '4999',
    paymentMethod: 'UPI',
    notes: 'Demo transaction created for viva evaluation',
  });
  const [simulateLoading, setSimulateLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (source) params.source = source;
      if (method) params.method = method;
      if (status) params.status = status;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await financeService.getPayments(params);
      const list = res?.data || res || [];
      setPayments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [source, method, status, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSource('');
    setMethod('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setTimeout(fetchPayments, 50);
  };

  const openDetails = (p) => {
    setSelectedPayment(p);
    setIsDetailsOpen(true);
  };

  const openRefundModal = (p) => {
    setRefundTarget(p);
    setRefundAmount(p.amount);
    setRefundReason('Requested cancellation / double deduction refund');
    setIsRefundOpen(true);
  };

  const handleProcessRefund = async (e) => {
    e.preventDefault();
    if (!refundTarget) return;

    const amt = parseFloat(refundAmount);
    if (isNaN(amt) || amt <= 0 || amt > parseFloat(refundTarget.amount)) {
      alert(`Please enter a valid refund amount up to ₹${refundTarget.amount}`);
      return;
    }

    setRefundSubmitting(true);
    try {
      await financeService.processRefund(refundTarget.id, {
        refundAmount: amt,
        refundReason,
      });
      alert(`Refund of ₹${amt} successfully processed! Notification sent to student and admin.`);
      setIsRefundOpen(false);
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process refund.');
    } finally {
      setRefundSubmitting(false);
    }
  };

  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    setSimulateLoading(true);
    try {
      await financeService.simulatePayment({
        payerName: simulateForm.payerName,
        payerEmail: simulateForm.payerEmail,
        sourceModule: simulateForm.sourceModule,
        amount: parseFloat(simulateForm.amount),
        paymentMethod: simulateForm.paymentMethod,
        notes: simulateForm.notes,
        paymentStatus: 'COMPLETED',
      });
      alert('Demo payment created and recorded in audit logs!');
      setIsSimulateOpen(false);
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to simulate payment.');
    } finally {
      setSimulateLoading(false);
    }
  };

  const exportCsv = () => {
    if (payments.length === 0) {
      alert('No payment rows to export.');
      return;
    }

    const headers = ['Payment Reference', 'Transaction ID', 'Payer Name', 'Payer Email', 'Source Module', 'Amount (INR)', 'Payment Method', 'Status', 'Date', 'Cash Staff ID', 'Refund Amount'];
    const rows = payments.map((p) => [
      p.paymentReference,
      p.transactionId,
      `"${p.payerName}"`,
      p.payerEmail,
      p.sourceModule,
      p.amount,
      p.paymentMethod,
      p.paymentStatus,
      p.paymentDate,
      p.receivedByStaffId || '',
      p.refundAmount || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ClubSphere_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (st) => {
    const s = (st || '').toUpperCase();
    if (s === 'COMPLETED') {
      return <span style={{ backgroundColor: '#d1e7dd', color: '#0F5132', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>COMPLETED</span>;
    }
    if (s === 'PENDING') {
      return <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>PENDING</span>;
    }
    if (s === 'FAILED') {
      return <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>FAILED</span>;
    }
    if (s === 'REFUNDED' || s === 'PARTIALLY_REFUNDED') {
      return <span style={{ backgroundColor: '#ede9fe', color: '#6b21a8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>{s}</span>;
    }
    return <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>{s}</span>;
  };

  return (
    <DashboardLayout
      title="Unified Payment Tracking Ledger"
      subtitle="Complete financial trail across memberships, court bookings, sports shop, cafe orders, and refunds"
    >
      {/* Header Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsSimulateOpen(true)}
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: '#0F5132',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <PlusCircle size={16} /> Simulate Demo Payment
          </button>
          <button
            onClick={exportCsv}
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: '#ffffff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>
          Showing <strong style={{ color: '#0F5132' }}>{payments.length}</strong> transactions
        </div>
      </div>

      {/* Filter Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search box */}
          <div style={{ flex: '1 1 240px', minWidth: '220px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search reference, transaction, payer, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Module Source Filter */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#374151',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Source Modules</option>
            <option value="MEMBERSHIP_PURCHASE">Membership Purchase</option>
            <option value="MEMBERSHIP_RENEWAL">Membership Renewal</option>
            <option value="MEMBERSHIP_UPGRADE">Membership Upgrade</option>
            <option value="COURT_BOOKING">Court Booking</option>
            <option value="SPORTS_SHOP">Sports Shop (Balaji)</option>
            <option value="FOOD_BEVERAGE">Food & Beverage Cafe</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#374151',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Methods</option>
            <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
            <option value="CASH">Cash (Front Desk)</option>
            <option value="CARD">Debit / Credit Card</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#374151',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="PARTIALLY_REFUNDED">PARTIALLY_REFUNDED</option>
          </select>

          {/* Date range */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '0.48rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.82rem' }}
            title="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '0.48rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.82rem' }}
            title="End Date"
          />

          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0F5132',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Search
          </button>

          {(search || source || method || status || startDate || endDate) && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Main Payments Table */}
      {loading ? (
        <Loader message="Loading unified payment ledger..." />
      ) : payments.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '3rem',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <CreditCard size={40} style={{ margin: '0 auto 0.75rem', color: '#9ca3af' }} />
          <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: '#111827' }}>No transactions found</h4>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>Try relaxing search filters or simulate a demo payment.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Payment Reference</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Date & Time</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Payer Details</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Source Module</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Amount (₹)</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Method</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#0F5132' }}>{p.paymentReference}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'monospace' }}>{p.transactionId}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                      {formatDate(p.paymentDate)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{p.payerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.payerEmail}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor:
                          p.sourceModule.includes('MEMBERSHIP') ? '#fef3c7' :
                          p.sourceModule === 'COURT_BOOKING' ? '#dbeafe' :
                          p.sourceModule === 'SPORTS_SHOP' ? '#dcfce7' : '#ffedd5',
                        color:
                          p.sourceModule.includes('MEMBERSHIP') ? '#92400e' :
                          p.sourceModule === 'COURT_BOOKING' ? '#1e40af' :
                          p.sourceModule === 'SPORTS_SHOP' ? '#166534' : '#9a3412',
                      }}>
                        {p.sourceModule.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>
                        {formatCurrency(p.amount)}
                      </div>
                      {p.refundAmount > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>
                          Refunded: {formatCurrency(p.refundAmount)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#374151' }}>{p.paymentMethod}</div>
                      {p.paymentMethod === 'CASH' && p.receivedByStaffId && (
                        <div style={{ fontSize: '0.72rem', color: '#0F5132', fontWeight: 600 }}>
                          Staff Recipient: #{p.receivedByStaffId}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {getStatusBadge(p.paymentStatus)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openDetails(p)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title="View Details"
                        >
                          <Eye size={13} /> View
                        </button>

                        {p.paymentStatus === 'COMPLETED' && (
                          <button
                            onClick={() => openRefundModal(p)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#fef2f2',
                              color: '#991b1b',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title="Process Refund"
                          >
                            <RotateCcw size={13} /> Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PAYMENT DETAILS MODAL ================= */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Transaction Record Details" maxWidth="600px">
        {selectedPayment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8faf9',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Reference</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F5132' }}>{selectedPayment.paymentReference}</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#6b7280' }}>TXN: {selectedPayment.transactionId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Amount</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#111827' }}>{formatCurrency(selectedPayment.amount)}</div>
                <div>{getStatusBadge(selectedPayment.paymentStatus)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Payer Name:</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{selectedPayment.payerName}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Payer Email:</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{selectedPayment.payerEmail}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Source Module:</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{selectedPayment.sourceModule}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Payment Method:</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{selectedPayment.paymentMethod}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Payment Date:</label>
                <div style={{ color: '#374151' }}>{formatDate(selectedPayment.paymentDate)}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Related Entity ID:</label>
                <div style={{ color: '#374151' }}>#{selectedPayment.relatedEntityId || 'N/A'}</div>
              </div>
              {selectedPayment.paymentMethod === 'CASH' && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Cash Receiving Staff ID:</label>
                  <div style={{ color: '#0F5132', fontWeight: 700 }}>Staff Employee #{selectedPayment.receivedByStaffId || 'Front Desk'}</div>
                </div>
              )}
              {selectedPayment.refundAmount > 0 && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700 }}>Refund Amount & Reason:</label>
                  <div style={{ color: '#7c3aed', fontWeight: 700 }}>
                    {formatCurrency(selectedPayment.refundAmount)} – {selectedPayment.refundReason}
                  </div>
                </div>
              )}
            </div>

            {selectedPayment.notes && (
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>Notes / Service Description:</label>
                <div style={{ backgroundColor: '#f9fafb', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #e5e7eb', color: '#374151' }}>
                  {selectedPayment.notes}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= REFUND MODAL ================= */}
      <Modal isOpen={isRefundOpen} onClose={() => setIsRefundOpen(false)} title="Issue Customer Refund" maxWidth="500px">
        {refundTarget && (
          <form onSubmit={handleProcessRefund} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.85rem', color: '#991b1b', fontSize: '0.85rem' }}>
              <strong>Caution:</strong> Issuing a refund will update transaction status, generate an audit log, and send automated notifications to the student.
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Transaction Amount:
              </label>
              <input
                type="text"
                disabled
                value={`₹${refundTarget.amount} (${refundTarget.paymentReference})`}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Refund Amount (₹):
              </label>
              <input
                type="number"
                step="0.01"
                max={refundTarget.amount}
                min="1"
                required
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                Enter full amount for complete refund, or lesser for partial credit.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Refund Reason:
              </label>
              <textarea
                required
                rows="3"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="State administrative justification for refund..."
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsRefundOpen(false)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={refundSubmitting}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {refundSubmitting ? 'Processing...' : 'Confirm & Issue Refund'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ================= SIMULATE PAYMENT MODAL ================= */}
      <Modal isOpen={isSimulateOpen} onClose={() => setIsSimulateOpen(false)} title="Simulate Demo Transaction" maxWidth="520px">
        <form onSubmit={handleSimulateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>
            Simulate realistic payments from any club module for evaluation and viva demo.
          </p>

          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Payer Full Name:</label>
            <input
              type="text"
              required
              value={simulateForm.payerName}
              onChange={(e) => setSimulateForm({ ...simulateForm, payerName: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Payer Email:</label>
            <input
              type="email"
              required
              value={simulateForm.payerEmail}
              onChange={(e) => setSimulateForm({ ...simulateForm, payerEmail: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Source Module:</label>
              <select
                value={simulateForm.sourceModule}
                onChange={(e) => setSimulateForm({ ...simulateForm, sourceModule: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              >
                <option value="MEMBERSHIP_PURCHASE">Membership Purchase</option>
                <option value="MEMBERSHIP_RENEWAL">Membership Renewal</option>
                <option value="COURT_BOOKING">Court Booking</option>
                <option value="SPORTS_SHOP">Sports Shop (Balaji)</option>
                <option value="FOOD_BEVERAGE">Food & Beverage Cafe</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Amount (₹):</label>
              <input
                type="number"
                required
                min="1"
                value={simulateForm.amount}
                onChange={(e) => setSimulateForm({ ...simulateForm, amount: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Payment Method:</label>
            <select
              value={simulateForm.paymentMethod}
              onChange={(e) => setSimulateForm({ ...simulateForm, paymentMethod: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="UPI">UPI (GooglePay / PhonePe / QR)</option>
              <option value="CASH">Cash (Front Desk)</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="NET_BANKING">Net Banking</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Service Notes / Description:</label>
            <input
              type="text"
              value={simulateForm.notes}
              onChange={(e) => setSimulateForm({ ...simulateForm, notes: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsSimulateOpen(false)}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={simulateLoading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0F5132',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {simulateLoading ? 'Creating...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default PaymentTrackingPage;
