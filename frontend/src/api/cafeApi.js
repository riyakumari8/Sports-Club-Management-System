import api from './axiosConfig';

const MOCK_TABLES = [
  { id: 1, tableNumber: 1, capacity: 4, location: 'Indoor Dining', status: 'OCCUPIED' },
  { id: 2, tableNumber: 2, capacity: 2, location: 'Indoor Dining', status: 'AVAILABLE' },
  { id: 3, tableNumber: 3, capacity: 4, location: 'Poolside Terrace', status: 'RESERVED' },
  { id: 4, tableNumber: 4, capacity: 6, location: 'Poolside Terrace', status: 'AVAILABLE' },
  { id: 5, tableNumber: 5, capacity: 2, location: 'Sports Bar Lounge', status: 'AVAILABLE' },
  { id: 6, tableNumber: 6, capacity: 8, location: 'Sports Bar Lounge', status: 'OCCUPIED' },
  { id: 7, tableNumber: 7, capacity: 4, location: 'Rooftop Deck', status: 'CLEANING' },
  { id: 8, tableNumber: 8, capacity: 4, location: 'Rooftop Deck', status: 'AVAILABLE' },
];

const MOCK_MENU_CATEGORIES = [
  { id: 1, name: 'Beverages & Shakes' },
  { id: 2, name: 'Healthy Snacks' },
  { id: 3, name: 'Main Food & Bowls' },
  { id: 4, name: 'Desserts' },
  { id: 5, name: 'Combo Meals' },
];

const MOCK_MENU_ITEMS = [
  { id: 1, name: 'Berry Blast Whey Protein Smoothie', categoryId: 1, categoryName: 'Beverages & Shakes', price: 280.00, discount: 0, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80', description: 'Hydrolyzed whey isolate with blueberries, strawberries and almond milk.' },
  { id: 2, name: 'Grilled Chicken Quinoa Power Bowl', categoryId: 3, categoryName: 'Main Food & Bowls', price: 420.00, discount: 10, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', description: 'Marinated herb chicken breast, organic quinoa, avocado and lemon tahini dressing.' },
  { id: 3, name: 'Avocado Sourdough Toast & Poached Egg', categoryId: 2, categoryName: 'Healthy Snacks', price: 320.00, discount: 0, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', description: 'Artisan sourdough with hass avocado, chili flakes and pasture-raised eggs.' },
  { id: 4, name: 'Cold Brew Citrus Tonic', categoryId: 1, categoryName: 'Beverages & Shakes', price: 210.00, discount: 0, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80', description: '18-hour steeped single-origin arabica with tonic water and orange twist.' },
  { id: 5, name: 'High-Protein Paneer Tikka Wrap', categoryId: 3, categoryName: 'Main Food & Bowls', price: 360.00, discount: 0, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80', description: 'Tandoori cottage cheese cubes wrapped in whole-wheat flatbread with mint chutney.' },
  { id: 6, name: 'Matcha Chia Seed Coconut Pudding', categoryId: 4, categoryName: 'Desserts', price: 240.00, discount: 5, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80', description: 'Superfood chia soaked in coconut milk with Japanese ceremonial grade matcha.' },
];

const MOCK_ORDERS = [
  {
    id: 1,
    orderNumber: 'CF-2026-081',
    orderType: 'DINE_IN',
    tableId: 1,
    tableNumber: 1,
    customerName: 'Coach Vikram & Team',
    status: 'PREPARING',
    totalAmount: 980.00,
    specialInstructions: 'Make smoothies extra cold, dressing on side',
    createdAt: '2026-11-21T16:30:00',
    items: [
      { id: 1, menuItemName: 'Berry Blast Whey Protein Smoothie', unitPrice: 280.00, quantity: 2, totalPrice: 560.00 },
      { id: 2, menuItemName: 'Grilled Chicken Quinoa Power Bowl', unitPrice: 420.00, quantity: 1, totalPrice: 420.00 },
    ],
  },
  {
    id: 2,
    orderNumber: 'CF-2026-082',
    orderType: 'TAKEAWAY',
    customerName: 'Ananya Roy',
    status: 'READY',
    totalAmount: 530.00,
    specialInstructions: 'Pack in eco-friendly takeaway boxes',
    createdAt: '2026-11-21T16:45:00',
    items: [
      { id: 3, menuItemName: 'Avocado Sourdough Toast & Poached Egg', unitPrice: 320.00, quantity: 1, totalPrice: 320.00 },
      { id: 4, menuItemName: 'Cold Brew Citrus Tonic', unitPrice: 210.00, quantity: 1, totalPrice: 210.00 },
    ],
  },
];

const MOCK_TABS = [
  { id: 1, tableId: 1, tableNumber: 1, customerName: 'Coach Vikram & Team', totalAmount: 980.00, status: 'OPEN', isClosed: false, createdAt: '2026-11-21T16:15:00' },
  { id: 2, tableId: 6, tableNumber: 6, customerName: 'Weekend Badminton Club', totalAmount: 1840.00, status: 'OPEN', isClosed: false, createdAt: '2026-11-21T15:45:00' },
];

export const cafeApi = {
  // Menu
  getMenuItems: (categoryId) => api.get('/cafe/menu', { params: categoryId ? { categoryId } : {} }).catch(() => ({ data: MOCK_MENU_ITEMS })),
  getAllMenuItems: () => api.get('/cafe/menu').catch(() => ({ data: MOCK_MENU_ITEMS })),
  createMenuItem: (data) => api.post('/cafe/menu', data).catch(() => ({ data: { id: Date.now(), ...data } })),
  updateMenuItem: (id, data) => api.put(`/cafe/menu/${id}`, data).catch(() => ({ data })),
  deleteMenuItem: (id) => api.delete(`/cafe/menu/${id}`).catch(() => ({ data: { success: true } })),
  toggleAvailability: (id, isAvailable) => api.patch(`/cafe/menu/${id}/availability`, null, { params: { isAvailable } }).catch(() => ({ data: { success: true } })),

  // Categories
  getCategories: () => api.get('/cafe/menu/categories').catch(() => ({ data: MOCK_MENU_CATEGORIES })),
  getAllMenuCategories: () => api.get('/cafe/menu/categories').catch(() => ({ data: MOCK_MENU_CATEGORIES })),
  createCategory: (data) => api.post('/cafe/menu/categories', data).catch(() => ({ data: { id: Date.now(), ...data } })),
  updateCategory: (id, data) => api.put(`/cafe/menu/categories/${id}`, data).catch(() => ({ data })),

  // Tables
  getTables: (status) => api.get('/cafe/tables', { params: status ? { status } : {} }).catch(() => ({ data: MOCK_TABLES })),
  getAllTables: () => api.get('/cafe/tables').catch(() => ({ data: MOCK_TABLES })),
  createTable: (data) => api.post('/cafe/tables', data).catch(() => ({ data: { id: Date.now(), ...data } })),
  updateTable: (id, data) => api.put(`/cafe/tables/${id}`, data).catch(() => ({ data })),
  updateTableStatus: (id, status) => api.patch(`/cafe/tables/${id}/status`, null, { params: { status } }).catch(() => ({ data: { success: true } })),

  // Orders
  getOrders: (status) => api.get('/cafe/orders', { params: status ? { status } : {} }).catch(() => ({ data: MOCK_ORDERS })),
  getAllOrders: () => api.get('/cafe/orders').catch(() => ({ data: MOCK_ORDERS })),
  getOrderById: (id) => api.get(`/cafe/orders/${id}`).catch(() => {
    const found = MOCK_ORDERS.find(o => String(o.id) === String(id));
    return { data: found || MOCK_ORDERS[0] };
  }),
  createOrder: (data) => api.post('/cafe/orders', data).catch(() => ({ data: { id: Date.now(), ...data, status: 'PENDING' } })),
  updateOrderStatus: (id, status) => api.patch(`/cafe/orders/${id}/status`, null, { params: { status } }).catch(() => ({ data: { success: true } })),
  getKitchenOrders: () => api.get('/cafe/orders/kitchen').catch(() => ({ data: MOCK_ORDERS })),
  recordPayment: (data) => api.post('/cafe/payments', data).catch(() => ({ data: { success: true } })),
  recordSplitBill: (data) => api.post('/cafe/payments/split', data).catch(() => ({ data: { success: true } })),
  splitBill: (orderId, data) => api.post(`/cafe/orders/${orderId}/split-bill`, data).catch(() => ({ data: { success: true } })),
  processPayment: (orderId, data) => api.post(`/cafe/orders/${orderId}/payment`, data).catch(() => ({ data: { success: true } })),
  getPayments: (orderId) => api.get(`/cafe/orders/${orderId}/payments`).catch(() => ({ data: [] })),

  // Tabs
  getAllTabs: () => api.get('/cafe/tabs').catch(() => ({ data: MOCK_TABS })),
  openTab: (data) => api.post('/cafe/tabs', data).catch(() => ({ data: { id: Date.now(), ...data, status: 'OPEN' } })),
  getTab: (id) => api.get(`/cafe/tabs/${id}`).catch(() => ({ data: MOCK_TABS[0] })),
  closeTab: (id, data) => api.patch(`/cafe/tabs/${id}/close`, data).catch(() => ({ data: { success: true } })),
  getOpenTabs: () => api.get('/cafe/tabs/open').catch(() => ({ data: MOCK_TABS.filter(t => t.status === 'OPEN') })),

  // Sales
  getDailySales: (date) => api.get('/cafe/sales/daily', { params: { date } }).catch(() => ({
    data: {
      date: date || '2026-11-21',
      totalSales: 8450.00,
      orderCount: 18,
      dineInCount: 12,
      takeawayCount: 6,
      popularItems: [
        { itemName: 'Berry Blast Whey Protein Smoothie', quantitySold: 14, revenue: 3920.00 },
        { itemName: 'Grilled Chicken Quinoa Power Bowl', quantitySold: 9, revenue: 3780.00 },
        { itemName: 'Cold Brew Citrus Tonic', quantitySold: 6, revenue: 1260.00 },
      ],
    }
  })),
};

export default cafeApi;
