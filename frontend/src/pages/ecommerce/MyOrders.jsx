import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaReceipt, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import orderApi from '../../api/orderApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const memberId = 1;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getMemberOrders(memberId);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Your Orders..." />;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>My Sports Orders</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Track order fulfillment status, pickup notifications, and download receipts.
          </p>
        </div>
        <Link to="/customer/shop" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <FaShoppingBag /> Pro Shop Store
        </Link>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '28px' }}>
              <FaReceipt />
            </div>
            <h3 style={{ margin: '0 0 8px 0' }}>No orders placed yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your sports gear orders will appear here for tracking and receipt downloads.
            </p>
            <Link to="/customer/shop" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Fulfillment Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link to={`/customer/orders/${o.orderNumber}`} style={{ fontWeight: 700, color: 'var(--primary-color)', textDecoration: 'none' }}>
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {o.orderType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pro Shop Pickup'}
                    </td>
                    <td>{o.items?.length || 1} items</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                      ₹{Number(o.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td>
                      <StatusBadge status={o.paymentStatus} />
                    </td>
                    <td>
                      <Link
                        to={`/customer/orders/${o.orderNumber}`}
                        className="btn btn-outline"
                        style={{ padding: '5px 10px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        Track <FaArrowRight size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
