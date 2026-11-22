import api from './api';

export const sportsShopStaffService = {
  // Products
  getProducts: async (params = {}) => {
    const response = await api.get('/api/sports-shop/products', { params });
    return response.data?.data || response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/api/sports-shop/products/${id}`);
    return response.data?.data || response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.patch(`/api/sports-shop/products/${id}`, data);
    return response.data?.data || response.data;
  },

  // Inventory & Stock movements
  getInventoryMovements: async () => {
    const response = await api.get('/api/sports-shop/inventory');
    return response.data?.data || response.data;
  },

  adjustStock: async (adjustmentData) => {
    const response = await api.post('/api/sports-shop/inventory/adjustments', adjustmentData);
    return response.data?.data || response.data;
  },

  // Orders & Workflow status transitions
  getOrders: async (params = {}) => {
    const response = await api.get('/api/sports-shop/orders', { params });
    return response.data?.data || response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/api/sports-shop/orders/${id}`);
    return response.data?.data || response.data;
  },

  updateOrderStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/api/sports-shop/orders/${id}/status`, { status, notes });
    return response.data?.data || response.data;
  },

  // Counter POS Sale
  createCounterSale: async (saleData) => {
    const response = await api.post('/api/sports-shop/counter-sales', saleData);
    return response.data?.data || response.data;
  },

  // Returns & Exchanges
  getReturns: async () => {
    const response = await api.get('/api/sports-shop/returns');
    return response.data?.data || response.data;
  },

  reviewReturn: async (id, reviewData) => {
    const response = await api.post(`/api/sports-shop/returns/${id}/review`, reviewData);
    return response.data?.data || response.data;
  },

  // Sales & Inventory reports
  getSalesReport: async () => {
    const response = await api.get('/api/sports-shop/reports/sales');
    return response.data?.data || response.data;
  },

  // Equipment rental / court bookings read-only view
  getEquipmentBookings: async () => {
    const response = await api.get('/api/sports-shop/bookings');
    return response.data?.data || response.data;
  }
};

export default sportsShopStaffService;
