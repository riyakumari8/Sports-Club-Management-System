import api from './api';

export const notificationService = {
  getMyNotifications: async (params = {}) => {
    const res = await api.get('/notifications', { params });
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },

  dismissNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },

  clearReadNotifications: async () => {
    const res = await api.delete('/notifications/clear-read');
    return res.data;
  },

  broadcastNotification: async (data) => {
    const res = await api.post('/notifications/broadcast', null, { params: data });
    return res.data;
  },

  triggerDemoExpiryCheck: async () => {
    const res = await api.post('/notifications/trigger-demo-expiry-check');
    return res.data;
  },
};

export default notificationService;
