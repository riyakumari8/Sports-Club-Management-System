import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

// Public Pages
import { IntroductionPage } from '../pages/public/IntroductionPage';
import { AboutPage } from '../pages/public/AboutPage';
import { SportsPage } from '../pages/public/SportsPage';
import { CourtsPublicPage } from '../pages/public/CourtsPublicPage';
import { MembershipsPublicPage } from '../pages/public/MembershipsPublicPage';
import { PromotionsPage } from '../pages/public/PromotionsPage';
import { ShopsPage } from '../pages/public/ShopsPage';
import { ContactPage } from '../pages/public/ContactPage';

// Auth Pages & Dedicated Portals
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { StaffLoginPage } from '../pages/auth/StaffLoginPage';
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

// Court & Operations Pages
import { BookCourtPage } from '../pages/member/BookCourtPage';
import { CourtAvailabilityPage } from '../pages/member/CourtAvailabilityPage';
import { MyCourtBookingsPage } from '../pages/member/MyCourtBookingsPage';
import { SocialPlayPage } from '../pages/member/SocialPlayPage';
import { AdminCourtsPage } from '../pages/admin/AdminCourtsPage';
import { AdminAllBookingsPage } from '../pages/admin/AdminAllBookingsPage';
import { FrontDeskCheckInPage } from '../pages/admin/FrontDeskCheckInPage';
import { EnquiryCRMPage } from '../pages/admin/EnquiryCRMPage';

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
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  const { isAuthenticated, roles } = useAuth();

  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (roles.includes('ROLE_STAFF')) return '/staff/dashboard';
    return '/student/dashboard';
  };

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<IntroductionPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/sports" element={<SportsPage />} />
      <Route path="/courts" element={<CourtsPublicPage />} />
      <Route path="/memberships" element={<MembershipsPublicPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/shops" element={<ShopsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={getDefaultRedirect()} replace />} />
      <Route path="/signup" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={getDefaultRedirect()} replace />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={getDefaultRedirect()} replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Dedicated Evaluator / Role Portals */}
      <Route path="/admin/login" element={!isAuthenticated ? <AdminLoginPage /> : <Navigate to="/admin/dashboard" replace />} />
      <Route path="/staff/login" element={!isAuthenticated ? <StaffLoginPage /> : <Navigate to="/staff/dashboard" replace />} />

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

      {/* Student / Member Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />
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

      {/* Member Court Routes */}
      <Route
        path="/member/book-court"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <BookCourtPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/court-availability"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <CourtAvailabilityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/my-bookings"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <MyCourtBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/social-play"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MEMBER', 'ROLE_ADMIN']}>
            <SocialPlayPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Court Routes */}
      <Route
        path="/admin/courts"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminCourtsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminAllBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/check-in"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STAFF']}>
            <FrontDeskCheckInPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <EnquiryCRMPage />
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
      <Route
        path="/staff/check-in"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <FrontDeskCheckInPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/bookings"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <AdminAllBookingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
    </Routes>
  );
};
