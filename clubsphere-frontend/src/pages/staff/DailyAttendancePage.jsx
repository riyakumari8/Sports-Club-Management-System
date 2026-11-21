import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { CalendarCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const DailyAttendancePage = () => {
  const [employee, setEmployee] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mark Form
  const [formData, setFormData] = useState({
    attendanceDate: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    remarks: 'Marked by employee',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const emp = await staffService.getMyStaffProfile();
      setEmployee(emp);
      if (emp?.id) {
        const att = await staffService.getAttendanceHistory(emp.id);
        setHistory(att);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await staffService.markAttendance({
        employeeId: employee.id,
        attendanceDate: formData.attendanceDate,
        status: formData.status,
        checkInTime: formData.checkInTime ? formData.checkInTime + ':00' : null,
        checkOutTime: formData.checkOutTime ? formData.checkOutTime + ':00' : null,
        remarks: formData.remarks,
      });
      setSuccess('Your attendance has been successfully recorded!');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to mark attendance');
    }
  };

  return (
    <DashboardLayout
      title="Daily Attendance & Punch Logging"
      subtitle="Log your presence and track historical shifts and duty hours"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Mark Attendance Form */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <CalendarCheck size={20} color="#0F5132" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Mark Duty Attendance</h3>
          </div>

          {success && (
            <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {success}
            </div>
          )}

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleMarkSubmit}>
            <div className="form-group">
              <label className="form-label">Duty Date</label>
              <input
                type="date"
                required
                value={formData.attendanceDate}
                onChange={(e) => setFormData({ ...formData, attendanceDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attendance Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PRESENT">Present (Full Day Duty)</option>
                <option value="HALF_DAY">Half Day</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Punch In Time</label>
                <input
                  type="time"
                  required
                  value={formData.checkInTime}
                  onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Punch Out Time</label>
                <input
                  type="time"
                  required
                  value={formData.checkOutTime}
                  onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Duty Notes / Summary</label>
              <input
                type="text"
                placeholder="e.g. Conducted morning tennis coaching drills"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              Submit Attendance Log
            </button>
          </form>
        </div>

        {/* Attendance Log History */}
        <div className="cs-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
            My Monthly Attendance Log
          </h3>

          {loading ? (
            <Loader message="Loading attendance history..." />
          ) : (
            <div className="cs-table-container">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? (
                    history.map((h) => (
                      <tr key={h.id}>
                        <td><strong>{h.attendanceDate}</strong></td>
                        <td><Badge type={h.status}>{h.status}</Badge></td>
                        <td style={{ fontSize: '0.85rem' }}>{h.checkInTime || '--:--'}</td>
                        <td style={{ fontSize: '0.85rem' }}>{h.checkOutTime || '--:--'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                        No records logged yet. Use the form on the left to punch in!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
