import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { foodShopStaffService } from '../../services/foodShopStaffService';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle,
  Flame,
  BellRing,
  Coffee,
  AlertCircle,
  RefreshCw,
  Search,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const FoodOrdersKitchenPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await foodShopStaffService.getOrders({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load kitchen orders', err);
      setNotification({ type: 'error', message: err.message || 'Failed to fetch food orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusTransition = async (orderId, targetStatus) => {
    setActionLoading(true);
    try {
      await foodShopStaffService.updateOrderStatus(orderId, targetStatus);
      setNotification({
        type: 'success',
        message: `Order transitioned to ${targetStatus}! ${targetStatus === 'COMPLETED' ? 'Table status updated to CLEANING.' : ''}`,
      });
      fetchOrders();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || err.message || 'Workflow transition failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const statusTabs = [
    { label: 'All Orders', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Cooking / Preparing', value: 'PREPARING' },
    { label: 'Ready for Pickup', value: 'READY' },
    { label: 'Served / Completed', value: 'COMPLETED' },
  ];

  return (
    <DashboardLayout
      title="Cafe Kitchen Display & Orders Queue"
      subtitle="Live kitchen preparation workflow: Pending &rarr; Accepted &rarr; Preparing &rarr; Ready &rarr; Served"
    >
      {notification && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          background: notification.type === 'success' ? '#d1e7dd' : '#f8d7da',
          color: notification.type === 'success' ? '#0f5132' : '#842029',
          border: `1px solid ${notification.type === 'success' ? '#badbcc' : '#f5c2c7'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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

          <div style={{ display: 'flex', gap: '0.5rem', minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search order #, customer, table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
              />
            </div>
            <button
              onClick={fetchOrders}
              className="btn btn-secondary btn-sm"
              title="Refresh Queue"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Live Orders Display Grid */}
      {loading ? (
        <Loader message="Loading live kitchen orders..." />
      ) : orders.length === 0 ? (
        <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
          <UtensilsCrossed size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h4 style={{ fontWeight: 600 }}>Kitchen queue is all caught up!</h4>
          <p style={{ fontSize: '0.85rem' }}>No orders matching the selected filter.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {orders.map((o) => {
            const isPending = o.orderStatus === 'PENDING';
            const isCooking = o.orderStatus === 'PREPARING';
            const isReady = o.orderStatus === 'READY';
            const isCompleted = o.orderStatus === 'COMPLETED';

            const cardBorderColor = isPending
              ? '#f59e0b'
              : isCooking
              ? '#ef4444'
              : isReady
              ? '#10b981'
              : '#e5e7eb';

            return (
              <div
                key={o.id}
                className="cs-card"
                style={{
                  borderTop: `4px solid ${cardBorderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Order Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: '#1f2937' }}>
                        {o.orderNumber}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {o.customerName}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {o.tableNumber ? (
                        <span style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}>
                          Table {o.tableNumber}
                        </span>
                      ) : (
                        <span style={{
                          background: '#f3f4f6',
                          color: '#4b5563',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          {o.orderType || 'Counter'}
                        </span>
                      )}
                      <div style={{ marginTop: '4px' }}>
                        <Badge type={o.orderStatus}>{o.orderStatus}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions Alert */}
                  {o.specialInstructions && (
                    <div style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '0.8rem',
                      color: '#92400e',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <MessageSquare size={14} />
                      <strong>Note:</strong> {o.specialInstructions}
                    </div>
                  )}

                  {/* Items List */}
                  <div style={{ borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '8px 0', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Items to Prepare
                    </div>
                    {(o.items || []).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '4px 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '22px',
                            height: '22px',
                            borderRadius: '4px',
                            background: '#f3f4f6',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                          }}>
                            {item.quantity}x
                          </span>
                          <span style={{ fontWeight: 600 }}>{item.itemName}</span>
                        </div>
                        {item.specialNote && (
                          <span style={{ fontSize: '0.75rem', color: '#b45309', fontStyle: 'italic' }}>
                            ({item.specialNote})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Financial Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <span style={{ color: '#6b7280' }}>Total Paid:</span>
                    <strong style={{ fontSize: '1rem', color: '#0F5132' }}>₹{Number(o.totalAmount || 0).toLocaleString()}</strong>
                  </div>
                </div>

                {/* Workflow Action Buttons */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
                  {isPending && (
                    <button
                      onClick={() => handleStatusTransition(o.id, 'ACCEPTED')}
                      disabled={actionLoading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                    >
                      <CheckCircle size={16} /> Accept Order
                    </button>
                  )}

                  {o.orderStatus === 'ACCEPTED' && (
                    <button
                      onClick={() => handleStatusTransition(o.id, 'PREPARING')}
                      disabled={actionLoading}
                      className="btn btn-gold"
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                    >
                      <Flame size={16} /> Send to Kitchen (Cooking)
                    </button>
                  )}

                  {isCooking && (
                    <button
                      onClick={() => handleStatusTransition(o.id, 'READY')}
                      disabled={actionLoading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem', background: '#059669', borderColor: '#059669' }}
                    >
                      <BellRing size={16} /> Mark Ready to Serve
                    </button>
                  )}

                  {isReady && (
                    <button
                      onClick={() => handleStatusTransition(o.id, 'COMPLETED')}
                      disabled={actionLoading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem', background: '#0F5132' }}
                    >
                      <CheckCircle size={16} /> Served & Complete Order
                    </button>
                  )}

                  {isCompleted && (
                    <div style={{ textAlign: 'center', color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>
                      &check; Order fulfilled & completed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default FoodOrdersKitchenPage;
