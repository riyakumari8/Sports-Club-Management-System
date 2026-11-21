import api from './axiosConfig';

const MOCK_INVENTORY = [
  { id: 1, productId: 1, productName: 'Yonex Astrox 99 Pro Badminton Racket', currentQuantity: 18, minStockThreshold: 5, status: 'IN_STOCK', lastRestockedAt: '2026-11-20T10:00:00' },
  { id: 2, productId: 2, productName: 'Wilson Pro Staff 97 v14 Tennis Racket', currentQuantity: 8, minStockThreshold: 4, status: 'IN_STOCK', lastRestockedAt: '2026-11-19T14:30:00' },
  { id: 3, productId: 3, productName: 'SS Ton Reserve Edition English Willow Bat', currentQuantity: 5, minStockThreshold: 5, status: 'LOW_STOCK', lastRestockedAt: '2026-11-15T09:15:00' },
  { id: 4, productId: 4, productName: 'Kookaburra Turf White Regulation Cricket Ball (Pack of 4)', currentQuantity: 24, minStockThreshold: 10, status: 'IN_STOCK', lastRestockedAt: '2026-11-18T11:00:00' },
  { id: 5, productId: 5, productName: 'Wilson US Open Extra Duty Tennis Balls (Can of 3)', currentQuantity: 48, minStockThreshold: 15, status: 'IN_STOCK', lastRestockedAt: '2026-11-20T16:45:00' },
  { id: 6, productId: 6, productName: 'Asics Gel-Resolution 9 Hard-Court Shoes', currentQuantity: 12, minStockThreshold: 5, status: 'IN_STOCK', lastRestockedAt: '2026-11-17T12:00:00' },
  { id: 7, productId: 7, productName: 'ClubSphere Tournament Dry-Fit Player Jersey', currentQuantity: 35, minStockThreshold: 10, status: 'IN_STOCK', lastRestockedAt: '2026-11-20T08:30:00' },
  { id: 8, productId: 8, productName: 'Bowflex SelectTech 552 Adjustable Dumbbells (Pair)', currentQuantity: 4, minStockThreshold: 5, status: 'LOW_STOCK', lastRestockedAt: '2026-11-10T15:20:00' },
  { id: 9, productId: 9, productName: 'Yonex Pro 9-Racket Thermoguard Bag', currentQuantity: 0, minStockThreshold: 3, status: 'OUT_OF_STOCK', lastRestockedAt: '2026-10-28T14:00:00' },
];

const MOCK_MOVEMENTS = [
  { id: 101, productId: 1, productName: 'Yonex Astrox 99 Pro Badminton Racket', movementType: 'STOCK_IN', quantity: 20, previousStock: 0, updatedStock: 20, reason: 'Initial consignment stock intake', recordedBy: 'Admin Balaji', createdAt: '2026-11-20T10:00:00' },
  { id: 102, productId: 1, productName: 'Yonex Astrox 99 Pro Badminton Racket', movementType: 'STOCK_OUT', quantity: 2, previousStock: 20, updatedStock: 18, reason: 'Online Member Order #ORD-2026-001', recordedBy: 'System Checkout', createdAt: '2026-11-20T14:15:00' },
  { id: 103, productId: 3, productName: 'SS Ton Reserve Edition English Willow Bat', movementType: 'STOCK_OUT', quantity: 1, previousStock: 6, updatedStock: 5, reason: 'Shop Counter POS Sale #CS-9912', recordedBy: 'Staff Cashier', createdAt: '2026-11-21T11:30:00' },
  { id: 104, productId: 8, productName: 'Bowflex SelectTech 552 Adjustable Dumbbells', movementType: 'ADJUSTMENT', quantity: 1, previousStock: 5, updatedStock: 4, reason: 'Damaged item written off during audit', recordedBy: 'Admin Balaji', createdAt: '2026-11-21T09:00:00' },
];

export const inventoryApi = {
  getAll: () => api.get('/inventory').catch(() => ({ data: MOCK_INVENTORY })),
  getAllInventory: () => api.get('/inventory').catch(() => ({ data: MOCK_INVENTORY })),
  getByProductId: (productId) => api.get(`/inventory/${productId}`).catch(() => {
    const found = MOCK_INVENTORY.find(i => String(i.productId) === String(productId));
    return { data: found || MOCK_INVENTORY[0] };
  }),
  stockIn: (data) => api.post('/inventory/stock-in', data).catch(() => ({ data: { success: true } })),
  addStock: (productId, data) => api.post(`/inventory/${productId}/stock-in`, data).catch(() => ({ data: { success: true } })),
  adjustStock: (productId, data) => api.post(`/inventory/${productId}/adjust`, data).catch(() => ({ data: { success: true } })),
  getLowStockAlerts: () => api.get('/inventory/low-stock').catch(() => ({ data: MOCK_INVENTORY.filter(i => i.currentQuantity <= i.minStockThreshold) })),
  getLowStockItems: () => api.get('/inventory/low-stock').catch(() => ({ data: MOCK_INVENTORY.filter(i => i.currentQuantity <= i.minStockThreshold && i.currentQuantity > 0) })),
  getOutOfStockItems: () => api.get('/inventory/out-of-stock').catch(() => ({ data: MOCK_INVENTORY.filter(i => i.currentQuantity === 0) })),
  getAllMovements: () => api.get('/inventory/movements').catch(() => ({ data: MOCK_MOVEMENTS })),
  getMovementsByProduct: (productId) => api.get(`/inventory/movements/${productId}`).catch(() => ({
    data: MOCK_MOVEMENTS.filter(m => String(m.productId) === String(productId))
  })),
  getProductMovements: (productId) => api.get(`/inventory/movements/${productId}`).catch(() => ({
    data: MOCK_MOVEMENTS.filter(m => String(m.productId) === String(productId))
  })),
};

export default inventoryApi;
