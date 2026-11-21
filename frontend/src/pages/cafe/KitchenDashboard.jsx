import React, { useState, useEffect } from 'react';
import { FaConciergeBell, FaClock, FaCheck, FaFire, FaSyncAlt } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      if (autoRefresh) fetchOrders(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await cafeApi.getAllOrders();
      const all = res.data || [];
      // Keep active kitchen tickets
      const kitchenTickets = all.filter(
        (o) => o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'READY'
      );
      setOrders(kitchenTickets);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await cafeApi.updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} marked as ${newStatus}`);
      fetchOrders(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update kitchen status');
    }
  };

  if (loading) return <LoadingSpinner message="Connecting to Kitchen Order Display (KDS)..." />;

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* KDS Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaConciergeBell style={{ color: 'var(--primary-accent)' }} /> Kitchen Order Display (KDS)
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Real-time kitchen ticket queue for chefs and baristas.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => fetchOrders(true)}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <FaSyncAlt /> Refresh Now
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (10s)
          </label>
        </div>
      </div>

      {/* 3 Column KDS Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Column 1: Pending (New Orders) */}
        <div style={{ backgroundColor: '#fffbeb', borderRadius: 'var(--radius-lg)', padding: '16px', border: '2px solid #fef3c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #fde68a', paddingBottom: '8px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#92400e', margin: 0 }}>
              PENDING ({pendingOrders.length})
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '12px', color: '#92400e' }}>
              Just Received
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pendingOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#b45309', fontSize: '0.85rem' }}>
                No new pending tickets.
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div key={order.id} className="card" style={{ padding: '16px', borderLeft: '5px solid var(--warning-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>#{order.orderNumber || order.id}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '0.85rem' }}>
                      {order.orderType === 'DINE_IN' ? `Table ${order.tableNumber}` : 'Takeaway'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaClock /> Placed: {new Date(order.createdAt).toLocaleTimeString()}
                  </div>

                  {/* Items list */}
                  <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '8px 0', marginBottom: '10px' }}>
                    {(order.items || []).map((i) => (
                      <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{i.menuItemName}</span>
                        <span style={{ fontWeight: 800, backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>x{i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div style={{ backgroundColor: '#fff7ed', border: '1px dashed #fdba74', padding: '6px 10px', borderRadius: '4px', fontSize: '0.78rem', color: '#c2410c', marginBottom: '12px', fontWeight: 600 }}>
                      Note: {order.specialInstructions}
                    </div>
                  )}

                  <button
                    onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                    className="btn btn-warning"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem' }}
                  >
                    <FaFire /> Start Preparing
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div style={{ backgroundColor: '#eff6ff', borderRadius: 'var(--radius-lg)', padding: '16px', border: '2px solid #dbeafe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #bfdbfe', paddingBottom: '8px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>
              PREPARING ({preparingOrders.length})
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '12px', color: '#1e40af' }}>
              Cooking
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {preparingOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#3b82f6', fontSize: '0.85rem' }}>
                No dishes currently in preparation.
              </div>
            ) : (
              preparingOrders.map((order) => (
                <div key={order.id} className="card" style={{ padding: '16px', borderLeft: '5px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>#{order.orderNumber || order.id}</span>
                    <span style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.85rem' }}>
                      {order.orderType === 'DINE_IN' ? `Table ${order.tableNumber}` : 'Takeaway'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaClock /> Cooking since: {new Date(order.createdAt).toLocaleTimeString()}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '8px 0', marginBottom: '10px' }}>
                    {(order.items || []).map((i) => (
                      <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{i.menuItemName}</span>
                        <span style={{ fontWeight: 800, backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>x{i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div style={{ backgroundColor: '#fff7ed', border: '1px dashed #fdba74', padding: '6px 10px', borderRadius: '4px', fontSize: '0.78rem', color: '#c2410c', marginBottom: '12px', fontWeight: 600 }}>
                      Note: {order.specialInstructions}
                    </div>
                  )}

                  <button
                    onClick={() => handleUpdateStatus(order.id, 'READY')}
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', backgroundColor: '#2563eb' }}
                  >
                    <FaCheck /> Mark Order Ready
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Pickup / Serving */}
        <div style={{ backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-lg)', padding: '16px', border: '2px solid #bbf7d0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #86efac', paddingBottom: '8px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: 0 }}>
              READY TO SERVE ({readyOrders.length})
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#bbf7d0', padding: '2px 8px', borderRadius: '12px', color: '#166534' }}>
              Pickup Desk
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {readyOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#16a34a', fontSize: '0.85rem' }}>
                No orders waiting for server dispatch.
              </div>
            ) : (
              readyOrders.map((order) => (
                <div key={order.id} className="card" style={{ padding: '16px', borderLeft: '5px solid var(--success-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>#{order.orderNumber || order.id}</span>
                    <span style={{ fontWeight: 700, color: 'var(--success-color)', fontSize: '0.85rem' }}>
                      {order.orderType === 'DINE_IN' ? `Table ${order.tableNumber}` : 'Takeaway'}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '8px 0', marginBottom: '12px' }}>
                    {(order.items || []).map((i) => (
                      <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{i.menuItemName}</span>
                        <span style={{ fontWeight: 800 }}>x{i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                      className="btn btn-primary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, fontSize: '0.82rem' }}
                    >
                      <FaCheck /> Mark Served
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
