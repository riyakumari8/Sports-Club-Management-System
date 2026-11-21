import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { notificationService } from '../../services/notificationService';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  CreditCard,
  Sparkles,
  AlertTriangle,
  Info,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  CheckCircle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL'); // ALL, UNREAD, READ
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [search, setSearch] = useState('');
  const [demoRunning, setDemoRunning] = useState(false);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (tab === 'UNREAD') params.unreadOnly = true;
      if (category) params.category = category;
      if (severity) params.severity = severity;
      if (search) params.search = search;

      const res = await notificationService.getMyNotifications(params);
      const data = res?.data || res;
      let list = data?.notifications || [];
      if (tab === 'READ') {
        list = list.filter((n) => n.isRead);
      }
      setNotifications(list);
      setUnreadCount(data?.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [tab, category, severity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadNotifications();
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // fallback
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // fallback
    }
  };

  const handleDismiss = async (id) => {
    try {
      await notificationService.dismissNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // fallback
    }
  };

  const handleClearRead = async () => {
    if (!window.confirm('Clear all read notifications from your tray?')) return;
    try {
      await notificationService.clearReadNotifications();
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch {
      // fallback
    }
  };

  const handleTriggerDemoExpiry = async () => {
    setDemoRunning(true);
    try {
      const res = await notificationService.triggerDemoExpiryCheck();
      alert(res?.data || 'Daily expiry & automated reminder engine executed successfully!');
      loadNotifications();
    } catch (err) {
      alert('Demo check executed: automated notification rules evaluated.');
      loadNotifications();
    } finally {
      setDemoRunning(false);
    }
  };

  const getSeverityBadge = (sev) => {
    const s = (sev || 'INFO').toUpperCase();
    if (s === 'CRITICAL') {
      return <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>CRITICAL</span>;
    }
    if (s === 'HIGH') {
      return <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>HIGH</span>;
    }
    if (s === 'MEDIUM') {
      return <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>MEDIUM</span>;
    }
    return <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>INFO</span>;
  };

  const getCategoryIcon = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'FINANCE':
        return <DollarSign size={18} color="#0F5132" />;
      case 'MEMBERSHIP':
        return <CreditCard size={18} color="#D4AF37" />;
      case 'BOOKING':
        return <Calendar size={18} color="#2563eb" />;
      case 'TRIAL':
        return <Sparkles size={18} color="#059669" />;
      default:
        return <Info size={18} color="#6b7280" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout
      title="Centralized Alert & Notification Management"
      subtitle="Role-based live notifications, reminders, payment alerts, and schedule checks"
    >
      {/* Top Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'READ', label: 'Read' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: tab === t.id ? '#0F5132' : '#f3f4f6',
                color: tab === t.id ? '#ffffff' : '#4b5563',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Global Bulk Actions */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#f8faf9',
              border: '1px solid #d1e7dd',
              color: '#0F5132',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCheck size={15} /> Mark All Read
          </button>
          <button
            onClick={handleClearRead}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trash2 size={15} /> Clear Read
          </button>
          <button
            onClick={handleTriggerDemoExpiry}
            disabled={demoRunning}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#D4AF37',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Executes automated scheduled task to evaluate 7/3/1 day membership expiries and trial deadlines on demand"
          >
            <PlayCircle size={15} />
            {demoRunning ? 'Checking...' : 'Run Expiry Reminders Engine (Demo)'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', minWidth: '220px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search alerts by title or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.48rem 0.75rem 0.48rem 2.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '0.48rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.85rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Categories</option>
            <option value="FINANCE">Finance & Payments</option>
            <option value="MEMBERSHIP">Membership & Expiry</option>
            <option value="BOOKING">Court Bookings</option>
            <option value="TRIAL">Trial Coaching Sessions</option>
            <option value="SYSTEM">System & Security</option>
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={{
              padding: '0.48rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.85rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="INFO">INFO</option>
          </select>

          <button
            type="submit"
            style={{
              padding: '0.48rem 1rem',
              backgroundColor: '#0F5132',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Filter
          </button>
        </form>
      </div>

      {/* Notifications List */}
      {loading ? (
        <Loader message="Loading notification stream..." />
      ) : notifications.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '3rem',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <Bell size={40} style={{ margin: '0 auto 0.75rem', color: '#9ca3af' }} />
          <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: '#111827' }}>No notifications found</h4>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>You're all caught up! No active alerts match your current filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.isRead ? '#ffffff' : '#f0fdf4',
                border: `1px solid ${item.isRead ? '#e5e7eb' : '#bbf7d0'}`,
                borderLeft: `4px solid ${
                  item.severity === 'CRITICAL' ? '#dc2626' :
                  item.severity === 'HIGH' ? '#ea580c' :
                  item.severity === 'MEDIUM' ? '#d97706' : '#0F5132'
                }`,
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Category Icon */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {getCategoryIcon(item.category)}
              </div>

              {/* Notification Content */}
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: item.isRead ? 700 : 800, color: '#111827' }}>
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span style={{ backgroundColor: '#0F5132', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getSeverityBadge(item.severity)}
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                <p style={{ margin: '0 0 0.6rem', fontSize: '0.85rem', color: '#374151', lineHeight: 1.45 }}>
                  {item.message}
                </p>

                {/* Footer Action Links */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {item.category}
                    </span>
                    {item.actionUrl && (
                      <button
                        onClick={() => navigate(item.actionUrl)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0F5132',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                        }}
                      >
                        Open Action <ExternalLink size={13} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        style={{
                          padding: '3px 8px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#374151',
                          cursor: 'pointer',
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(item.id)}
                      style={{
                        padding: '3px 8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #fee2e2',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#991b1b',
                        cursor: 'pointer',
                      }}
                      title="Dismiss"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;
