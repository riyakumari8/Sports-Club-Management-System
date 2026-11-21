import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { financeService } from '../../services/financeService';
import {
  TrendingDown,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  Tag,
  Building,
} from 'lucide-react';

export const ExpenseManagementPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'MAINTENANCE',
    amount: '',
    expenseDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'BANK_TRANSFER',
    vendorName: '',
    receiptUrl: '',
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (method) params.paymentMethod = method;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (search) params.search = search;

      const res = await financeService.getExpenses(params);
      const list = res?.data || res || [];
      setExpenses(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load expenses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [category, method, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setFormData({
      description: '',
      category: 'MAINTENANCE',
      amount: '',
      expenseDate: new Date().toISOString().slice(0, 10),
      paymentMethod: 'BANK_TRANSFER',
      vendorName: '',
      receiptUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExpense(exp);
    setFormData({
      description: exp.description || '',
      category: exp.category || 'MAINTENANCE',
      amount: exp.amount?.toString() || '',
      expenseDate: exp.expenseDate || new Date().toISOString().slice(0, 10),
      paymentMethod: exp.paymentMethod || 'BANK_TRANSFER',
      vendorName: exp.vendorName || '',
      receiptUrl: exp.receiptUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingExpense) {
        await financeService.updateExpense(editingExpense.id, payload);
        alert('Expense record updated successfully.');
      } else {
        await financeService.createExpense(payload);
        alert('Operational expense recorded and notification sent to administrators.');
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, ref) => {
    if (!window.confirm(`Are you sure you want to delete expense record ${ref}? This will generate an audit log.`)) {
      return;
    }
    try {
      await financeService.deleteExpense(id);
      alert('Expense record deleted.');
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense.');
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  const totalExpenseSum = expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const salarySum = expenses
    .filter((e) => e.category === 'STAFF_SALARY')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const maintenanceSum = expenses
    .filter((e) => e.category === 'MAINTENANCE' || e.category === 'EQUIPMENT')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <DashboardLayout
      title="Operational Expense Management"
      subtitle="Track, budget, and audit club operating disbursements across payroll, facilities, utilities, and stock"
    >
      {/* Top Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}>
        <button
          onClick={handleOpenCreate}
          style={{
            padding: '0.55rem 1.1rem',
            backgroundColor: '#0F5132',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <PlusCircle size={16} /> Record New Expense
        </button>

        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>
          Tracking <strong>{expenses.length}</strong> operational disbursement records
        </span>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Total Filtered Expenses"
          value={formatCurrency(totalExpenseSum)}
          icon={TrendingDown}
          color="#dc2626"
          bg="#fee2e2"
          subtitle="Sum of matching records"
        />
        <StatCard
          title="Staff Payroll Share"
          value={formatCurrency(salarySum)}
          icon={DollarSign}
          color="#0F5132"
          bg="#d1e7dd"
          subtitle={`${Math.round((salarySum / (totalExpenseSum || 1)) * 100)}% of total filtered expenses`}
        />
        <StatCard
          title="Courts & Equipment Maintenance"
          value={formatCurrency(maintenanceSum)}
          icon={Building}
          color="#d97706"
          bg="#fef3c7"
          subtitle="Resurfacing, nets, floodlights"
        />
      </div>

      {/* Filters Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 220px', minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search description, vendor, ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.85rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All 7 Categories</option>
            <option value="STAFF_SALARY">Staff Salary & Payroll</option>
            <option value="EQUIPMENT">Equipment Purchase</option>
            <option value="MAINTENANCE">Court & Facility Maintenance</option>
            <option value="UTILITIES">Utilities (Power, Water, Net)</option>
            <option value="INVENTORY">Shop & Cafe Inventory</option>
            <option value="EVENTS">Events, Coaching & Tournaments</option>
            <option value="OTHER">Other Miscellaneous</option>
          </select>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.85rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">All Payment Modes</option>
            <option value="BANK_TRANSFER">Bank NEFT/RTGS</option>
            <option value="UPI">UPI Corporate</option>
            <option value="CARD">Corporate Card</option>
            <option value="CASH">Petty Cash</option>
            <option value="CHEQUE">Cheque</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '0.48rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.82rem' }}
            title="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '0.48rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.82rem' }}
            title="End Date"
          />

          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0F5132',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Filter
          </button>

          {(category || method || startDate || endDate || search) && (
            <button
              type="button"
              onClick={() => {
                setCategory('');
                setMethod('');
                setStartDate('');
                setEndDate('');
                setSearch('');
                setTimeout(fetchExpenses, 50);
              }}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Main Expenses Table */}
      {loading ? (
        <Loader message="Loading expense disbursements..." />
      ) : expenses.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '3rem',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <TrendingDown size={40} style={{ margin: '0 auto 0.75rem', color: '#9ca3af' }} />
          <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: '#111827' }}>No expense records match criteria</h4>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>Click "Record New Expense" above to add an operating disbursement.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Expense Ref</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Description</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Vendor / Payee</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Amount (₹)</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Method</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0F5132' }}>
                      {exp.expenseReference}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                      {exp.expenseDate}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor:
                          exp.category === 'STAFF_SALARY' ? '#d1e7dd' :
                          exp.category === 'MAINTENANCE' ? '#fef3c7' :
                          exp.category === 'UTILITIES' ? '#e0e7ff' :
                          exp.category === 'EQUIPMENT' ? '#dbeafe' : '#f3f4f6',
                        color:
                          exp.category === 'STAFF_SALARY' ? '#0F5132' :
                          exp.category === 'MAINTENANCE' ? '#92400e' :
                          exp.category === 'UTILITIES' ? '#3730a3' :
                          exp.category === 'EQUIPMENT' ? '#1e40af' : '#374151',
                      }}>
                        {exp.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#111827', fontWeight: 600 }}>
                      {exp.description}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#4b5563' }}>
                      {exp.vendorName || 'Club Operations'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>
                      {formatCurrency(exp.amount)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#4b5563', fontSize: '0.8rem' }}>
                      {exp.paymentMethod?.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                          title="Edit Expense"
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.expenseReference)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                          title="Delete Expense"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= RECORD / EDIT EXPENSE MODAL ================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? `Edit Expense: ${editingExpense.expenseReference}` : 'Record Operational Expense'}
        maxWidth="540px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Expense Description:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Clay Court 2 topsoil laser leveling and line replacement"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Category:
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              >
                <option value="STAFF_SALARY">Staff Salary & Payroll</option>
                <option value="EQUIPMENT">Equipment Purchase</option>
                <option value="MAINTENANCE">Court & Facility Maintenance</option>
                <option value="UTILITIES">Utilities (Power, Water, Net)</option>
                <option value="INVENTORY">Shop & Cafe Inventory</option>
                <option value="EVENTS">Events & Coaching</option>
                <option value="OTHER">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Amount (₹):
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="1"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Disbursement Date:
              </label>
              <input
                type="date"
                required
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Payment Method:
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              >
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI Corporate</option>
                <option value="CARD">Corporate Credit Card</option>
                <option value="CASH">Petty Cash</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Vendor / Payee Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Court Surfacing Ltd / Delhi Power Corp"
              value={formData.vendorName}
              onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Receipt / Invoice URL:
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/invoice-ref-001.pdf"
              value={formData.receiptUrl}
              onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0F5132',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default ExpenseManagementPage;
