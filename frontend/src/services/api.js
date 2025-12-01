import axios from 'axios';

// Axios instance létrehozása
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token hozzáadása minden kéréshez
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hibakezelés
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token lejárt vagy érvénytelen
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('raktar_user_session');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
