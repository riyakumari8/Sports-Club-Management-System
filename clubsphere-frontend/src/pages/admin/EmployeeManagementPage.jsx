import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { staffService } from '../../services/staffService';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit,
  UserX,
  Briefcase,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  Eye,
} from 'lucide-react';

export const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    dateOfBirth: '',
    gender: 'Male',
    departmentId: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'FULL_TIME',
    baseSalary: '',
  });

  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    departmentId: '',
    designation: '',
    employmentStatus: 'ACTIVE',
    employmentType: 'FULL_TIME',
    baseSalary: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empData, deptData] = await Promise.all([
        staffService.searchEmployees(searchQuery, deptFilter, statusFilter),
        staffService.getDepartments(),
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      if (deptData.length > 0 && !createForm.departmentId) {
        setCreateForm((prev) => ({ ...prev, departmentId: deptData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load employee list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deptFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffService.createEmployee({
        ...createForm,
        departmentId: parseInt(createForm.departmentId, 10),
        baseSalary: parseFloat(createForm.baseSalary),
      });
      alert('Staff employee created successfully!');
      setAddModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create employee');
    }
  };

  const openEditModal = (emp) => {
    setSelectedEmp(emp);
    setEditForm({
      fullName: emp.fullName,
      phone: emp.phone || '',
      address: emp.address || '',
      dateOfBirth: emp.dateOfBirth || '',
      gender: emp.gender || '',
      departmentId: emp.departmentId,
      designation: emp.designation,
      employmentStatus: emp.employmentStatus,
      employmentType: emp.employmentType,
      baseSalary: emp.baseSalary,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffService.updateEmployee(selectedEmp.id, {
        ...editForm,
        departmentId: parseInt(editForm.departmentId, 10),
        baseSalary: parseFloat(editForm.baseSalary),
      });
      alert('Employee details updated!');
      setEditModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update employee');
    }
  };

  const handleToggleStatus = async (emp) => {
    const newStatus = emp.employmentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (!window.confirm(`Set employment status of ${emp.fullName} to ${newStatus}?`)) return;
    try {
      await staffService.updateStatus(emp.id, newStatus);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <DashboardLayout
      title="Staff Directory & Management"
      subtitle="Employee profiles, department assignments, and job designations"
    >
      <div className="view-header">
        <form onSubmit={handleSearchSubmit} className="filters-bar" style={{ margin: 0 }}>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, code or designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="TERMINATED">Terminated</option>
          </select>

          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <button onClick={() => setAddModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={18} /> Add New Employee
        </button>
      </div>

      {loading ? (
        <Loader message="Loading employees..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department & Role</th>
                <th>Contact Details</th>
                <th>Joining Date</th>
                <th>Monthly Salary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{e.fullName}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0F5132' }}>{e.employeeCode}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{e.designation}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{e.departmentName}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{e.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{e.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{e.joiningDate}</td>
                    <td style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F5132' }}>
                      {formatCurrency(e.baseSalary)}
                    </td>
                    <td>
                      <Badge type={e.employmentStatus}>{e.employmentStatus}</Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => { setSelectedEmp(e); setViewModalOpen(true); }}
                          className="btn btn-secondary btn-sm"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditModal(e)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Employee"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(e)}
                          className={`btn btn-sm ${e.employmentStatus === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                          title={e.employmentStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          {e.employmentStatus === 'ACTIVE' ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No staff records found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ADD EMPLOYEE MODAL ================= */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Employee"
        maxWidth="640px"
      >
        <form onSubmit={handleCreateSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Ramesh Kumar"
                value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Work Email *</label>
              <input
                type="email"
                required
                placeholder="ramesh@clubsphere.com"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Mobile Phone *</label>
              <input
                type="text"
                required
                placeholder="+91 9876543210"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Staff login password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                required
                value={createForm.departmentId}
                onChange={(e) => setCreateForm({ ...createForm, departmentId: e.target.value })}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Job Designation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Tennis Coach"
                value={createForm.designation}
                onChange={(e) => setCreateForm({ ...createForm, designation: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Joining Date *</label>
              <input
                type="date"
                required
                value={createForm.joiningDate}
                onChange={(e) => setCreateForm({ ...createForm, joiningDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                value={createForm.employmentType}
                onChange={(e) => setCreateForm({ ...createForm, employmentType: e.target.value })}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Salary (INR) *</label>
              <input
                type="number"
                required
                min={0}
                placeholder="45000"
                value={createForm.baseSalary}
                onChange={(e) => setCreateForm({ ...createForm, baseSalary: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              placeholder="City, State, PIN"
              value={createForm.address}
              onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setAddModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= EDIT EMPLOYEE MODAL ================= */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Employee Information"
        maxWidth="600px"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={editForm.departmentId}
                onChange={(e) => setEditForm({ ...editForm, departmentId: e.target.value })}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                required
                value={editForm.designation}
                onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Employment Status</label>
              <select
                value={editForm.employmentStatus}
                onChange={(e) => setEditForm({ ...editForm, employmentStatus: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Salary (INR)</label>
              <input
                type="number"
                min={0}
                value={editForm.baseSalary}
                onChange={(e) => setEditForm({ ...editForm, baseSalary: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Updates
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
