import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { authService } from '../../services/authService';
import { Briefcase, User, Mail, Phone, Calendar, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const StaffProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Change password
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const emp = await staffService.getMyStaffProfile();
        setEmployee(emp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPassError('New password and confirm password do not match');
      return;
    }
    try {
      await authService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPassSuccess('Password updated successfully!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPassError(err.message || 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Staff Profile" subtitle="Employment credentials">
        <Loader message="Loading employment profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Staff Profile & Credentials"
      subtitle="Official employment record, designation, and security settings"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Employment Record */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <Briefcase size={20} color="#0F5132" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Official Employment Record</h3>
          </div>

          {employee && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Employee Code</span>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0F5132', fontSize: '1rem' }}>
                    {employee.employeeCode}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</span>
                  <div style={{ fontWeight: 600 }}>{employee.departmentName}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Designation</span>
                  <div style={{ fontWeight: 600 }}>{employee.designation}</div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Employment Status</span>
                  <div style={{ marginTop: '2px' }}><Badge type={employee.employmentStatus}>{employee.employmentStatus}</Badge></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Joining Date</span>
                  <div style={{ fontWeight: 600 }}>{employee.joiningDate}</div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Employment Type</span>
                  <div style={{ fontWeight: 600 }}>{employee.employmentType}</div>
                </div>
              </div>

              <div>
                <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Work Email</span>
                <div style={{ fontWeight: 600 }}>{employee.email}</div>
              </div>

              <div>
                <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact Mobile</span>
                <div style={{ fontWeight: 600 }}>{employee.phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <Lock size={20} color="#0F5132" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Security & Credentials</h3>
          </div>

          {passSuccess && (
            <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {passSuccess}
            </div>
          )}

          {passError && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> {passError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password *</label>
              <input
                type="password"
                required
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
