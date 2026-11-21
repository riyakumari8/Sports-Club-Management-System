import api from './api';

export const financeService = {
  getDashboard: async (params = {}) => {
    const res = await api.get('/finance/dashboard', { params });
    return res.data;
  },

  getPayments: async (params = {}) => {
    const res = await api.get('/finance/payments', { params });
    return res.data;
  },

  getPaymentById: async (id) => {
    const res = await api.get(`/finance/payments/${id}`);
    return res.data;
  },

  processRefund: async (id, data) => {
    const res = await api.post(`/finance/payments/${id}/refund`, data);
    return res.data;
  },

  simulatePayment: async (data) => {
    const res = await api.post('/finance/payments/simulate', data);
    return res.data;
  },

  getExpenses: async (params = {}) => {
    const res = await api.get('/finance/expenses', { params });
    return res.data;
  },

  createExpense: async (data) => {
    const res = await api.post('/finance/expenses', data);
    return res.data;
  },

  updateExpense: async (id, data) => {
    const res = await api.put(`/finance/expenses/${id}`, data);
    return res.data;
  },

  deleteExpense: async (id) => {
    const res = await api.delete(`/finance/expenses/${id}`);
    return res.data;
  },

  getReport: async (reportType, params = {}) => {
    const res = await api.get(`/finance/reports/${reportType}`, { params });
    return res.data;
  },

  getReconciliation: async () => {
    const res = await api.get('/finance/reconciliation');
    return res.data;
  },

  getMyPayments: async () => {
    const res = await api.get('/finance/my-payments');
    return res.data;
  },
};

export default financeService;
