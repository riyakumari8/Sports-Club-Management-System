import api from './axiosConfig';

export const counterSaleApi = {
  createSale: (data) => api.post('/shop/counter-sales', data),
  getAll: () => api.get('/shop/counter-sales'),
  getById: (id) => api.get(`/shop/counter-sales/${id}`),
};

export default counterSaleApi;
