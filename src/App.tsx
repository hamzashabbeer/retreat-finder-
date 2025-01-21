import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerSignup from './pages/auth/CustomerSignup';
import OwnerLogin from './pages/auth/OwnerLogin';
import OwnerSignup from './pages/auth/OwnerSignup';
import RetreatListing from './pages/RetreatListing';
import OwnerDashboard from './pages/OwnerDashboard';
import { testSupabaseConnection } from './lib/supabase';

/**
 * Protected route component that checks user authentication and role
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/customer/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

/**
 * Main App component with routing and authentication
 */
function AppContent() {
  useEffect(() => {
    // Test Supabase connection on app load
    testSupabaseConnection().then(isConnected => {
      if (isConnected) {
        console.log('✅ Supabase is connected and working!');
      } else {
        console.error('❌ Supabase connection failed');
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/retreats" element={<RetreatListing />} />
        <Route path="/auth/customer/login" element={<CustomerLogin />} />
        <Route path="/auth/customer/signup" element={<CustomerSignup />} />
        <Route path="/auth/owner/login" element={<OwnerLogin />} />
        <Route path="/auth/owner/signup" element={<OwnerSignup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

/**
 * Root App component wrapped with providers
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;