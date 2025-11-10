import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewWarehousePageWithTheme from './pages/NewWarehousePage';
import ProfilePageWithTheme from './pages/ProfilePage';
import WarehousesPage from './pages/WarehousesPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePageWithTheme />} />
            <Route path="/warehouses" element={<WarehousesPage />} />
            <Route path="/warehouses/new" element={<NewWarehousePageWithTheme />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;