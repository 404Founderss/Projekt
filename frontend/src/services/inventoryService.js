import api from './api';

export const inventoryService = {
  getMovements: (startDate, endDate) => api.get('/api/inventory/movements', { params: { start: startDate, end: endDate } }),
  getLowStock: () => api.get('/api/inventory/low-stock'),
  getInventoryValue: () => api.get('/api/inventory/value')
};
