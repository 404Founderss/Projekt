import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importáljuk a providerünket
import LoginPage from './pages/LoginPage';         // A te login oldalad
import DashboardPage from './pages/DashboardPage'; // Az új dashboard oldal
import NewWarehousePageWithTheme from './pages/NewWarehousePage';

function App() {
  return (
    // 1. Az AuthProvider körbevesz mindent,
    // így a LoginPage hozzáfér a useAuth() hook-hoz.
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Alapértelmezetten a Login oldalt mutatjuk */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* A sikeres login ide irányít át */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/warehouses/new" element={<NewWarehousePageWithTheme />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;