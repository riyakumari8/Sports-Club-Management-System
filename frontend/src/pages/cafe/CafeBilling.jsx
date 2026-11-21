import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaReceipt, FaMoneyBillWave, FaUsers, FaPrint, FaArrowLeft, FaCheckCircle, FaFilePdf } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CafeBilling = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(orderId || '');

  // Split bill state
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [numPeople, setNumPeople] = useState(2);
  const [splits, setSplits] = useState([]);
  const [singlePaymentMethod, setSinglePaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (selectedOrderId) {
      loadOrderDetails(selectedOrderId);
    }
  }, [selectedOrderId]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await cafeApi.getAllOrders();
      const list = res.data || [];
      setAllOrders(list);
      if (!selectedOrderId && list.length > 0) {
        setSelectedOrderId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (id) => {
    try {
      const res = await cafeApi.getOrderById(id);
      const ord = res.data;
      setOrder(ord);

      // Initialize default 2-way equal split
      const total = Number(ord.totalAmount) || 0;
      const equalShare = (total / 2).toFixed(2);
      setSplits([
        { personName: 'Person 1', amount: equalShare, paymentMethod: 'UPI' },
        { personName: 'Person 2', amount: (total - parseFloat(equalShare)).toFixed(2), paymentMethod: 'CASH' },
      ]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load order billing details');
    }
  };

  const handleNumPeopleChange = (count) => {
    setNumPeople(count);
    if (!order) return;
    const total = Number(order.totalAmount) || 0;
    const share = (total / count).toFixed(2);
    const newSplits = [];
    let allocated = 0;

    for (let i = 1; i <= count; i++) {
      const amt = i === count ? (total - allocated).toFixed(2) : share;
      allocated += parseFloat(amt);
      newSplits.push({
        personName: `Person ${i}`,
        amount: amt,
        paymentMethod: 'UPI',
      });
    }
    setSplits(newSplits);
  };

  const handleSplitChange = (index, field, value) => {
    const updated = [...splits];
    updated[index][field] = value;
    setSplits(updated);
  };

  const totalSplitAllocated = splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
  const remainingBalance = order ? (Number(order.totalAmount) - totalSplitAllocated).toFixed(2) : 0;

  const handleSinglePayment = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      await cafeApi.recordPayment({
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod: singlePaymentMethod,
        isSplit: false,
      });

      toast.success('Full payment recorded successfully!');
      loadOrderDetails(order.id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSplitPaymentSubmit = async () => {
    if (!order) return;
    if (Math.abs(parseFloat(remainingBalance)) > 0.5) {
      toast.error(`Allocated total (₹${totalSplitAllocated.toFixed(2)}) must exactly equal bill amount (₹${Number(order.totalAmount).toFixed(2)})`);
      return;
    }

    setSubmitting(true);
    try {
      await cafeApi.recordSplitBill({
        orderId: order.id,
        splits: splits.map((s) => ({
          personName: s.personName,
          amount: parseFloat(s.amount),
          paymentMethod: s.paymentMethod,
        })),
      });

      toast.success('Split bill payment recorded successfully!');
      loadOrderDetails(order.id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to record split payments');
    } finally {
      setSubmitting(false);
    }
  };

  const printBillPdf = () => {
    if (!order) return;
    try {
      const doc = new jsPDF();
      doc.setFillColor(27, 94, 32);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('ClubSphere Sports Cafe & Bar', 14, 18);
      doc.setFontSize(9);
      doc.text('Guest Dining & Refreshment Bill Receipt', 14, 25);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.text(`Bill / Order #: ${order.orderNumber || order.id}`, 14, 42);
      doc.text(`Type: ${order.orderType === 'DINE_IN' ? `Dine-In Table ${order.tableNumber}` : 'Takeaway'}`, 14, 48);
      doc.text(`Guest Name: ${order.customerName || 'Club Guest'}`, 14, 54);
      doc.text(`Date & Time: ${new Date(order.createdAt).toLocaleString()}`, 14, 60);

      const tableData = (order.items || []).map((i, idx) => [
        idx + 1,
        i.menuItemName,
        `Rs. ${Number(i.unitPrice).toFixed(2)}`,
        i.quantity,
        `Rs. ${Number(i.totalPrice).toFixed(2)}`,
      ]);

      doc.autoTable({
        startY: 68,
        head: [['#', 'Item', 'Rate', 'Qty', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Subtotal: Rs. ${Number(order.totalAmount).toFixed(2)}`, 130, finalY);
      doc.setFontSize(14);
      doc.setTextColor(27, 94, 32);
      doc.text(`Total Bill: Rs. ${Number(order.totalAmount).toFixed(2)}`, 130, finalY + 8);

      doc.save(`CafeBill-${order.orderNumber || order.id}.pdf`);
      toast.success('PDF Bill downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) return <LoadingSpinner message="Loading Billing Console..." />;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaReceipt style={{ color: 'var(--primary-color)' }} /> Cafe Billing & Split Bills
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Generate dining receipts, process multi-payer bill splits, and close table tabs.
          </p>
        </div>

        {order && (
          <button
            onClick={printBillPdf}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaFilePdf /> Print / Save PDF Bill
          </button>
        )}
      </div>

      {/* Select Order Dropdown */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Select Cafe Order:</label>
        <select
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="form-control"
          style={{ maxWidth: '340px' }}
        >
          {allOrders.map((o) => (
            <option key={o.id} value={o.id}>
              #{o.orderNumber || o.id} - {o.orderType === 'DINE_IN' ? `Table ${o.tableNumber}` : 'Takeaway'} (₹{Number(o.totalAmount).toFixed(2)}) [{o.status}]
            </option>
          ))}
        </select>
      </div>

      {order && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Bill Summary */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Order #{order.orderNumber || order.id}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {order.orderType === 'DINE_IN' ? `Table ${order.tableNumber}` : 'Takeaway'} • {order.customerName}
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="table-responsive" style={{ marginBottom: '16px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((i) => (
                    <tr key={i.id}>
                      <td style={{ fontWeight: 600 }}>{i.menuItemName}</td>
                      <td>₹{Number(i.unitPrice).toFixed(2)}</td>
                      <td>{i.quantity}</td>
                      <td style={{ fontWeight: 700 }}>₹{Number(i.totalPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Bill Grand Total</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                ₹{Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Mode: Single vs Split */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setIsSplitMode(false)}
                className={`btn ${!isSplitMode ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontWeight: 700 }}
              >
                Single Payer
              </button>
              <button
                type="button"
                onClick={() => setIsSplitMode(true)}
                className={`btn ${isSplitMode ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <FaUsers /> Split Bill
              </button>
            </div>

            {!isSplitMode ? (
              /* Single Payer Payment */
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Select Payment Mode</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                    {['UPI', 'CASH', 'CREDIT_CARD', 'MEMBER_TAB'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setSinglePaymentMethod(m)}
                        className={`btn ${singlePaymentMethod === m ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '8px', fontSize: '0.82rem' }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSinglePayment}
                  disabled={submitting || order.status === 'COMPLETED'}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <FaMoneyBillWave /> {submitting ? 'Recording Payment...' : `Record Full Payment (₹${Number(order.totalAmount).toFixed(2)})`}
                </button>
              </div>
            ) : (
              /* Split Bill Multi-Payer */
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Split Between How Many People?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[2, 3, 4, 5].map((cnt) => (
                      <button
                        type="button"
                        key={cnt}
                        onClick={() => handleNumPeopleChange(cnt)}
                        className={`btn ${numPeople === cnt ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1, padding: '6px', fontWeight: 700 }}
                      >
                        {cnt} People
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
                  {splits.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={s.personName}
                        onChange={(e) => handleSplitChange(idx, 'personName', e.target.value)}
                        className="form-control"
                        style={{ flex: 1, fontSize: '0.85rem' }}
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={s.amount}
                        onChange={(e) => handleSplitChange(idx, 'amount', e.target.value)}
                        className="form-control"
                        style={{ width: '100px', fontSize: '0.85rem', fontWeight: 700 }}
                        placeholder="Amount"
                      />
                      <select
                        value={s.paymentMethod}
                        onChange={(e) => handleSplitChange(idx, 'paymentMethod', e.target.value)}
                        className="form-control"
                        style={{ width: '90px', fontSize: '0.82rem' }}
                      >
                        <option value="UPI">UPI</option>
                        <option value="CASH">CASH</option>
                        <option value="CREDIT_CARD">CARD</option>
                      </select>
                    </div>
                  ))}
                </div>

                {/* Remaining Balance Tracker */}
                <div style={{ backgroundColor: Math.abs(parseFloat(remainingBalance)) < 0.01 ? '#e8f5e9' : '#fffbeb', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Allocated: <strong>₹{totalSplitAllocated.toFixed(2)}</strong></span>
                  <span style={{ fontWeight: 700, color: Math.abs(parseFloat(remainingBalance)) < 0.01 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    Remaining: ₹{remainingBalance}
                  </span>
                </div>

                <button
                  onClick={handleSplitPaymentSubmit}
                  disabled={submitting || Math.abs(parseFloat(remainingBalance)) > 0.5}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }}
                >
                  Confirm Split Bill Payments
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeBilling;
