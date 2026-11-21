import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { membershipService } from '../../services/membershipService';
import { staffService } from '../../services/staffService';
import { integrationService } from '../../services/integrationService';
import {
  Users,
  CreditCard,
  UserCheck,
  DollarSign,
  CalendarCheck,
  CalendarX,
  ArrowRight,
  PlusCircle,
  QrCode,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [membershipStats, setMembershipStats] = useState(null);
  const [staffStats, setStaffStats] = useState(null);
  const [clubSummary, setClubSummary] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [memData, stfData, summary] = await Promise.all([
          membershipService.getDashboardStats().catch(() => null),
          staffService.getDashboardStats().catch(() => null),
          integrationService.getClubSummary().catch(() => null),
        ]);
        setMembershipStats(memData);
        setStaffStats(stfData);
        setClubSummary(summary);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Command Center" subtitle="Real-time ClubSphere operations and metrics">
        <Loader message="Loading ClubSphere dashboard metrics..." />
      </DashboardLayout>
    );
  }

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);
  };

  return (
    <DashboardLayout
      title="Admin Command Center"
      subtitle="Overview of ClubSphere sports membership, staffing, and team integration"
    >
      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Registered Members"
          value={membershipStats?.totalMembers ?? 0}
          icon={Users}
          color="#0F5132"
          bg="#d1e7dd"
          subtitle={`${membershipStats?.activeMembers ?? 0} currently active`}
        />
        <StatCard
          title="Active Memberships"
          value={membershipStats?.activeMembers ?? 0}
          icon={CreditCard}
          color="#d97706"
          bg="#fef3c7"
          subtitle={`Gold: ${membershipStats?.goldMembers ?? 0} | Silver: ${membershipStats?.silverMembers ?? 0} | Jr: ${membershipStats?.juniorMembers ?? 0}`}
        />
        <StatCard
          title="Active Club Staff"
          value={staffStats?.activeEmployees ?? 0}
          icon={UserCheck}
          color="#2563eb"
          bg="#dbeafe"
          subtitle={`${staffStats?.onLeaveToday ?? 0} on leave today`}
        />
        <StatCard
          title="Monthly Membership Revenue"
          value={formatCurrency(membershipStats?.monthlyRevenue)}
          icon={DollarSign}
          color="#059669"
          bg="#d1fae5"
          subtitle="Collected this month"
        />
      </div>

      {/* Quick Action Bar */}
      <div className="cs-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>Management Shortcuts</h4>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Frequently accessed modules & actions</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/admin/plans" className="btn btn-secondary btn-sm">
            <CreditCard size={16} /> Configure Plans
          </Link>
          <Link to="/admin/staff" className="btn btn-secondary btn-sm">
            <PlusCircle size={16} /> Add Staff Employee
          </Link>
          <Link to="/admin/integration-demo" className="btn btn-primary btn-sm" style={{ background: '#0F5132' }}>
            <Sparkles size={16} /> Test Team Integrations
          </Link>
        </div>
      </div>

      {/* Split Views: Recent Members & Department Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Memberships */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>Recent Memberships</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Latest subscriptions & renewals</p>
            </div>
            <Link to="/admin/memberships" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan Tier</th>
                  <th>Valid Thru</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {membershipStats?.recentMemberships && membershipStats.recentMemberships.length > 0 ? (
                  membershipStats.recentMemberships.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{m.memberName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{m.membershipNumber}</div>
                      </td>
                      <td>
                        <Badge type={m.planCategory}>{m.planCategory}</Badge>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{m.endDate}</td>
                      <td>
                        <Badge type={m.status}>{m.status}</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af', padding: '1.5rem' }}>
                      No recent membership records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff & Department Status */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>Department Staffing</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Headcount across club wings</p>
            </div>
            <Link to="/admin/staff" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Directory <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {staffStats?.departmentBreakdown && staffStats.departmentBreakdown.length > 0 ? (
              staffStats.departmentBreakdown.map((dept) => (
                <div
                  key={dept.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #f3f4f6'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1f2937' }}>{dept.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{dept.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F5132', background: '#d1e7dd', padding: '2px 8px', borderRadius: '12px' }}>
                      {dept.employeeCount} staff
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No department data available.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
