import api from './api';

export const staffDepartmentService = {
  // Department-isolated dashboard metrics
  getStaffDashboard: async (adminOverview = false) => {
    const response = await api.get(`/api/staff/dashboard?adminOverview=${adminOverview}`);
    return response.data?.data || response.data;
  },

  // Permissions & Profile
  getMyPermissions: async () => {
    const response = await api.get('/api/staff/permissions');
    return response.data?.data || response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/api/staff/me');
    return response.data?.data || response.data;
  },

  updateProfile: async (payload) => {
    const response = await api.patch('/api/staff/profile', payload);
    return response.data?.data || response.data;
  },

  // Real-time Attendance Clock-in / Clock-out
  clockIn: async () => {
    const response = await api.post('/api/staff/attendance/clock-in');
    return response.data?.data || response.data;
  },

  clockOut: async () => {
    const response = await api.post('/api/staff/attendance/clock-out');
    return response.data?.data || response.data;
  },

  getMyAttendanceHistory: async () => {
    const response = await api.get('/api/staff/attendance/my-history');
    return response.data?.data || response.data;
  },

  getMyShifts: async () => {
    const response = await api.get('/api/staff/shifts/my-shifts');
    return response.data?.data || response.data;
  },

  // Support Tickets
  getSupportTickets: async () => {
    const response = await api.get('/api/staff/support');
    return response.data?.data || response.data;
  },

  createSupportTicket: async (ticketData) => {
    const response = await api.post('/api/staff/support', ticketData);
    return response.data?.data || response.data;
  },

  updateTicketStatus: async (ticketId, statusData) => {
    const response = await api.patch(`/api/staff/support/${ticketId}/status`, statusData);
    return response.data?.data || response.data;
  }
};

export default staffDepartmentService;
