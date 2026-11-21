import api from './api';

export const discoveryService = {
  getPromotions: async (category, status) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    const res = await api.get(`/promotions?${params.toString()}`);
    return res.data?.data || res.data;
  },

  getActivePromotions: async () => {
    const res = await api.get('/promotions/active');
    return res.data?.data || res.data;
  },

  getShopProducts: async (shopType, category, search) => {
    const params = new URLSearchParams();
    if (shopType) params.append('shopType', shopType);
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const res = await api.get(`/shops/products?${params.toString()}`);
    return res.data?.data || res.data;
  },

  placeShopOrder: async (orderData) => {
    const res = await api.post('/shops/order', orderData);
    return res.data?.data || res.data;
  },
};
