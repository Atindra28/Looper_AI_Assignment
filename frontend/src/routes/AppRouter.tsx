import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AppLayout from '../components/layout/AppLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Box, Typography } from '@mui/material';
import { COLORS } from '../theme/theme';

const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const TransactionsPage = lazy(() => import('../pages/Transactions/TransactionsPage'));

// Placeholder for unimplemented nav pages (matches Figma sidebar)
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      gap: 2,
    }}
  >
    <Typography variant="h5" fontWeight={700} color="text.primary">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      This page is coming in a future update.
    </Typography>
  </Box>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/wallet" element={<PlaceholderPage title="Wallet" />} />
            <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
            <Route path="/personal" element={<PlaceholderPage title="Personal" />} />
            <Route path="/message" element={<PlaceholderPage title="Message" />} />
            <Route path="/setting" element={<PlaceholderPage title="Setting" />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
