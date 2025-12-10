import api from './api';

export const statisticsService = {
  getTopSelling: (limit = 5, companyId) => api.get('/api/statistics/top-selling', { params: { limit, companyId } }),
  getInventoryTurnover: (startDate, endDate, companyId) => api.get('/api/statistics/inventory-turnover', { params: { startDate, endDate, companyId } }),
  getRevenue: (startDate, endDate, companyId) => api.get('/api/statistics/revenue', { params: { startDate, endDate, companyId } }),
  getCategoryDistribution: (companyId) => api.get('/api/statistics/category-distribution', { params: { companyId } })
};
