// src/context/AuthContext.js

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (data) => {
    setLoading(true);

    const STATIC_USERNAME = 'admin';
    const STATIC_PASSWORD = 'admin';

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.username === STATIC_USERNAME && data.password === STATIC_PASSWORD) {
      setUser({ username: data.username });
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Hibás felhasználónév vagy jelszó.' };
    }
  };
  
  const logout = () => {
    setUser(null);
  };

  const value = {
    login,
    loading,
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};