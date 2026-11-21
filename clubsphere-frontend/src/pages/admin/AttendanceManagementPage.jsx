import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { CalendarCheck, Calendar, Clock, Plus, Filter, User } from 'lucide-react';

export const AttendanceManagementPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    attendanceDate: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    remarks: 'Regular attendance',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attData, empData] = await Promise.all([
        staffService.getDailyAttendance(selectedDate),
        staffService.searchEmployees('', '', 'ACTIVE'),
      ]);
      setAttendanceList(attData);
      setEmployees(empData);
      if (empData.length > 0 && !formData.employeeId) {
        setFormData((prev) => ({ ...prev, employeeId: empData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load attendance records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffService.markAttendance({
        employeeId: parseInt(formData.employeeId, 10),
        attendanceDate: formData.attendanceDate,
        status: formData.status,
        checkInTime: formData.checkInTime ? formData.checkInTime + ':00' : null,
        checkOutTime: formData.checkOutTime ? formData.checkOutTime + ':00' : null,
        remarks: formData.remarks,
      });
      alert('Attendance recorded successfully!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to mark attendance');
    }
  };

  return (
    <DashboardLayout
      title="Attendance Management"
      subtitle="Track daily employee presence, punch times, and monthly reports"
    >
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#0F5132" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Filter Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: '160px', padding: '0.45rem 0.75rem' }}
            />
          </div>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={18} /> Mark Staff Attendance
        </button>
      </div>

      {loading ? (
        <Loader message="Loading daily attendance logs..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length > 0 ? (
                attendanceList.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.employeeName}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#9ca3af' }}>{a.employeeCode}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{a.departmentName}</td>
                    <td style={{ fontSize: '0.85rem' }}>{a.attendanceDate}</td>
                    <td>
                      <Badge type={a.status}>{a.status}</Badge>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{a.checkInTime || '--:--'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{a.checkOutTime || '--:--'}</td>
                    <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{a.remarks || 'None'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No attendance logs recorded for {selectedDate}. Use "Mark Staff Attendance" above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= RECORD ATTENDANCE MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Daily Attendance"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Employee *</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName} ({e.employeeCode}) - {e.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Attendance Date *</label>
              <input
                type="date"
                required
                value={formData.attendanceDate}
                onChange={(e) => setFormData({ ...formData, attendanceDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PRESENT">Present (Full Day)</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="ABSENT">Absent</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Punch In Time</label>
              <input
                type="time"
                value={formData.checkInTime}
                onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Punch Out Time</label>
              <input
                type="time"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Remarks / Shift Notes</label>
            <input
              type="text"
              placeholder="e.g. Regular coaching hours"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Attendance
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
