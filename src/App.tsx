import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerSignup from './pages/auth/CustomerSignup';
import OwnerLogin from './pages/auth/OwnerLogin';
import OwnerSignup from './pages/auth/OwnerSignup';
import RetreatListing from './pages/RetreatListing';
import OwnerDashboard from './pages/OwnerDashboard';
import RetreatDetails from './pages/RetreatDetails';
import AddEditRetreat from './pages/AddEditRetreat';
import About from './pages/About';
import WishlistPage from './pages/WishlistPage';
import { testSupabaseConnection } from './lib/supabase';

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication and specific user roles.
 * Redirects to login if user is not authenticated or not authorized.
 */
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'owner' | 'customer';
}> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to owner login for owner routes, customer login for customer routes
    const loginPath = requiredRole === 'owner' ? '/auth/owner/login' : '/auth/customer/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If user is logged in but doesn't have the required role
    if (user.role === 'owner') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'customer') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Main App Component
 * 
 * Provides authentication context and routing for the application.
 * Includes protected routes for owner and customer specific pages.
 */
const App = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('/dashboard');

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
    <AuthProvider>
      <WishlistProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {!isDashboardRoute && <Navbar />}
          <main className={!isDashboardRoute ? 'pt-16' : ''}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/retreats" element={<RetreatListing />} />
              <Route path="/retreats/:id" element={<RetreatDetails />} />
              <Route path="/retreats/new" element={<AddEditRetreat />} />
              <Route path="/retreats/:id/edit" element={<AddEditRetreat />} />
              <Route path="/auth/customer/login" element={<CustomerLogin />} />
              <Route path="/auth/customer/signup" element={<CustomerSignup />} />
              <Route path="/auth/owner/login" element={<OwnerLogin />} />
              <Route path="/auth/owner/signup" element={<OwnerSignup />} />
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Protected Owner Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute requiredRole="owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {!isDashboardRoute && <Footer />}
        </div>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;