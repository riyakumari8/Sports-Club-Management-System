import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Courts API
export const getCourts = (params) => api.get('/courts', { params });
export const getCourtById = (id) => api.get(`/courts/${id}`);
export const createCourt = (data) => api.post('/courts', data);
export const updateCourt = (id, data) => api.put(`/courts/${id}`, data);
export const updateCourtStatus = (id, status) => api.patch(`/courts/${id}/status`, { status });
export const deactivateCourt = (id) => api.delete(`/courts/${id}`);
export const getCourtAvailability = (id, date) => api.get(`/courts/${id}/availability`, { params: { date } });
export const scheduleCourtMaintenance = (id, data) => api.post(`/courts/${id}/maintenance`, data);
export const getCourtMaintenanceHistory = (id) => api.get(`/courts/${id}/maintenance`);

// Bookings API
export const createBooking = (data) => api.post('/bookings', data);
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const getMyBookings = (memberId = 101) => api.get('/bookings/my', { params: { memberId } });
export const getAllBookings = (params) => api.get('/bookings/all', { params });
export const rescheduleBooking = (id, data) => api.put(`/bookings/${id}/reschedule`, data);
export const cancelBooking = (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason });
export const checkInBookingById = (id) => api.post(`/bookings/${id}/check-in`);
export const checkInByCode = (code) => api.post('/bookings/check-in', { code });
export const joinWaitlist = (data) => api.post('/bookings/waitlist', data);
export const getMyWaitlist = (memberId = 101) => api.get('/bookings/waitlist/my', { params: { memberId } });

// Friday Social Play API
export const getSocialPlaySessions = () => api.get('/social-play');
export const getSocialPlaySessionById = (id) => api.get(`/social-play/${id}`);
export const createSocialPlaySession = (data) => api.post('/social-play', data);
export const joinSocialPlaySession = (id, data) => api.post(`/social-play/${id}/join`, data);
export const leaveSocialPlaySession = (id, participantId) => api.delete(`/social-play/${id}/leave/${participantId}`);
export const getSocialPlayParticipants = (id) => api.get(`/social-play/${id}/participants`);

// Public Website API
export const getPublicFacilities = () => api.get('/public/facilities');
export const getPublicMembershipPlans = () => api.get('/public/membership-plans');
export const getPublicShopPreview = () => api.get('/public/shop-preview');
export const getPublicTestimonials = () => api.get('/public/testimonials');
export const getPublicFaqs = () => api.get('/public/faqs');

// Enquiries & CRM API
export const submitEnquiry = (data) => api.post('/enquiries', data);
export const getEnquiries = (params) => api.get('/enquiries', { params });
export const getEnquiryById = (id) => api.get(`/enquiries/${id}`);
export const updateEnquiryStatus = (id, status) => api.patch(`/enquiries/${id}/status`, { status });
export const addEnquiryFollowup = (id, data) => api.post(`/enquiries/${id}/followups`, data);
export const getEnquiryFollowups = (id) => api.get(`/enquiries/${id}/followups`);
export const convertEnquiryToMember = (id) => api.post(`/enquiries/${id}/convert`);

// Trial Bookings API
export const submitTrialBooking = (data) => api.post('/trial-bookings', data);
export const getTrialBookings = () => api.get('/trial-bookings');
export const updateTrialBookingStatus = (id, data) => api.patch(`/trial-bookings/${id}/status`, data);

export default api;
