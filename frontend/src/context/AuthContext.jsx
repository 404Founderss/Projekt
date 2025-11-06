// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Kulcs, ami alatt a localStorage-ban tároljuk a felhasználót
const USER_STORAGE_KEY = 'raktar_user_session';

export const AuthProvider = ({ children }) => {
  // Ez a 'loading' a BEJELENTKEZÉS GOMB-hoz kell
  const [loading, setLoading] = useState(false);
  
  const [user, setUser] = useState(null);

  // ÚJ: Ez az 'isInitializing' a VÉDETT ÚTVONAL-hoz (ProtectedRoute) kell
  // Azt jelzi, hogy az alkalmazás indulásakor még ellenőrizzük,
  // hogy van-e már bejelentkezett felhasználó a localStorage-ban.
  const [isInitializing, setIsInitializing] = useState(true);

  // ÚJ: Ez a useEffect lefut egyszer, az alkalmazás indulásakor
  useEffect(() => {
    try {
      // 1. Megpróbáljuk kiolvasni a felhasználót a tárolóból
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      
      if (storedUser) {
        // 2. Ha van, beállítjuk az állapotba
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Hiba a felhasználói munkamenet olvasásakor:", error);
      // Hiba esetén töröljük az esetleges hibás adatot
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      // 3. Bárhogy is volt, az ellenőrzés kész.
      // Ezzel jelezzük a ProtectedRoute-nak, hogy eldöntheti, mit tegyen.
      setIsInitializing(false);
    }
  }, []); // Az üres [] biztosítja, hogy csak egyszer fusson le

  const login = async (data) => {
    setLoading(true);

    const STATIC_USERNAME = 'admin';
    const STATIC_PASSWORD = 'admin';

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.username === STATIC_USERNAME && data.password === STATIC_PASSWORD) {
      const userData = { username: data.username, name: 'Admin Felhasználó' }; // A felhasználói objektum
      
      // ÚJ: Sikeres bejelentkezéskor mentjük a localStorage-ba
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      setUser(userData);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Hibás felhasználónév vagy jelszó.' };
    }
  };
  
  const logout = () => {
    // ÚJ: Kijelentkezéskor töröljük a localStorage-ból
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const value = {
    login,
    loading,       
    isInitializing, 
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};