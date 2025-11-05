import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewWarehousePageWithTheme from './pages/NewWarehousePage';

import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/warehouses" element={<NewWarehousePageWithTheme />} />
            <Route path="/warehouses/new" element={<NewWarehousePageWithTheme />} />
            <Route path="/profile" element={<NewWarehousePageWithTheme />} />
            <Route path="statistics" element={<NewWarehousePageWithTheme />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;