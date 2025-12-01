import api from './api';

  export const companyService = {
    // Összes cég lekérése
    getAll: (params) => api.get('/api/companies', { params }),

    // Cég lekérése ID alapján
    getById: (id) => api.get(`/api/companies/${id}`),

    // Új cég létrehozása
    create: (data) => api.post('/api/companies', data),

    // Cég frissítése
    update: (id, data) => api.put(`/api/companies/${id}`, data),

    // Cég deaktiválása
    deactivate: (id) => api.patch(`/api/companies/${id}/deactivate`),

    // Cég törlése
    delete: (id) => api.delete(`/api/companies/${id}`),
  };
