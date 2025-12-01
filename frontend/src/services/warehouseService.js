import api from './api';

export const warehouseService = {
  // Összes raktár lekérése
  getAll: () => api.get('/api/warehouses'),
  
  // Raktár lekérése ID alapján (részletes adatokkal, polcokkal együtt)
  getById: (id) => api.get(`/api/warehouses/${id}`),
  
  // Új raktár létrehozása
  create: (data) => api.post('/api/warehouses', data),
  
  // Raktár frissítése
  update: (id, data) => api.put(`/api/warehouses/${id}`, data),
  
  // Raktár törlése
  delete: (id) => api.delete(`/api/warehouses/${id}`),
};
