import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Navigation bar component that displays the main navigation links and authentication status
 * Handles user navigation and logout functionality
 */
interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  /**
   * Handles user logout
   * Clears the session and redirects to home page
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={`bg-white shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Find Retreat</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth/customer/login" className="text-gray-700 hover:text-indigo-600">
              Customer Login
            </Link>
            <Link to="/auth/owner/login" className="text-gray-700 hover:text-indigo-600">
              Owner Login
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-indigo-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;