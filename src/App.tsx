import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerSignup from './pages/auth/CustomerSignup';
import OwnerLogin from './pages/auth/OwnerLogin';
import OwnerSignup from './pages/auth/OwnerSignup';
import RetreatListing from './pages/RetreatListing';
import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/retreats" element={<RetreatListing />} />
        <Route path="/auth/customer/login" element={<CustomerLogin />} />
        <Route path="/auth/customer/signup" element={<CustomerSignup />} />
        <Route path="/auth/owner/login" element={<OwnerLogin />} />
        <Route path="/auth/owner/signup" element={<OwnerSignup />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        {/* Add more routes as we create them */}
        {/* <Route path="/retreat/:id" element={<RetreatDetail />} /> */}
      </Routes>
    </>
  );
}

export default App;