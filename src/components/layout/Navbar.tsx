import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import LogoImage from '../../assets/logos/logo.png';

/**
 * Navigation bar component that displays the main navigation links and authentication status
 * Handles user navigation and logout functionality
 */
interface NavbarProps {
  className?: string;
}

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={LogoImage} alt="Find Retreat Logo" className="h-10 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
            <Link to="/retreats" className="text-gray-600 hover:text-gray-900">Featured</Link>
            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900">Wishlist</Link>
            <Link 
              to="/auth/owner/login" 
              className="text-gray-600 hover:text-gray-900"
            >
              Add Retreat
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <span className="text-sm">USD (US$)</span>
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <Menu className="w-6 h-6" />
            </button>

            {/* Profile Menu */}
            <div className="hidden md:flex items-center">
              <Link 
                to="/auth/customer/login"
                className="flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;