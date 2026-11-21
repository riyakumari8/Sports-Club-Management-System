import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { courtService } from '../../services/courtService';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Check,
  XCircle,
} from 'lucide-react';

export const AdminAllBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [msg, setMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const res = await courtService.getAllBookings(params);
      const list = Array.isArray(res) ? res : (res.data || []);
      setBookings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  const handleCheckIn = async (id) => {
    try {
      await courtService.checkInBookingById(id);
      setMsg('Member checked in successfully!');
      fetchBookings();
    } catch (err) {
      setMsg(err.message || 'Check-in failed');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Court Bookings Ledger" subtitle="Club-wide reservations">
        <Loader message="Loading reservations..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Court Bookings Ledger"
      subtitle="Comprehensive view of all club member and guest court reservations across all arenas"
    >
      {/* Filters Bar */}
      <div className="cs-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CHECKED_IN">CHECKED_IN</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              Booking Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
            />
          </div>

          <button
            onClick={() => { setStatusFilter(''); setDateFilter(''); }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '1.4rem' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {msg && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}>
          {msg}
        </div>
      )}

      {/* Bookings Table */}
      <div className="cs-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="cs-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.9rem 1.25rem' }}>Reference</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Court</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Player / Guest</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Schedule</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Amount</th>
              <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
              <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No bookings found for the selected criteria.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.bookingId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F5132' }}>
                    {b.bookingReference}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#111827' }}>
                    {b.court?.courtName || 'Arena'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{b.guestName || 'Member'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.guestEmail || '-'}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#4b5563', fontSize: '0.85rem' }}>
                    <div>📅 {b.bookingDate}</div>
                    <div>⏰ {b.startTime} - {b.endTime}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0F5132' }}>
                    ₹{b.finalAmount}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <Badge type={b.bookingStatus}>{b.bookingStatus}</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {b.bookingStatus === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCheckIn(b.bookingId)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={14} /> Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};
