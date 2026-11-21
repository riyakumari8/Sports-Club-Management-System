import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import { DollarSign, Plus, Calendar, CheckCircle, FileText, ArrowRight } from 'lucide-react';

export const SalaryOverviewPage = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    payPeriodMonth: month,
    payPeriodYear: year,
    baseSalary: '',
    allowances: '0',
    deductions: '0',
    paymentStatus: 'PAID',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentReference: 'SAL-NEFT-' + SystemTime(),
  });

  function SystemTime() {
    return Math.floor(Date.now() / 1000).toString().slice(-6);
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salData, empData] = await Promise.all([
        staffService.getSalaryRecords(month, year),
        staffService.searchEmployees('', '', 'ACTIVE'),
      ]);
      setSalaries(salData);
      setEmployees(empData);
      if (empData.length > 0 && !formData.employeeId) {
        setFormData((prev) => ({
          ...prev,
          employeeId: empData[0].id,
          baseSalary: empData[0].baseSalary || '40000',
        }));
      }
    } catch (err) {
      console.error('Failed to load salary records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const handleEmployeeSelect = (empId) => {
    const emp = employees.find((e) => e.id.toString() === empId.toString());
    setFormData((prev) => ({
      ...prev,
      employeeId: empId,
      baseSalary: emp ? emp.baseSalary : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffService.createOrUpdateSalary({
        employeeId: parseInt(formData.employeeId, 10),
        payPeriodMonth: parseInt(formData.payPeriodMonth, 10),
        payPeriodYear: parseInt(formData.payPeriodYear, 10),
        baseSalary: parseFloat(formData.baseSalary),
        allowances: parseFloat(formData.allowances || 0),
        deductions: parseFloat(formData.deductions || 0),
        paymentStatus: formData.paymentStatus,
        paymentDate: formData.paymentDate,
        paymentReference: formData.paymentReference,
      });
      alert('Salary record generated successfully!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to generate salary record');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const totalPayroll = salaries.reduce((acc, curr) => acc + (parseFloat(curr.netSalary) || 0), 0);

  return (
    <DashboardLayout
      title="Staff Salary & Payroll Records"
      subtitle="Confidential administrator compensation logs and disbursements"
    >
      <div className="view-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#0F5132" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Period:</span>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              style={{ width: '130px', padding: '0.45rem' }}
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((mName, idx) => (
                <option key={idx + 1} value={idx + 1}>{mName}</option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              style={{ width: '90px', padding: '0.45rem' }}
            />
          </div>

          <div style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: 600, background: '#d1e7dd', padding: '0.4rem 0.85rem', borderRadius: '6px' }}>
            Total Payroll: {formatCurrency(totalPayroll)}
          </div>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={18} /> Record Salary Payment
        </button>
      </div>

      {loading ? (
        <Loader message="Loading payroll records..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department & Role</th>
                <th>Base Pay</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Disbursed</th>
                <th>Status</th>
                <th>Txn Reference</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length > 0 ? (
                salaries.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.employeeName}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#9ca3af' }}>{s.employeeCode}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{s.designation}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.departmentName}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{formatCurrency(s.baseSalary)}</td>
                    <td style={{ fontSize: '0.85rem', color: '#15803d' }}>+{formatCurrency(s.allowances)}</td>
                    <td style={{ fontSize: '0.85rem', color: '#dc2626' }}>-{formatCurrency(s.deductions)}</td>
                    <td style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F5132' }}>
                      {formatCurrency(s.netSalary)}
                    </td>
                    <td>
                      <Badge type={s.paymentStatus}>{s.paymentStatus}</Badge>
                    </td>
                    <td style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#4b5563' }}>
                      {s.paymentReference || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No salary records processed for this period. Use "Record Salary Payment" above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= RECORD SALARY MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Disburse / Record Staff Salary"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee *</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName} ({e.designation}) - Standard: {formatCurrency(e.baseSalary)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Base Salary (INR) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Allowances (+)</label>
              <input
                type="number"
                min={0}
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deductions (-)</label>
              <input
                type="number"
                min={0}
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                required
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Txn / Bank Reference</label>
              <input
                type="text"
                placeholder="e.g. NEFT-98765432"
                value={formData.paymentReference}
                onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
              />
            </div>
          </div>

          <div style={{ background: '#f9fafb', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>Computed Net Salary:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F5132' }}>
              {formatCurrency(
                (parseFloat(formData.baseSalary) || 0) +
                (parseFloat(formData.allowances) || 0) -
                (parseFloat(formData.deductions) || 0)
              )}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm & Save Record
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
