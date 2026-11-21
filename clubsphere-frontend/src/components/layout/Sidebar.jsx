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

            <div className="nav-section-title">Integration Hub</div>
            <NavLink to="/admin/integration-demo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Share2 size={18} /> Team Integrations
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
