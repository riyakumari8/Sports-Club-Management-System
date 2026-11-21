import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { MembershipDashboardPage } from '../pages/admin/MembershipDashboardPage';
import { PlanManagementPage } from '../pages/admin/PlanManagementPage';
import { StaffDashboardPage } from '../pages/admin/StaffDashboardPage';
import { EmployeeManagementPage } from '../pages/admin/EmployeeManagementPage';
import { AttendanceManagementPage } from '../pages/admin/AttendanceManagementPage';
import { LeaveApprovalPage } from '../pages/admin/LeaveApprovalPage';
import { ShiftManagementPage } from '../pages/admin/ShiftManagementPage';
import { SalaryOverviewPage } from '../pages/admin/SalaryOverviewPage';
import { TeamIntegrationDemoPage } from '../pages/admin/TeamIntegrationDemoPage';

// Member Pages
import { MemberDashboard } from '../pages/member/MemberDashboard';
import { MemberProfilePage } from '../pages/member/MemberProfilePage';
import { MembershipCatalogPage } from '../pages/member/MembershipCatalogPage';
import { MyMembershipPage } from '../pages/member/MyMembershipPage';
import { QrMembershipCardPage } from '../pages/member/QrMembershipCardPage';

// Staff Pages
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import { StaffProfilePage } from '../pages/staff/StaffProfilePage';
import { DailyAttendancePage } from '../pages/staff/DailyAttendancePage';
import { ApplyLeavePage } from '../pages/staff/ApplyLeavePage';
import { ShiftSchedulePage } from '../pages/staff/ShiftSchedulePage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, roles, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader message="Verifying session credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some((r) => roles.includes(r))) {
    // Redirect to proper role portal
    if (roles.includes('ROLE_ADMIN')) return <Navigate to="/admin/dashboard" replace />;
    if (roles.includes('ROLE_STAFF')) return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/member/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  const { isAuthenticated, roles } = useAuth();

  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (roles.includes('ROLE_STAFF')) return '/staff/dashboard';
    return '/member/dashboard';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={getDefaultRedirect()} replace />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={getDefaultRedirect()} replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/memberships"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <MembershipDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <PlanManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <EmployeeManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AttendanceManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <LeaveApprovalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shifts"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <ShiftManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/salary"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <SalaryOverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/integration-demo"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <TeamIntegrationDemoPage />
          </ProtectedRoute>
        }
      />

      {/* Member Routes */}
      <Route
        path="/member/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/profile"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <MemberProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/plans"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <MembershipCatalogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/my-membership"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <MyMembershipPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/qr-card"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <QrMembershipCardPage />
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <StaffProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/attendance"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <DailyAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/leaves"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <ApplyLeavePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/shifts"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <ShiftSchedulePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
    </Routes>
  );
};
