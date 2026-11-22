import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { sportsShopStaffService } from '../../services/sportsShopStaffService';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  PackageCheck,
  Truck,
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const SportsShopOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await sportsShopStaffService.getOrders({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch sports orders', err);
      setNotification({ type: 'error', message: err.message || 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusTransition = async (orderId, targetStatus) => {
    setActionLoading(true);
    try {
      await sportsShopStaffService.updateOrderStatus(orderId, targetStatus, `Status updated to ${targetStatus} by staff`);
      setNotification({ type: 'success', message: `Order #${orderId} progressed to ${targetStatus}` });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: targetStatus }));
      }
      fetchOrders();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Workflow transition failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const statusTabs = [
    { label: 'All Orders', value: '' },
    { label: 'New / Placed', value: 'NEW' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Packing', value: 'PACKING' },
    { label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' },
    { label: 'Dispatched', value: 'DISPATCHED' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  return (
    <DashboardLayout
      title="Sports Shop Orders Management"
      subtitle="Fulfill member and customer equipment orders with real-time status progression"
    >
      {/* Alert banner */}
      {notification && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: notification.type === 'success' ? '#d1e7dd' : '#f8d7da',
          color: notification.type === 'success' ? '#0f5132' : '#842029',
          border: `1px solid ${notification.type === 'success' ? '#badbcc' : '#f5c2c7'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="cs-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`btn btn-sm ${statusFilter === tab.value ? 'btn-primary' : 'btn-outline'}`}
                style={{ whiteSpace: 'nowrap', borderRadius: '20px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search order #, customer, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">
              Search
            </button>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setStatusFilter(''); fetchOrders(); }}
              className="btn btn-outline btn-sm"
              title="Reset Filters"
            >
              <RefreshCw size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="cs-card">
        {loading ? (
          <Loader message="Loading sports orders..." />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h4 style={{ fontWeight: 600 }}>No sports orders found</h4>
            <p style={{ fontSize: '0.9rem' }}>Try clearing your search or status filters.</p>
          </div>
        ) : (
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Tier & Discount</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong style={{ color: '#0F5132', fontFamily: 'monospace' }}>{o.orderNumber}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{o.customerPhone || o.customerEmail || '--'}</div>
                    </td>
                    <td>
                      {o.membershipTier && o.membershipTier !== 'NON_MEMBER' ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                          <Sparkles size={12} />
                          {o.membershipTier} ({o.membershipDiscountPercent}%)
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Standard</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>
                        {o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.95rem' }}>₹{Number(o.totalAmount || 0).toLocaleString()}</strong>
                      {Number(o.discountAmount || 0) > 0 && (
                        <div style={{ fontSize: '0.7rem', color: '#059669' }}>
                          Saved ₹{Number(o.discountAmount).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge type={o.paymentStatus}>{o.paymentStatus}</Badge>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{o.paymentMethod}</div>
                    </td>
                    <td>
                      <Badge type={o.orderStatus}>{o.orderStatus.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          title="View Order Details"
                        >
                          <Eye size={14} /> View
                        </button>

                        {/* Quick progression buttons */}
                        {o.orderStatus === 'NEW' && (
                          <button
                            onClick={() => handleStatusTransition(o.id, 'ACCEPTED')}
                            disabled={actionLoading}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Accept
                          </button>
                        )}

                        {o.orderStatus === 'ACCEPTED' && (
                          <button
                            onClick={() => handleStatusTransition(o.id, 'PACKING')}
                            disabled={actionLoading}
                            className="btn btn-gold btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Pack
                          </button>
                        )}

                        {o.orderStatus === 'PACKING' && (
                          <button
                            onClick={() => handleStatusTransition(o.id, 'READY_FOR_PICKUP')}
                            disabled={actionLoading}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Ready
                          </button>
                        )}

                        {o.orderStatus === 'READY_FOR_PICKUP' && (
                          <button
                            onClick={() => handleStatusTransition(o.id, 'COMPLETED')}
                            disabled={actionLoading}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#059669', borderColor: '#059669' }}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1f2937' }}>
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            {/* Customer & Fulfilment Meta */}
            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer</div>
                <strong>{selectedOrder.customerName}</strong>
                <div>{selectedOrder.customerPhone || '--'}</div>
                <div>{selectedOrder.customerEmail || '--'}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fulfilment Type</div>
                <strong>{selectedOrder.fulfilmentType || 'PICKUP'}</strong>
                <div style={{ marginTop: '4px' }}>
                  Status: <Badge type={selectedOrder.orderStatus}>{selectedOrder.orderStatus.replace(/_/g, ' ')}</Badge>
                </div>
              </div>
            </div>

            {/* Item list */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#374151' }}>
              Ordered Items
            </h4>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f3f4f6' }}>
                  <tr>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <strong>{item.productName || item.product?.name}</strong>
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{Number(item.unitPrice).toLocaleString()}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>₹{Number(item.totalPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', fontSize: '0.9rem', marginBottom: '1.5rem', borderTop: '1px dashed #d1d5db', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <span style={{ color: '#6b7280' }}>Subtotal:</span>
                <span>₹{Number(selectedOrder.subtotal || 0).toLocaleString()}</span>
              </div>
              {Number(selectedOrder.discountAmount || 0) > 0 && (
                <div style={{ display: 'flex', gap: '2rem', color: '#059669' }}>
                  <span>Membership Discount ({selectedOrder.membershipDiscountPercent}%):</span>
                  <span>-₹{Number(selectedOrder.discountAmount).toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '2rem', fontWeight: 800, fontSize: '1.1rem', color: '#0F5132', marginTop: '4px' }}>
                <span>Final Total:</span>
                <span>₹{Number(selectedOrder.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Workflow Action Bar inside Modal */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {selectedOrder.orderStatus === 'NEW' && (
                <button
                  onClick={() => handleStatusTransition(selectedOrder.id, 'ACCEPTED')}
                  disabled={actionLoading}
                  className="btn btn-primary"
                >
                  <CheckCircle size={16} /> Accept Order
                </button>
              )}
              {selectedOrder.orderStatus === 'ACCEPTED' && (
                <button
                  onClick={() => handleStatusTransition(selectedOrder.id, 'PACKING')}
                  disabled={actionLoading}
                  className="btn btn-gold"
                >
                  <PackageCheck size={16} /> Mark as Packing
                </button>
              )}
              {selectedOrder.orderStatus === 'PACKING' && (
                <button
                  onClick={() => handleStatusTransition(selectedOrder.id, 'READY_FOR_PICKUP')}
                  disabled={actionLoading}
                  className="btn btn-primary"
                >
                  <CheckCircle size={16} /> Ready for Customer Pickup
                </button>
              )}
              {selectedOrder.orderStatus === 'READY_FOR_PICKUP' && (
                <button
                  onClick={() => handleStatusTransition(selectedOrder.id, 'COMPLETED')}
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ background: '#059669' }}
                >
                  <CheckCircle size={16} /> Complete & Handed Over
                </button>
              )}
              {['NEW', 'ACCEPTED'].includes(selectedOrder.orderStatus) && (
                <button
                  onClick={() => handleStatusTransition(selectedOrder.id, 'CANCELLED')}
                  disabled={actionLoading}
                  className="btn btn-outline"
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  <XCircle size={16} /> Cancel Order
                </button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SportsShopOrdersPage;
