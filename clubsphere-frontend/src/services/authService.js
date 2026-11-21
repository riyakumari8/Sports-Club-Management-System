import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  },

  // Multi-stage student signup
  signupStage1: async (data) => {
    const res = await api.post('/auth/student/signup/stage1', data);
    return res.data;
  },

  verifySignupOtp: async (data) => {
    const res = await api.post('/auth/student/signup/verify-otp', data);
    return res.data;
  },

  completeStudentSignup: async (data) => {
    const res = await api.post('/auth/student/signup/complete', data);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  },

  // 7-day trial
  startTrial: async () => {
    const res = await api.post('/auth/student/trial/start');
    // Update local user state
    const stored = authService.getStoredUser();
    if (stored) {
      stored.trialStatus = 'ACTIVE';
      stored.trialDaysRemaining = 7;
      localStorage.setItem('user', JSON.stringify(stored));
    }
    return res.data;
  },

  getTrialStatus: async () => {
    const res = await api.get('/auth/student/trial/status');
    return res.data;
  },

  // Password reset
  requestPasswordReset: async (data) => {
    const res = await api.post('/auth/forgot-password/request', data);
    return res.data;
  },

  resetPasswordWithOtp: async (data) => {
    const res = await api.post('/auth/forgot-password/reset', data);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.post('/auth/change-password', data);
    return res.message;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem('token'),
};
