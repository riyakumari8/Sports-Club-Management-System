import api from './api';

export const membershipService = {
  // Plans
  getActivePlans: async () => {
    const res = await api.get('/memberships/plans');
    return res.data;
  },

  getAllPlansAdmin: async () => {
    const res = await api.get('/memberships/plans/admin/all');
    return res.data;
  },

  getPlanById: async (id) => {
    const res = await api.get(`/memberships/plans/${id}`);
    return res.data;
  },

  createPlan: async (planData) => {
    const res = await api.post('/memberships/plans', planData);
    return res.data;
  },

  updatePlan: async (id, planData) => {
    const res = await api.put(`/memberships/plans/${id}`, planData);
    return res.data;
  },

  // Memberships
  registerMembership: async (data) => {
    const res = await api.post('/memberships/register', data);
    return res.data;
  },

  renewMembership: async (id, data) => {
    const res = await api.post(`/memberships/${id}/renew`, data);
    return res.data;
  },

  getMyMemberships: async () => {
    const res = await api.get('/memberships/my');
    return res.data;
  },

  getAllMemberships: async () => {
    const res = await api.get('/memberships/all');
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await api.get('/memberships/dashboard');
    return res.data;
  },

  getQrMembershipCard: async (id) => {
    const res = await api.get(`/memberships/${id}/card`);
    return res.data;
  },
};
