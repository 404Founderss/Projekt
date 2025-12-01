import api from './api';

export const productService = {
  // Összes termék lekérése
  getAll: (params) => api.get('/api/products', { params }),
  
  // Termék lekérése ID alapján
  getById: (id) => api.get(`/api/products/${id}`),
  
  // Új termék létrehozása
  create: (data) => api.post('/api/products', data),
  
  // Termék frissítése
  update: (id, data) => api.put(`/api/products/${id}`, data),
  
  // Termék törlése
  delete: (id) => api.delete(`/api/products/${id}`),
  
  // Termék QR kód lekérése
  getQRCode: (id) => api.get(`/api/products/${id}/qrcode`, { responseType: 'blob' }),
  
  // Termék mennyiség módosítása
  adjustQuantity: (id, delta) => api.post(`/api/products/${id}/adjust`, { delta }),
};
