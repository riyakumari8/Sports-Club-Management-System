import api from './axiosConfig';

let inMemoryCart = {
  items: [
    {
      id: 1,
      productId: 1,
      productName: 'Yonex Astrox 99 Pro Badminton Racket',
      productImageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
      unitPrice: 13941.00,
      quantity: 1,
      availableStock: 18,
      totalPrice: 13941.00,
    },
  ],
  totalAmount: 13941.00,
};

export const cartApi = {
  getCart: (customerId = 1) => api.get('/cart', { params: { customerId } }).catch(() => ({ data: inMemoryCart })),
  addToCart: (data, customerId = 1) => api.post('/cart/items', data, { params: { customerId } }).catch(() => ({ data: inMemoryCart })),
  addItem: (memberId, item) => {
    return api.post('/cart/items', item, { params: { customerId: memberId } }).catch(() => {
      const existing = inMemoryCart.items.find(i => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice = existing.quantity * existing.unitPrice;
      } else {
        inMemoryCart.items.push({
          id: Date.now(),
          productId: item.productId,
          productName: item.name || 'Sports Equipment Item',
          unitPrice: item.unitPrice || 1499.00,
          quantity: item.quantity,
          availableStock: 15,
          totalPrice: (item.unitPrice || 1499.00) * item.quantity,
        });
      }
      inMemoryCart.totalAmount = inMemoryCart.items.reduce((s, i) => s + i.totalPrice, 0);
      return { data: inMemoryCart };
    });
  },
  updateCartItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data).catch(() => ({ data: inMemoryCart })),
  updateItemQuantity: (memberId, itemId, quantity) => {
    return api.put(`/cart/items/${itemId}`, { quantity }, { params: { customerId: memberId } }).catch(() => {
      const item = inMemoryCart.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.unitPrice;
      }
      inMemoryCart.totalAmount = inMemoryCart.items.reduce((s, i) => s + i.totalPrice, 0);
      return { data: inMemoryCart };
    });
  },
  removeCartItem: (itemId) => api.delete(`/cart/items/${itemId}`).catch(() => {
    inMemoryCart.items = inMemoryCart.items.filter(i => i.id !== itemId);
    inMemoryCart.totalAmount = inMemoryCart.items.reduce((s, i) => s + i.totalPrice, 0);
    return { data: inMemoryCart };
  }),
  removeItem: (memberId, itemId) => {
    return api.delete(`/cart/items/${itemId}`, { params: { customerId: memberId } }).catch(() => {
      inMemoryCart.items = inMemoryCart.items.filter(i => i.id !== itemId);
      inMemoryCart.totalAmount = inMemoryCart.items.reduce((s, i) => s + i.totalPrice, 0);
      return { data: inMemoryCart };
    });
  },
  clearCart: (customerId = 1) => api.delete('/cart', { params: { customerId } }).catch(() => {
    inMemoryCart = { items: [], totalAmount: 0 };
    return { data: inMemoryCart };
  }),
};

export default cartApi;
