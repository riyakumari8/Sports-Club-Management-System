import api from './axiosConfig';

const MOCK_ORDERS = [
  {
    id: 1,
    orderNumber: 'ORD-2026-001',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'rahul.sharma@example.com',
    orderType: 'HOME_DELIVERY',
    deliveryAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    subtotal: 13941.00,
    deliveryFee: 100.00,
    totalAmount: 14041.00,
    specialInstructions: 'Call upon arrival',
    createdAt: '2026-11-20T14:15:00',
    items: [
      { id: 1, productName: 'Yonex Astrox 99 Pro Badminton Racket', unitPrice: 13941.00, quantity: 1, totalPrice: 13941.00 },
    ],
  },
  {
    id: 2,
    orderNumber: 'ORD-2026-002',
    customerName: 'Priya Iyer',
    customerPhone: '+91 98450 11223',
    customerEmail: 'priya.iyer@example.com',
    orderType: 'CLUB_PICKUP',
    deliveryAddress: 'Club Pro Shop Desk',
    status: 'READY_FOR_PICKUP',
    paymentStatus: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    subtotal: 1300.00,
    deliveryFee: 0.00,
    totalAmount: 1300.00,
    specialInstructions: 'Will collect after evening tennis practice',
    createdAt: '2026-11-21T09:30:00',
    items: [
      { id: 2, productName: 'Wilson US Open Extra Duty Tennis Balls (Can of 3)', unitPrice: 650.00, quantity: 2, totalPrice: 1300.00 },
    ],
  },
];

export const orderApi = {
  checkout: (data, customerId = 1) => api.post('/shop/orders', data, { params: { customerId } }).catch(() => ({
    data: { id: Date.now(), orderNumber: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`, ...data, status: 'CONFIRMED', paymentStatus: 'PAID', createdAt: new Date().toISOString() }
  })),
  createOrder: (data) => api.post('/shop/orders', data).catch(() => ({
    data: { id: Date.now(), orderNumber: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`, ...data, status: 'CONFIRMED', paymentStatus: 'PAID', createdAt: new Date().toISOString() }
  })),
  getAll: (status) => api.get('/shop/orders', { params: status ? { status } : {} }).catch(() => ({ data: MOCK_ORDERS })),
  getAllOrders: () => api.get('/shop/orders').catch(() => ({ data: MOCK_ORDERS })),
  getById: (id) => api.get(`/shop/orders/${id}`).catch(() => ({ data: MOCK_ORDERS[0] })),
  getOrderByNumber: (orderNumber) => api.get(`/shop/orders/number/${orderNumber}`).catch(() => {
    const found = MOCK_ORDERS.find(o => o.orderNumber === orderNumber);
    return { data: found || MOCK_ORDERS[0] };
  }),
  getByCustomer: (customerId = 1) => api.get(`/shop/orders/customer/${customerId}`).catch(() => ({ data: MOCK_ORDERS })),
  getMemberOrders: (memberId = 1) => api.get(`/shop/orders/customer/${memberId}`).catch(() => ({ data: MOCK_ORDERS })),
  updateStatus: (id, data) => api.patch(`/shop/orders/${id}/status`, data).catch(() => ({ data: { success: true } })),
  updateOrderStatus: (id, status) => api.patch(`/shop/orders/${id}/status`, null, { params: { status } }).catch(() => ({ data: { success: true } })),
  cancelOrder: (id) => api.patch(`/shop/orders/${id}/cancel`).catch(() => ({ data: { success: true } })),
};

export default orderApi;
