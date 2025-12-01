import api from './api';

export const authService = {
  // Bejelentkezés
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  
  // Regisztráció
  register: (userData) => 
    api.post('/api/auth/register', userData),
  
  // Token validálás
  validateToken: () => 
    api.get('/api/auth/validate'),
};
