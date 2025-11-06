// src/components/ProtectedRoute.js

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  // Most már az isInitializing állapotot is kivesszük
  const { user, isInitializing } = useAuth();

  // 1. Amíg az alkalmazás indulásakor ellenőrizzük (az AuthContext-ből),
  //    hogy van-e munkamenet a localStorage-ban, addig töltőképernyőt mutatunk.
  if (isInitializing) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: '#282c34' // Illeszkedhet a login stílusához
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 2. Ha az ellenőrzés kész (isInitializing = false), ÉS van bejelentkezett
  //    felhasználó (user !== null), akkor megjelenítjük a kért oldalt.
  //    Az <Outlet /> a "gyerek" útvonalat jelenti (pl. a Dashboard-ot).
  return user ? <Outlet /> : <Navigate to="/" replace />;

  // 3. Ha az ellenőrzés kész, DE nincs felhasználó (user === null),
  //    akkor átirányítjuk a bejelentkezési oldalra ('/').
  //    A 'replace' biztosítja, hogy a böngésző "vissza" gombja
  //    ne ragadjon be a védett oldalra való visszairányítási hurokba.
};

export default ProtectedRoute;