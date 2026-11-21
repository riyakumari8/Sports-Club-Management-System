import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { Clock, Calendar, ShieldCheck } from 'lucide-react';

export const ShiftSchedulePage = () => {
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const [shiftList, schedList] = await Promise.all([
          staffService.getAllShifts(),
          staffService.getDailySchedules(selectedDate),
        ]);
        setShifts(shiftList);
        setSchedules(schedList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [selectedDate]);

  return (
    <DashboardLayout
      title="Staff Shift Schedules & Roster"
      subtitle="View club operational duty hours and daily team assignments"
    >
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
          Standard Club Shifts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {shifts.map((s) => (
            <div key={s.id} className="cs-card" style={{ borderLeft: '4px solid #0F5132' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
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
      </div>

      {loading ? (
        <Loader message="Loading shift roster..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Scheduled Employee</th>
                <th>Assigned Shift</th>
                <th>Shift Hours</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((sc) => (
                  <tr key={sc.id}>
                    <td><strong>{sc.employeeName}</strong></td>
                    <td style={{ color: '#0F5132', fontWeight: 600 }}>{sc.shiftName}</td>
                    <td style={{ fontSize: '0.85rem' }}>{sc.startTime} - {sc.endTime}</td>
                    <td style={{ fontSize: '0.85rem' }}>{sc.scheduleDate}</td>
                    <td><Badge type={sc.status}>{sc.status}</Badge></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No duty shifts assigned for {selectedDate}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};
