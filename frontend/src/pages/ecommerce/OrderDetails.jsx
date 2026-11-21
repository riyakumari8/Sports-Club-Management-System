import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaReceipt, FaDownload, FaTruck, FaStore, FaClock, FaCheckCircle, FaFilePdf } from 'react-icons/fa';
import orderApi from '../../api/orderApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderDetails = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getOrderByNumber(orderNumber);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!order) return;
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(27, 94, 32); // ClubSphere dark green
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('ClubSphere Sports Club', 14, 18);
      doc.setFontSize(10);
      doc.text('Official Pro Shop & Sports Management Order Invoice', 14, 26);

      // Order Details
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text(`Order Number: ${order.orderNumber}`, 14, 46);
      doc.setFontSize(10);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 53);
      doc.text(`Customer Name: ${order.customerName}`, 14, 60);
      doc.text(`Contact: ${order.customerPhone} | ${order.customerEmail || 'N/A'}`, 14, 67);
      doc.text(`Order Type: ${order.orderType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pro Shop Pickup'}`, 14, 74);
      doc.text(`Delivery Address: ${order.deliveryAddress || 'Club Pro Shop Desk'}`, 14, 81);

      // Payment & Status
      doc.text(`Payment Method: ${order.paymentMethod} | Status: ${order.paymentStatus}`, 120, 46);
      doc.text(`Fulfillment Status: ${order.status}`, 120, 53);

      // Table of Items
      const tableData = (order.items || []).map((item, index) => [
        index + 1,
        item.productName,
        `Rs. ${Number(item.unitPrice).toFixed(2)}`,
        item.quantity,
        `Rs. ${Number(item.totalPrice).toFixed(2)}`,
      ]);

      doc.autoTable({
        startY: 90,
        head: [['#', 'Sports Product', 'Unit Price', 'Qty', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
      });

      const finalY = doc.lastAutoTable.finalY + 12;

      // Totals
      doc.setFontSize(11);
      doc.text(`Items Subtotal: Rs. ${Number(order.subtotal || order.totalAmount).toFixed(2)}`, 130, finalY);
      doc.text(`Delivery Fee: Rs. ${Number(order.deliveryFee || 0).toFixed(2)}`, 130, finalY + 7);
      doc.setFontSize(13);
      doc.setTextColor(27, 94, 32);
      doc.text(`Grand Total: Rs. ${Number(order.totalAmount).toFixed(2)}`, 130, finalY + 16);

      // Footer
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text('Thank you for shopping at ClubSphere Pro Shop! For returns, contact shop@clubsphere.local', 14, 280);

      doc.save(`ClubSphere-Order-${order.orderNumber}.pdf`);
      toast.success('PDF invoice generated and downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) return <LoadingSpinner message="Loading Order Information..." />;
  if (!order) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/customer/orders" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Back to My Orders
        </Link>
      </div>
    );
  }

  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', order.orderType === 'HOME_DELIVERY' ? 'SHIPPED' : 'READY_FOR_PICKUP', 'DELIVERED'];
  const currentStepIdx = steps.indexOf(order.status);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <FaArrowLeft /> Back
      </button>

      {/* Header Info */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order Tracking</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '2px 0 6px 0', color: 'var(--text-primary)' }}>
            Order #{order.orderNumber}
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StatusBadge status={order.status} />
          <button
            onClick={handleDownloadPdf}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <FaFilePdf /> Download Receipt
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 20px 0' }}>Fulfillment Status Timeline</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '12px' }}>
          {steps.map((st, idx) => {
            const isDone = currentStepIdx >= idx;
            const isCurrent = order.status === st;
            return (
              <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '100px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDone ? 'var(--primary-color)' : '#e2e8f0',
                  color: isDone ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                  border: isCurrent ? '3px solid #bbf7d0' : 'none',
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 500, color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>
                  {st.replace(/_/g, ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Purchased Items */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Purchased Products
          </h2>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.productName}</td>
                    <td>₹{Number(item.unitPrice).toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(item.totalPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>₹{Number(order.subtotal || order.totalAmount).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
              <span>₹{Number(order.deliveryFee || 0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
              <span>Total Paid</span>
              <span>₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Delivery Information
            </h2>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <div><strong>Method:</strong> {order.orderType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Club Pro Shop Pickup'}</div>
              <div><strong>Recipient:</strong> {order.customerName}</div>
              <div><strong>Phone:</strong> {order.customerPhone}</div>
              {order.customerEmail && <div><strong>Email:</strong> {order.customerEmail}</div>}
              <div><strong>Address / Station:</strong> {order.deliveryAddress || 'Club Desk'}</div>
              {order.specialInstructions && (
                <div style={{ marginTop: '6px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  Note: "{order.specialInstructions}"
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Payment Information
            </h2>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
              <div><strong>Payment Status:</strong> <StatusBadge status={order.paymentStatus} /></div>
              <div><strong>Pessimistic Concurrency Lock:</strong> Stock safely deducted from shared inventory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
