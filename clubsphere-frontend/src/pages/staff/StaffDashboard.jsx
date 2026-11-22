import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { staffDepartmentService } from '../../services/staffDepartmentService';
import { sportsShopStaffService } from '../../services/sportsShopStaffService';
import { foodShopStaffService } from '../../services/foodShopStaffService';
import {
  ShoppingBag,
  UtensilsCrossed,
  Boxes,
  Clock,
  CalendarCheck,
  CalendarX,
  CreditCard,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LifeBuoy,
  Users,
  Timer,
  Table,
} from 'lucide-react';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [clockMessage, setClockMessage] = useState(null);

  const fetchDashboard = async () => {
    try {
      const data = await staffDepartmentService.getStaffDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load staff department dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleClockIn = async () => {
    setClockLoading(true);
    setClockMessage(null);
    try {
      const res = await staffDepartmentService.clockIn();
      setClockMessage({ type: 'success', text: res.message || 'Clock-in recorded successfully!' });
      fetchDashboard();
    } catch (err) {
      setClockMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Clock-in failed' });
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    setClockMessage(null);
    try {
      const res = await staffDepartmentService.clockOut();
      setClockMessage({ type: 'success', text: res.message || 'Clock-out recorded successfully!' });
      fetchDashboard();
    } catch (err) {
      setClockMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Clock-out failed' });
    } finally {
      setClockLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Staff Portal" subtitle="Employee duty portal">
        <Loader message="Loading your department dashboard and active duties..." />
      </DashboardLayout>
    );
  }

  const deptCode = dashboardData?.departmentCode || 'GENERAL';
  const isSportsShop = deptCode === 'SPORTS_SHOP';
  const isFoodShop = deptCode === 'FOOD_SHOP';
  const metrics = dashboardData?.metrics || {};

  return (
    <DashboardLayout
      title={`Staff Portal: ${dashboardData?.fullName || user?.fullName || 'Staff Member'}`}
      subtitle={`Department: ${dashboardData?.departmentName || 'General Staff'} &bull; Official Duty Portal`}
    >
      {/* Clock Message Notification */}
      {clockMessage && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          background: clockMessage.type === 'success' ? '#d1e7dd' : '#f8d7da',
          color: clockMessage.type === 'success' ? '#0f5132' : '#842029',
          border: `1px solid ${clockMessage.type === 'success' ? '#badbcc' : '#f5c2c7'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {clockMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{clockMessage.text}</span>
          </div>
          <button
            onClick={() => setClockMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Official Staff Badge & Shift Banner */}
      <div style={{
        background: isSportsShop
          ? 'linear-gradient(135deg, #072a18 0%, #0F5132 60%, #1e3a8a 100%)'
          : isFoodShop
          ? 'linear-gradient(135deg, #3b1d06 0%, #78350f 60%, #0F5132 100%)'
          : 'linear-gradient(135deg, #072a18 0%, #0F5132 70%, #1f2937 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: isSportsShop ? '#86efac' : isFoodShop ? '#fde68a' : '#93c5fd',
              fontWeight: 800,
              letterSpacing: '0.08em',
            }}>
              OFFICIAL EMPLOYEE BADGE &bull; {deptCode.replace(/_/g, ' ')}
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', marginBottom: '4px' }}>
            {dashboardData?.fullName}
          </h2>

          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
            {dashboardData?.designation} &bull; <strong>{dashboardData?.departmentName}</strong>
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
            <div>Staff ID: <strong style={{ fontFamily: 'monospace', color: '#fef08a' }}>{dashboardData?.employeeCode}</strong></div>
            <div>Today's Shift: <strong>{dashboardData?.todayShift || 'General Day Shift'}</strong></div>
            <div>
              Attendance:{' '}
              <span style={{
                background: dashboardData?.attendanceStatus === 'PRESENT' ? '#10b981' : '#6b7280',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {dashboardData?.attendanceStatus || 'NOT_CHECKED_IN'}
              </span>
            </div>
            {dashboardData?.checkInTime && (
              <div>Punch In: <strong>{String(dashboardData.checkInTime).slice(0, 5)}</strong></div>
            )}
            {dashboardData?.checkOutTime && (
              <div>Punch Out: <strong>{String(dashboardData.checkOutTime).slice(0, 5)}</strong></div>
            )}
          </div>
        </div>

        {/* Real-time Clock-In / Clock-Out Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {dashboardData?.attendanceStatus !== 'PRESENT' ? (
            <button
              onClick={handleClockIn}
              disabled={clockLoading}
              className="btn btn-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}
            >
              <CalendarCheck size={18} />
              {clockLoading ? 'Recording...' : 'Punch In / Clock In'}
            </button>
          ) : !dashboardData?.checkOutTime ? (
            <button
              onClick={handleClockOut}
              disabled={clockLoading}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem', fontSize: '0.95rem', background: '#ffffff', color: '#1f2937' }}
            >
              <Clock size={18} />
              {clockLoading ? 'Recording...' : 'Punch Out / Clock Out'}
            </button>
          ) : (
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
              &check; Duty Completed Today
            </span>
          )}

          <Link to="/staff/support" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LifeBuoy size={16} /> Operational Support
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. SPORTS ACCESSORIES SHOP DASHBOARD VIEW                     */}
      {/* ============================================================== */}
      {isSportsShop && (
        <>
          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>New Orders</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                {metrics.newOrders || 0}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Needs staff acceptance</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>In Packing</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                {metrics.packingOrders || 0}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Being prepared</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Ready for Pickup</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {metrics.readyOrders || 0}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Waiting for customer</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Low Stock SKUs</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: (metrics.lowStockCount || 0) > 0 ? '#dc2626' : '#059669', marginTop: '4px' }}>
                {metrics.lowStockCount || 0}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Below reorder level</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Today's Sales</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F5132', marginTop: '4px' }}>
                ₹{Number(metrics.todaySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>All-Time: ₹{Number(metrics.allTimeSales || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Department Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Link to="/staff/sports-orders" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Sports Orders</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Accept & pack orders &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/sports-counter-sale" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>POS Counter Sale</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>In-store member checkout &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/sports-inventory" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Boxes size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Stock Inventory</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Restock & movements &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/sports-returns" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RotateCcw size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Returns Review</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Inspect & restock claims &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/sports-reports" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Sales Reports</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Revenue & throughput &rarr;</span>
              </div>
            </Link>
          </div>

          {/* Recent Orders & Low Stock Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(300px, 1.2fr)', gap: '1.5rem' }}>
            <div className="cs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                  Recent Equipment Orders
                </h3>
                <Link to="/staff/sports-orders" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600 }}>
                  View All &rarr;
                </Link>
              </div>

              <div className="cs-table-container">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.recentOrders || []).map((o) => (
                      <tr key={o.id}>
                        <td><strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{o.orderNumber}</strong></td>
                        <td>{o.customerName}</td>
                        <td>₹{Number(o.totalAmount).toLocaleString()}</td>
                        <td><Badge type={o.orderStatus}>{o.orderStatus.replace(/_/g, ' ')}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="cs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                  Low Stock Warnings
                </h3>
                <Link to="/staff/sports-inventory" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600 }}>
                  Manage Stock &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(dashboardData?.lowStockAlerts || []).map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>SKU: {p.sku}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.9rem' }}>
                        {p.stockQuantity} left
                      </span>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Min: {p.reorderLevel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 2. FOOD SHOP / CAFE DASHBOARD VIEW                             */}
      {/* ============================================================== */}
      {isFoodShop && (
        <>
          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Kitchen Queue</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                {metrics.pendingOrders || 0}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pending preparation</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Cooking Now</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                {metrics.preparingOrders || 0}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>In chef prep</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Ready to Serve</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {metrics.readyOrders || 0}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pickup station</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Table Occupancy</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>
                {metrics.occupiedTables || 0} / {metrics.totalTables || 8}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#059669' }}>{metrics.availableTables || 0} vacant tables</span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Today's Sales</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F5132', marginTop: '4px' }}>
                ₹{Number(metrics.todaySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Completed: {metrics.completedOrders || 0} orders</span>
            </div>
          </div>

          {/* Department Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Link to="/staff/food-orders" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Kitchen Display</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Live cooking queue &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/food-billing" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>POS Billing Counter</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Order & member billing &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/food-tables" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Table Management</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Floor occupancy & status &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/food-menu" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Menu & Availability</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>86 items & prep times &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/food-inventory" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Boxes size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Kitchen Inventory</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pantry & wastage logs &rarr;</span>
              </div>
            </Link>

            <Link to="/staff/food-reports" className="cs-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Timer size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Cafe & Prep Reports</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Cooking SLAs & sales &rarr;</span>
              </div>
            </Link>
          </div>

          {/* Active Kitchen Orders & Low Stock Pantry */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(300px, 1.2fr)', gap: '1.5rem' }}>
            <div className="cs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                  Live Kitchen Orders
                </h3>
                <Link to="/staff/food-orders" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600 }}>
                  Kitchen Display &rarr;
                </Link>
              </div>

              <div className="cs-table-container">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Table</th>
                      <th>Customer</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.recentOrders || []).map((o) => (
                      <tr key={o.id}>
                        <td><strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{o.orderNumber}</strong></td>
                        <td>{o.tableNumber ? `Table ${o.tableNumber}` : 'Counter'}</td>
                        <td>{o.customerName}</td>
                        <td><Badge type={o.orderStatus}>{o.orderStatus}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="cs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                  Low Stock Pantry Ingredients
                </h3>
                <Link to="/staff/food-inventory" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600 }}>
                  Restock Pantry &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(dashboardData?.lowStockIngredientsList || []).map((i) => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{i.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Min: {i.minStockThreshold} {i.unit}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.9rem' }}>
                        {i.currentStock} {i.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 3. GENERAL STAFF VIEW                                         */}
      {/* ============================================================== */}
      {!isSportsShop && !isFoodShop && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="cs-card">
            <h4 style={{ fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Daily Attendance</h4>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>Log punch in and check-out logs</p>
            <Link to="/staff/attendance" className="btn btn-primary btn-sm">Punch Log &rarr;</Link>
          </div>
          <div className="cs-card">
            <h4 style={{ fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Shift Schedules</h4>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>View assigned duty rosters</p>
            <Link to="/staff/shifts" className="btn btn-primary btn-sm">Duty Hours &rarr;</Link>
          </div>
          <div className="cs-card">
            <h4 style={{ fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Operational Support</h4>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>Raise requests to club admin</p>
            <Link to="/staff/support" className="btn btn-primary btn-sm">Open Ticket &rarr;</Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StaffDashboard;
