import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import {
  UserCheck,
  UserX,
  Users,
  CalendarCheck,
  CalendarX,
  PlusCircle,
  Briefcase,
  Clock,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export const StaffDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await staffService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load staff dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Staff Dashboard" subtitle="Workforce overview">
        <Loader message="Loading staff metrics..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Staff Administration Dashboard"
      subtitle="Comprehensive workforce metrics, attendance stats, and department allocations"
    >
      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Staff Members"
          value={stats?.totalEmployees ?? 0}
          icon={Users}
          color="#0F5132"
          bg="#d1e7dd"
        />
        <StatCard
          title="Active On-Duty Staff"
          value={stats?.activeEmployees ?? 0}
          icon={UserCheck}
          color="#059669"
          bg="#d1fae5"
        />
        <StatCard
          title="Marked Present Today"
          value={stats?.presentToday ?? 0}
          icon={CalendarCheck}
          color="#2563eb"
          bg="#dbeafe"
        />
        <StatCard
          title="Staff On Leave Today"
          value={stats?.onLeaveToday ?? 0}
          icon={CalendarX}
          color="#d97706"
          bg="#fef3c7"
        />
        <StatCard
          title="Inactive Accounts"
          value={stats?.inactiveEmployees ?? 0}
          icon={UserX}
          color="#dc2626"
          bg="#fee2e2"
        />
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="cs-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>Staff Operations</h4>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Direct management shortcuts</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/staff" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Staff Directory & Onboarding
          </Link>
          <Link to="/admin/attendance" className="btn btn-secondary btn-sm">
            <CalendarCheck size={16} /> Mark Daily Attendance
          </Link>
          <Link to="/admin/leaves" className="btn btn-secondary btn-sm">
            <CalendarX size={16} /> Review Leave Requests
          </Link>
          <Link to="/admin/shifts" className="btn btn-secondary btn-sm">
            <Clock size={16} /> Shift Schedules
          </Link>
          <Link to="/admin/salary" className="btn btn-secondary btn-sm">
            <DollarSign size={16} /> Payroll & Salaries
          </Link>
        </div>
      </div>

      {/* Split Section: Department Allocation & Recent Hires */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Department Overview */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>Department Staffing Distribution</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Assigned personnel per functional unit</p>
            </div>
            <Link to="/admin/staff" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Directory <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.departmentBreakdown && stats.departmentBreakdown.length > 0 ? (
              stats.departmentBreakdown.map((dept) => (
                <div
                  key={dept.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1f2937' }}>{dept.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{dept.description}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F5132', background: '#d1e7dd', padding: '3px 10px', borderRadius: '12px' }}>
                    {dept.employeeCount} Members
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No departments found.</p>
            )}
          </div>
        </div>

        {/* Recent Staff Hires */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>Recent Employees</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Latest staff onboarding records</p>
            </div>
            <Link to="/admin/staff" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              All Staff <ArrowRight size={14} />
            </Link>
          </div>

          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentEmployees && stats.recentEmployees.length > 0 ? (
                  stats.recentEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{emp.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{emp.employeeCode}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{emp.departmentName}</td>
                      <td style={{ fontSize: '0.85rem' }}>{emp.designation}</td>
                      <td>
                        <Badge type={emp.employmentStatus}>{emp.employmentStatus}</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                      No staff records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
