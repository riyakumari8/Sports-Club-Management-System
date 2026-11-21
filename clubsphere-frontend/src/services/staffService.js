import api from './api';

export const staffService = {
  // Staff Directory
  searchEmployees: async (query = '', departmentId = '', status = '') => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (departmentId) params.append('departmentId', departmentId);
    if (status) params.append('status', status);
    const res = await api.get(`/staff?${params.toString()}`);
    return res.data;
  },

  getEmployeeById: async (id) => {
    const res = await api.get(`/staff/${id}`);
    return res.data;
  },

  createEmployee: async (data) => {
    const res = await api.post('/staff', data);
    return res.data;
  },

  updateEmployee: async (id, data) => {
    const res = await api.put(`/staff/${id}`, data);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/staff/${id}/status?status=${status}`);
    return res.data;
  },

  getDepartments: async () => {
    const res = await api.get('/staff/departments');
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await api.get('/staff/dashboard');
    return res.data;
  },

  getMyStaffProfile: async () => {
    const res = await api.get('/staff/me');
    return res.data;
  },

  // Attendance
  markAttendance: async (data) => {
    const res = await api.post('/staff/attendance', data);
    return res.data;
  },

  getAttendanceHistory: async (employeeId, startDate, endDate) => {
    const params = new URLSearchParams({ employeeId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const res = await api.get(`/staff/attendance/history?${params.toString()}`);
    return res.data;
  },

  getDailyAttendance: async (date) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const res = await api.get(`/staff/attendance/daily?${params.toString()}`);
    return res.data;
  },

  // Leaves
  applyLeave: async (data) => {
    const res = await api.post('/staff/leaves/apply', data);
    return res.data;
  },

  getMyLeaves: async () => {
    const res = await api.get('/staff/leaves/my');
    return res.data;
  },

  getAllLeaves: async (status = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const res = await api.get(`/staff/leaves?${params.toString()}`);
    return res.data;
  },

  reviewLeave: async (id, data) => {
    const res = await api.patch(`/staff/leaves/${id}/review`, data);
    return res.data;
  },

  // Shifts
  getAllShifts: async () => {
    const res = await api.get('/staff/shifts');
    return res.data;
  },

  assignShift: async (data) => {
    const res = await api.post('/staff/shifts/assign', data);
    return res.data;
  },

  getDailySchedules: async (date) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const res = await api.get(`/staff/shifts/schedules?${params.toString()}`);
    return res.data;
  },

  // Salary
  createOrUpdateSalary: async (data) => {
    const res = await api.post('/staff/salary', data);
    return res.data;
  },

  getSalaryRecords: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const res = await api.get(`/staff/salary?${params.toString()}`);
    return res.data;
  },

  getEmployeeSalaryHistory: async (employeeId) => {
    const res = await api.get(`/staff/salary/employee/${employeeId}`);
    return res.data;
  },
};
