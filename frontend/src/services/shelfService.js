import api from './api';

export const shelfService = {
  // Összes polc lekérése egy raktárból
  getAllByWarehouse: (warehouseId) => api.get(`/api/warehouses/${warehouseId}/shelves`),
  
  // Polc lekérése ID alapján
  getById: (id) => api.get(`/api/shelves/${id}`),
  
  // Új polc létrehozása
  create: (data) => api.post('/api/shelves', data),
  
  // Polc frissítése
  update: (id, data) => api.put(`/api/shelves/${id}`, data),
  
  // Polc törlése
  delete: (id) => api.delete(`/api/shelves/${id}`),
  
  // Polc termékeinek lekérése
  getProducts: (shelfId) => api.get(`/api/shelves/${shelfId}/products`),
};
