
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import CustomerDetailPage from '@/pages/CustomerDetailPage';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (for login/signup)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

const App = () => {
  const location = useLocation(); // Needed for AnimatePresence with routes

  return (
     <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Routes requiring authentication and layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/:customerId"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect base path */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Optional Catch-all for 404 */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
     </AnimatePresence>
  );
};

export default App;
  