import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import {
  Bell,
  CheckCheck,
  Calendar,
  CreditCard,
  Sparkles,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';

export const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch unread count & notifications
  const loadNotifications = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      const payload = res?.data || res || {};
      const list = payload.notifications || (Array.isArray(payload) ? payload : []);
      const count = payload.unreadCount ?? (list.filter((n) => !n.isRead).length);
      setUnreadCount(count || 0);
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      // Ignored if user not authenticated or network error
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
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

  const getPrimaryRole = () => {
    if (user?.roles?.includes('ROLE_ADMIN')) return 'Admin';
    if (user?.roles?.includes('ROLE_STAFF')) return 'Staff';
    if (user?.roles?.includes('ROLE_MEMBER')) return 'Student Member';
    return 'User';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : name[0];
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'BOOKING':
        return <Calendar size={16} color="#0284c7" />;
      case 'MEMBERSHIP':
        return <CreditCard size={16} color="#D4AF37" />;
      case 'TRIAL':
        return <Sparkles size={16} color="#10b981" />;
      default:
        return <Info size={16} color="#6b7280" />;
    }
  };

  return (
    <header className="top-navbar" style={{ position: 'relative' }}>
      <div className="navbar-page-title">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="navbar-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Notification Bell Icon & Popover */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              position: 'relative',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#374151',
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
            }}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Floating Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '360px',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#f8faf9',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: '9999px' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0F5132',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderBottom: '1px solid #f3f4f6',
                        backgroundColor: item.isRead ? '#ffffff' : '#f0fdf4',
                        cursor: item.isRead ? 'default' : 'pointer',
                        transition: 'background-color 0.15s',
                        display: 'flex',
                        gap: '10px',
                      }}
                    >
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: item.isRead ? 600 : 800, color: '#111827' }}>
                            {item.title}
                          </span>
                          {!item.isRead && (
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0F5132', display: 'inline-block' }} />
                          )}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#4b5563', margin: '3px 0 0', lineHeight: 1.4 }}>
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#f8faf9',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
              }}>
                <Link
                  to="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#0F5132',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  View All Notifications <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Badge */}
        <div className="user-badge">
          <div className="user-avatar" style={{ backgroundColor: '#0F5132', color: '#ffffff', fontWeight: 800 }}>
            {getInitials(user?.fullName)}
          </div>
          <div className="user-info">
            <div className="name">{user?.fullName || 'User'}</div>
            <div className="role-tag" style={{ color: '#0F5132', fontWeight: 700 }}>{getPrimaryRole()}</div>
          </div>
        </div>

      </div>
    </header>
  );
};
