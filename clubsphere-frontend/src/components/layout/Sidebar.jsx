import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Layers,
  UserCheck,
  CalendarCheck,
  CalendarX,
  Clock,
  DollarSign,
  QrCode,
  Sparkles,
  LogOut,
  Shield,
  Briefcase,
  User,
  Share2,
  Dumbbell,
  Calendar,
  MessageSquare,
  TrendingDown,
  FileText,
  ShieldCheck,
  Bell,
  Receipt,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAdmin, isStaff, isMember, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Shield size={22} />
        </div>
        <div className="brand-text">
          <h1>ClubSphere</h1>
          <span>Sports Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* ================= ADMIN NAVIGATION ================= */}
        {isAdmin && (
          <>
            <div className="nav-section-title">Administration</div>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> User Management
            </NavLink>

            <div className="nav-section-title">Membership Module</div>
            <NavLink to="/admin/memberships" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CreditCard size={18} /> Memberships
            </NavLink>
            <NavLink to="/admin/plans" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Layers size={18} /> Membership Plans
            </NavLink>

            <div className="nav-section-title">Staff Management</div>
            <NavLink to="/admin/staff" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} /> Staff Directory
            </NavLink>
            <NavLink to="/admin/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Daily Attendance
            </NavLink>
            <NavLink to="/admin/leaves" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CalendarX size={18} /> Leave Approvals
            </NavLink>
            <NavLink to="/admin/shifts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Clock size={18} /> Shift Schedules
            </NavLink>
            <NavLink to="/admin/salary" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <DollarSign size={18} /> Salary Records
            </NavLink>

            <div className="nav-section-title">Court & Operations</div>
            <NavLink to="/admin/courts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Dumbbell size={18} /> Court Management
            </NavLink>
            <NavLink to="/admin/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> All Bookings
            </NavLink>
            <NavLink to="/admin/check-in" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <QrCode size={18} /> Front Desk Check-In
            </NavLink>
            <NavLink to="/admin/enquiries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} /> Enquiry CRM
            </NavLink>

            <div className="nav-section-title">Integration Hub</div>
            <NavLink to="/admin/integration-demo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Share2 size={18} /> Team Integrations
            </NavLink>

            <div className="nav-section-title">Finance & Accounts</div>
            <NavLink to="/admin/finance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <DollarSign size={18} /> Finance Dashboard
            </NavLink>
            <NavLink to="/admin/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CreditCard size={18} /> Payment Tracking
            </NavLink>
            <NavLink to="/admin/expenses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <TrendingDown size={18} /> Operating Expenses
            </NavLink>
            <NavLink to="/admin/finance-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} /> 12 Financial Reports
            </NavLink>
            <NavLink to="/admin/reconciliation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={18} /> Reconciliation
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Notification Hub
            </NavLink>
          </>
        )}

        {/* ================= STAFF NAVIGATION ================= */}
        {isStaff && !isAdmin && (
          <>
            <div className="nav-section-title">Staff Portal</div>
            <NavLink to="/staff/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Staff Dashboard
            </NavLink>
            <NavLink to="/staff/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile
            </NavLink>
            <NavLink to="/staff/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> My Attendance
            </NavLink>
            <NavLink to="/staff/leaves" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CalendarX size={18} /> Apply / View Leaves
            </NavLink>
            <NavLink to="/staff/shifts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Clock size={18} /> My Shifts
            </NavLink>
            <div className="nav-section-title">Court Duty</div>
            <NavLink to="/staff/check-in" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <QrCode size={18} /> Gate & Turnstile Check-In
            </NavLink>
            <NavLink to="/staff/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Court Bookings Ledger
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Notifications
            </NavLink>
          </>
        )}

        {/* ================= MEMBER NAVIGATION ================= */}
        {isMember && (
          <>
            <div className="nav-section-title">Member Area</div>
            <NavLink to="/member/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Member Hub
            </NavLink>
            <NavLink to="/member/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile
            </NavLink>
            <NavLink to="/member/plans" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Sparkles size={18} /> Membership Catalog
            </NavLink>
            <NavLink to="/member/my-membership" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CreditCard size={18} /> My Membership & Renew
            </NavLink>
            <NavLink to="/member/qr-card" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <QrCode size={18} /> QR Membership Card
            </NavLink>
            <NavLink to="/member/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Receipt size={18} /> My Payments & Receipts
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Notifications
            </NavLink>

            <div className="nav-section-title">Sports & Courts</div>
            <NavLink to="/member/book-court" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Dumbbell size={18} /> Reserve a Court
            </NavLink>
            <NavLink to="/member/court-availability" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Clock size={18} /> Court Availability
            </NavLink>
            <NavLink to="/member/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> My Court Bookings
            </NavLink>
            <NavLink to="/member/social-play" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Friday Social Play
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{ width: '100%', color: '#f87171', justifyContent: 'flex-start' }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
