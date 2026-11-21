import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaList, FaFilter, FaEye, FaEdit, FaCheck } from 'react-icons/fa';
import orderApi from '../../api/orderApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} marked as ${newStatus}`);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = !statusFilter || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (loading) return <LoadingSpinner message="Loading Admin Orders..." />;

  const statusOptions = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'READY_FOR_PICKUP',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>E-Commerce & Orders Administration</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Process member sports orders, update delivery or pickup statuses, and track payment receipts.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search by order number, customer name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ width: '220px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
          >
            <option value="">All Fulfillment Statuses</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ width: '200px' }}>Update Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link to={`/customer/orders/${o.orderNumber}`} style={{ fontWeight: 700, color: 'var(--primary-color)', textDecoration: 'none' }}>
                        {o.orderNumber}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{o.customerPhone}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {o.orderType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pro Shop Pickup'}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                      ₹{Number(o.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={o.paymentStatus} />
                    </td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        disabled={updatingId === o.id || o.status === 'DELIVERED' || o.status === 'CANCELLED'}
                        className="form-control"
                        style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Link
                        to={`/customer/orders/${o.orderNumber}`}
                        className="btn btn-outline"
                        style={{ padding: '5px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        <FaEye /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;
