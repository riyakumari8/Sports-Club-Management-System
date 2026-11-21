import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { financeService } from '../../services/financeService';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard,
  Receipt,
  Download,
  Printer,
  Calendar,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Eye,
} from 'lucide-react';

export const MyPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    const fetchMyPayments = async () => {
      setLoading(true);
      try {
        const res = await financeService.getMyPayments();
        const list = res?.data || res || [];
        setPayments(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to load user payments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPayments();
  }, []);

  const openReceipt = (p) => {
    setSelectedReceipt(p);
    setIsReceiptOpen(true);
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
      return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const totalSpent = payments
    .filter((p) => p.paymentStatus === 'COMPLETED')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const completedCount = payments.filter((p) => p.paymentStatus === 'COMPLETED').length;
  const refundsTotal = payments.reduce((acc, curr) => acc + (parseFloat(curr.refundAmount) || 0), 0);

  return (
    <DashboardLayout
      title="My Payment History & Official Receipts"
      subtitle="View your past transactions, court booking receipts, membership invoices, and refund credits"
    >
      {/* Student Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Total Club Dues Paid"
          value={formatCurrency(totalSpent)}
          icon={DollarSign}
          color="#0F5132"
          bg="#d1e7dd"
          subtitle="All completed transactions"
        />
        <StatCard
          title="Completed Transactions"
          value={completedCount}
          icon={Receipt}
          color="#2563eb"
          bg="#dbeafe"
          subtitle="Memberships, courts, pro shop & cafe"
        />
        <StatCard
          title="Refunds Credited"
          value={formatCurrency(refundsTotal)}
          icon={RotateCcw}
          color="#7c3aed"
          bg="#ede9fe"
          subtitle="Processed to original payment method"
        />
      </div>

      {/* Main Transactions List */}
      {loading ? (
        <Loader message="Loading your transaction history..." />
      ) : payments.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '3rem',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <Receipt size={40} style={{ margin: '0 auto 0.75rem', color: '#9ca3af' }} />
          <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: '#111827' }}>No payment records found</h4>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>When you book a court, purchase gear, or renew membership, your digital receipts will appear here.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8faf9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
              My Payments Ledger ({payments.length})
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Click "View Receipt" to download or print official vouchers
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Receipt Reference</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Service Description</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Amount</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Payment Method</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0F5132' }}>
                      {p.paymentReference}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                      {formatDate(p.paymentDate)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>
                        {p.notes || p.sourceModule?.replace('_', ' ')}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                        {p.sourceModule}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0F5132', fontSize: '0.95rem' }}>
                      {formatCurrency(p.amount)}
                      {p.refundAmount > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>
                          Refunded: {formatCurrency(p.refundAmount)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#374151', fontWeight: 600 }}>
                      {p.paymentMethod}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
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
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => openReceipt(p)}
                        style={{
                          padding: '4px 10px',
                          backgroundColor: '#0F5132',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Receipt size={13} /> View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= DIGITAL RECEIPT MODAL ================= */}
      <Modal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} title="Official Club Receipt" maxWidth="580px">
        {selectedReceipt && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
            {/* Printable Voucher Card */}
            <div style={{
              border: '2px solid #0F5132',
              borderRadius: '12px',
              padding: '1.5rem',
              backgroundColor: '#ffffff',
            }}>
              {/* Receipt Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0F5132' }}>
                    CLUBSPHERE SPORTS CLUB
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                    Plot 12, Stadium Enclave, New Delhi 110001 | GSTIN: 07AAAAA0000A1Z5
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>
                    TAX INVOICE / RECEIPT
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                    {selectedReceipt.paymentReference}
                  </div>
                </div>
              </div>

              {/* Student & Payment Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Billed To:</span>
                  <div style={{ fontWeight: 800, color: '#111827' }}>{selectedReceipt.payerName}</div>
                  <div style={{ color: '#4b5563' }}>{selectedReceipt.payerEmail}</div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Transaction Details:</span>
                  <div style={{ fontWeight: 600, color: '#111827' }}>TXN: {selectedReceipt.transactionId}</div>
                  <div style={{ color: '#4b5563' }}>Date: {formatDate(selectedReceipt.paymentDate)}</div>
                  <div style={{ color: '#4b5563' }}>Method: {selectedReceipt.paymentMethod}</div>
                </div>
              </div>

              {/* Line Items */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #d1d5db', textAlign: 'left', color: '#374151' }}>
                    <th style={{ padding: '6px 8px' }}>Description</th>
                    <th style={{ padding: '6px 8px' }}>Category</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#111827' }}>
                      {selectedReceipt.notes || selectedReceipt.sourceModule}
                    </td>
                    <td style={{ padding: '8px', color: '#6b7280' }}>
                      {selectedReceipt.sourceModule?.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                      {formatCurrency(selectedReceipt.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#6b7280' }}>
                      Total Amount Paid:
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 900, color: '#0F5132', fontSize: '1.05rem' }}>
                      {formatCurrency(selectedReceipt.amount)}
                    </td>
                  </tr>
                  {selectedReceipt.refundAmount > 0 && (
                    <tr>
                      <td colSpan="2" style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 700, color: '#7c3aed' }}>
                        Refund Credited:
                      </td>
                      <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 800, color: '#7c3aed' }}>
                        - {formatCurrency(selectedReceipt.refundAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* QR Verification & Signature */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #d1d5db', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <QRCodeSVG value={`https://clubsphere.com/verify-receipt/${selectedReceipt.transactionId}`} size={60} />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block' }}>Scan to Verify Authenticity</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F5132' }}>Digitally Certified</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F5132' }}>
                    Status: {selectedReceipt.paymentStatus}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Authorized System Receipt</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsReceiptOpen(false)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0F5132',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Printer size={15} /> Print / Save Voucher
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default MyPaymentsPage;
