import api from './api';

export const foodShopStaffService = {
  // Menu
  getMenu: async (params = {}) => {
    const response = await api.get('/api/food-shop/menu', { params });
    return response.data?.data || response.data;
  },

  toggleAvailability: async (id, isAvailable) => {
    const response = await api.patch(`/api/food-shop/menu/${id}/availability`, { isAvailable });
    return response.data?.data || response.data;
  },

  updateMenuItem: async (id, data) => {
    const response = await api.patch(`/api/food-shop/menu/${id}`, data);
    return response.data?.data || response.data;
  },

  // Tables
  getTables: async () => {
    const response = await api.get('/api/food-shop/tables');
    return response.data?.data || response.data;
  },

  updateTableStatus: async (id, status, currentOrderId = null) => {
    const response = await api.patch(`/api/food-shop/tables/${id}`, { status, currentOrderId });
    return response.data?.data || response.data;
  },

  // Orders & Kitchen Workflow
  getOrders: async (params = {}) => {
    const response = await api.get('/api/food-shop/orders', { params });
    return response.data?.data || response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/api/food-shop/orders/${id}`);
    return response.data?.data || response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/api/food-shop/orders/${id}/status`, { status });
    return response.data?.data || response.data;
  },

  // Kitchen Ingredients Inventory
  getInventory: async () => {
    const response = await api.get('/api/food-shop/inventory');
    return response.data?.data || response.data;
  },

  adjustIngredientStock: async (adjustmentData) => {
    const response = await api.post('/api/food-shop/inventory/adjustments', adjustmentData);
    return response.data?.data || response.data;
  },

  // Billing & Split Bills
  createBill: async (billData) => {
    const response = await api.post('/api/food-shop/bills', billData);
    return response.data?.data || response.data;
  },

  getBills: async () => {
    const response = await api.get('/api/food-shop/bills');
    return response.data?.data || response.data;
  },

  // Reports
  getSalesReport: async () => {
    const response = await api.get('/api/food-shop/reports/sales');
    return response.data?.data || response.data;
  },

  getPreparationTimesReport: async () => {
    const response = await api.get('/api/food-shop/reports/preparation-times');
    return response.data?.data || response.data;
  }
};

export default foodShopStaffService;
