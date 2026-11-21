import api from './api';

export const userService = {
  getAllUsers: async (query = '', status = '') => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    const res = await api.get(`/users?${params.toString()}`);
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  updateUserStatus: async (id, status) => {
    const res = await api.patch(`/users/${id}/status`, { status });
    return res.data;
  },

  getMyProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateMyProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
};
