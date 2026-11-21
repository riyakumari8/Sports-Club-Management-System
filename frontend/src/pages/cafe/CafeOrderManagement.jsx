import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaList, FaReceipt, FaPlus, FaEye } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';

const CafeOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await cafeApi.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cafe orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await cafeApi.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = !statusFilter || o.status === statusFilter;
    const matchesType = !typeFilter || o.orderType === typeFilter;
    return matchesStatus && matchesType;
  });

  if (loading) return <LoadingSpinner message="Loading Cafe Orders..." />;

  const statuses = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>All Cafe & Bar Orders</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Complete order pipeline across dine-in table tickets and takeaway counter pickups.
          </p>
        </div>
        <Link to="/cafe/orders/place" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <FaPlus /> Place Order
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        <div style={{ width: '220px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
          >
            <option value="">All Order Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: '200px' }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-control"
          >
            <option value="">All Order Types</option>
            <option value="DINE_IN">Dine-In Table</option>
            <option value="TAKEAWAY">Takeaway Counter</option>
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
                <th>Type / Table</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total Bill</th>
                <th>Status</th>
                <th style={{ width: '180px' }}>Update Status</th>
                <th>Billing</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                    No cafe orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700 }}>#{o.orderNumber || o.id}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>
                        {o.orderType === 'DINE_IN' ? `Table ${o.tableNumber}` : 'Takeaway'}
                      </span>
                    </td>
                    <td>{o.customerName || 'Guest'}</td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        {(o.items || []).map((i) => `${i.menuItemName} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                      ₹{Number(o.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        disabled={o.status === 'COMPLETED' || o.status === 'CANCELLED'}
                        className="form-control"
                        style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Link
                        to={`/cafe/billing?orderId=${o.id}`}
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        <FaReceipt /> Bill
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

export default CafeOrderManagement;
