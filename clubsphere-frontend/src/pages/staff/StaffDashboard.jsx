import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { staffService } from '../../services/staffService';
import {
  CalendarCheck,
  CalendarX,
  Clock,
  Briefcase,
  User,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const emp = await staffService.getMyStaffProfile();
        setEmployeeProfile(emp);
        if (emp?.id) {
          const att = await staffService.getAttendanceHistory(emp.id);
          setRecentAttendance(att.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load staff details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Staff Portal" subtitle="Employee duty portal">
        <Loader message="Loading your employee profile and duties..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Staff Portal: ${user?.fullName || 'Staff Member'}`}
      subtitle="Shift schedule, attendance logging, and leave management"
    >
      {/* Employee Info Card */}
      {employeeProfile && (
        <div style={{
          background: 'linear-gradient(135deg, #072a18 0%, #0F5132 70%, #1e3a8a 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#86efac', fontWeight: 700, letterSpacing: '0.08em' }}>
              OFFICIAL EMPLOYEE BADGE
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>
              {employeeProfile.fullName}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>
              {employeeProfile.designation} &bull; <strong>{employeeProfile.departmentName}</strong>
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div>Code: <strong style={{ fontFamily: 'monospace' }}>{employeeProfile.employeeCode}</strong></div>
              <div>Joined: <strong>{employeeProfile.joiningDate}</strong></div>
              <div>Status: <Badge type={employeeProfile.employmentStatus}>{employeeProfile.employmentStatus}</Badge></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/staff/attendance" className="btn btn-gold btn-sm">
              <CalendarCheck size={16} /> Mark Today's Attendance
            </Link>
            <Link to="/staff/leaves" className="btn btn-secondary btn-sm">
              <CalendarX size={16} /> Apply for Leave
            </Link>
          </div>
        </div>
      )}

      {/* Quick Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1f2937' }}>Daily Attendance</h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Log daily punch-in and check-out times</p>
            </div>
          </div>
          <Link to="/staff/attendance" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Attendance Logs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarX size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1f2937' }}>Leave Portal</h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Submit casual, sick, or annual leave</p>
            </div>
          </div>
          <Link to="/staff/leaves" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Apply Leave <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1f2937' }}>Shift Schedule</h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Assigned duty hours and rosters</p>
            </div>
          </div>
          <Link to="/staff/shifts" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Check Roster <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Attendance Logs */}
      <div className="cs-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
          Recent Attendance Records
        </h3>
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.length > 0 ? (
                recentAttendance.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.attendanceDate}</strong></td>
                    <td><Badge type={a.status}>{a.status}</Badge></td>
                    <td>{a.checkInTime || '--:--'}</td>
                    <td>{a.checkOutTime || '--:--'}</td>
                    <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>{a.remarks || 'Regular'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                    No attendance logs recorded this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
