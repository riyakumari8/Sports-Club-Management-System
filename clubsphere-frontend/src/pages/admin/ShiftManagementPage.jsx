import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { Clock, Plus, Calendar, User, CheckCircle2 } from 'lucide-react';

export const ShiftManagementPage = () => {
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    shiftId: '',
    scheduleDate: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shiftList, schedList, empList] = await Promise.all([
        staffService.getAllShifts(),
        staffService.getDailySchedules(selectedDate),
        staffService.searchEmployees('', '', 'ACTIVE'),
      ]);
      setShifts(shiftList);
      setSchedules(schedList);
      setEmployees(empList);
      if (empList.length > 0 && !formData.employeeId) {
        setFormData((prev) => ({ ...prev, employeeId: empList[0].id }));
      }
      if (shiftList.length > 0 && !formData.shiftId) {
        setFormData((prev) => ({ ...prev, shiftId: shiftList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load shift data', err);
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
      await staffService.assignShift({
        employeeId: parseInt(formData.employeeId, 10),
        shiftId: parseInt(formData.shiftId, 10),
        scheduleDate: formData.scheduleDate,
      });
      alert('Shift assigned successfully!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to assign shift');
    }
  };

  return (
    <DashboardLayout
      title="Shift & Schedule Management"
      subtitle="Define operational shifts and allocate daily staff duties"
    >
      {/* Shift Templates Cards */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
          Standard Club Shifts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {shifts.map((s) => (
            <div key={s.id} className="cs-card" style={{ borderLeft: '4px solid #0F5132' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' }}>{s.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#0F5132', fontWeight: 600 }}>
                  <Clock size={14} />
                  <span>{s.startTime} - {s.endTime}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roster & Assignments */}
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#0F5132" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Duty Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '160px', padding: '0.45rem 0.75rem' }}
          />
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={18} /> Assign Duty Shift
        </button>
      </div>

      {loading ? (
        <Loader message="Loading shift duty schedules..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Scheduled Employee</th>
                <th>Assigned Shift</th>
                <th>Working Hours</th>
                <th>Duty Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((sc) => (
                  <tr key={sc.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{sc.employeeName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID #{sc.employeeId}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F5132' }}>
                        {sc.shiftName}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {sc.startTime} - {sc.endTime}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{sc.scheduleDate}</td>
                    <td>
                      <Badge type={sc.status}>{sc.status}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No shift schedules assigned for {selectedDate}. Use "Assign Duty Shift" above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ASSIGN SHIFT MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign Shift to Staff Member"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee</label>
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

          <div className="form-group">
            <label className="form-label">Shift Template</label>
            <select
              required
              value={formData.shiftId}
              onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
            >
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.startTime} to {s.endTime})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Duty Date</label>
            <input
              type="date"
              required
              value={formData.scheduleDate}
              onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
