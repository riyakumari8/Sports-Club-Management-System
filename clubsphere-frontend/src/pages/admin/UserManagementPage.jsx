import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { userService } from '../../services/userService';
import { Search, Filter, Edit, Eye, UserX, UserCheck, Shield, Phone, Mail, MapPin, Calendar } from 'lucide-react';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    roles: [],
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(searchQuery, statusFilter);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to set status of ${user.fullName} to ${newStatus}?`)) {
      return;
    }

    try {
      await userService.updateUserStatus(user.id, newStatus);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      phone: user.phone || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || 'Other',
      roles: user.roles || ['ROLE_MEMBER'],
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(selectedUser.id, editFormData);
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  const handleRoleToggle = (role) => {
    setEditFormData((prev) => {
      const current = prev.roles || [];
      if (current.includes(role)) {
        if (current.length === 1) return prev; // Keep at least one role
        return { ...prev, roles: current.filter((r) => r !== role) };
      } else {
        return { ...prev, roles: [...current, role] };
      }
    });
  };

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Search, view profiles, assign roles and manage accounts"
    >
      {/* Top Search & Filter Bar */}
      <div className="view-header">
        <form onSubmit={handleSearchSubmit} className="filters-bar" style={{ margin: 0 }}>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Showing <strong>{users.length}</strong> registered accounts
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader message="Fetching users..." />
      ) : (
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Contact Info</th>
                <th>Assigned Roles</th>
                <th>Status</th>
                <th>Joined On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID #{u.id}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{u.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{u.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {u.roles?.map((r) => (
                          <span
                            key={r}
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: r === 'ROLE_ADMIN' ? '#fee2e2' : r === 'ROLE_STAFF' ? '#dbeafe' : '#e5e7eb',
                              color: r === 'ROLE_ADMIN' ? '#991b1b' : r === 'ROLE_STAFF' ? '#1e40af' : '#374151',
                            }}
                          >
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <Badge type={u.status}>{u.status}</Badge>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openViewModal(u)}
                          className="btn btn-secondary btn-sm"
                          title="View Profile"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Information & Roles"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                          title={u.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {u.status === 'ACTIVE' ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No users matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= VIEW PROFILE MODAL ================= */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="User Profile Details"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
                {selectedUser.fullName?.[0]}
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937' }}>{selectedUser.fullName}</h4>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  <Badge type={selectedUser.status}>{selectedUser.status}</Badge>
                  {selectedUser.roles?.map((r) => (
                    <span key={r} style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#f3f4f6', borderRadius: '4px', fontWeight: 600 }}>
                      {r.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</span>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Mail size={15} color="#0F5132" /> {selectedUser.email}
                </div>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone</span>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Phone size={15} color="#0F5132" /> {selectedUser.phone}
                </div>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date of Birth</span>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Calendar size={15} color="#0F5132" /> {selectedUser.dateOfBirth || 'Not specified'}
                </div>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Gender</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {selectedUser.gender || 'Not specified'}
                </div>
              </div>
            </div>

            <div>
              <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Address</span>
              <div style={{ fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '4px', background: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>
                <MapPin size={16} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{selectedUser.address || 'No registered address on file'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setViewModalOpen(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= EDIT USER MODAL ================= */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit User & Roles"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={editFormData.fullName}
              onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Mobile Phone</label>
              <input
                type="text"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                value={editFormData.dateOfBirth}
                onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              value={editFormData.address}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign Roles (Multi-select)</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_MEMBER'].map((role) => {
                const selected = editFormData.roles?.includes(role);
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => handleRoleToggle(role)}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: selected ? '2px solid #0F5132' : '1px solid #d1d5db',
                      background: selected ? '#d1e7dd' : '#ffffff',
                      color: selected ? '#073b22' : '#4b5563',
                    }}
                  >
                    {selected ? '✓ ' : '+ '} {role.replace('ROLE_', '')}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
