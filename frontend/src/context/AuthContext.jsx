import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
const USER_STORAGE_KEY = 'raktar_user_session';
const TOKEN_STORAGE_KEY = 'jwt_token';

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Hiba a felhasználói munkamenet olvasásakor:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = async (data) => {
    setLoading(true);

    try {
      // Valódi API hívás a backend felé
      const response = await api.post('/api/auth/login', {
        username: data.username,
        password: data.password
      });

      // Backend LoginResponse: { token, username, role }
      const { token, username, role } = response.data;

      // Felhasználói objektum összeállítása
      const userData = {
        username: username,
        role: role
      };

      // Token és user mentése
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      setUser(userData);
      setLoading(false);
      return { success: true };

    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Hibás felhasználónév vagy jelszó.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  const value = {
    login,
    loading,
    isInitializing,
    user,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
