import api from './api';

export const courtService = {
  // Courts
  getCourts: async (params) => {
    return await api.get('/courts', { params });
  },

  getCourtById: async (id) => {
    return await api.get(`/courts/${id}`);
  },

  createCourt: async (data) => {
    return await api.post('/courts', data);
  },

  updateCourt: async (id, data) => {
    return await api.put(`/courts/${id}`, data);
  },

  updateCourtStatus: async (id, status) => {
    return await api.patch(`/courts/${id}/status`, { status });
  },

  deactivateCourt: async (id) => {
    return await api.delete(`/courts/${id}`);
  },

  getCourtAvailability: async (id, date) => {
    return await api.get(`/courts/${id}/availability`, { params: { date } });
  },

  scheduleCourtMaintenance: async (id, data) => {
    return await api.post(`/courts/${id}/maintenance`, data);
  },

  getMaintenanceHistory: async (id) => {
    return await api.get(`/courts/${id}/maintenance`);
  },

  // Bookings
  createBooking: async (data) => {
    return await api.post('/bookings', data);
  },

  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  getMyBookings: async (memberId = 1) => {
    return await api.get('/bookings/my', { params: { memberId } });
  },

  getAllBookings: async (params) => {
    return await api.get('/bookings/all', { params });
  },

  rescheduleBooking: async (id, data) => {
    return await api.put(`/bookings/${id}/reschedule`, data);
  },

  cancelBooking: async (id, reason) => {
    return await api.patch(`/bookings/${id}/cancel`, { reason });
  },

  checkInBookingById: async (id) => {
    return await api.post(`/bookings/${id}/check-in`);
  },

  checkInByCode: async (code) => {
    return await api.post('/bookings/check-in', { code });
  },

  joinWaitlist: async (data) => {
    return await api.post('/bookings/waitlist', data);
  },

  getMyWaitlist: async (memberId = 1) => {
    return await api.get('/bookings/waitlist/my', { params: { memberId } });
  },

  // Friday Social Play
  getSocialPlaySessions: async () => {
    return await api.get('/social-play');
  },

  getSocialPlaySessionById: async (id) => {
    return await api.get(`/social-play/${id}`);
  },

  createSocialPlaySession: async (data) => {
    return await api.post('/social-play', data);
  },

  joinSocialPlaySession: async (id, data) => {
    return await api.post(`/social-play/${id}/join`, data);
  },

  leaveSocialPlaySession: async (id, participantId) => {
    return await api.delete(`/social-play/${id}/leave/${participantId}`);
  },

  // Enquiries & CRM
  submitEnquiry: async (data) => {
    return await api.post('/enquiries', data);
  },

  getEnquiries: async (params) => {
    return await api.get('/enquiries', { params });
  },

  getEnquiryById: async (id) => {
    return await api.get(`/enquiries/${id}`);
  },

  updateEnquiryStatus: async (id, status) => {
    return await api.patch(`/enquiries/${id}/status`, { status });
  },

  addEnquiryFollowup: async (id, data) => {
    return await api.post(`/enquiries/${id}/followups`, data);
  },

  getEnquiryFollowups: async (id) => {
    return await api.get(`/enquiries/${id}/followups`);
  },

  convertEnquiryToMember: async (id) => {
    return await api.post(`/enquiries/${id}/convert`);
  },

  // Trial Bookings
  submitTrialBooking: async (data) => {
    return await api.post('/trial-bookings', data);
  },

  getTrialBookings: async () => {
    return await api.get('/trial-bookings');
  },

  updateTrialBookingStatus: async (id, data) => {
    return await api.patch(`/trial-bookings/${id}/status`, data);
  },

  // Public Facilities
  getPublicFacilities: async () => {
    return await api.get('/public/facilities');
  },
};
