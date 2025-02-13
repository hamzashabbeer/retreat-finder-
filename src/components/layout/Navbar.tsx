import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Heart, ChevronDown } from 'lucide-react';
import { useWishlist } from '@context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import LogoImage from '../../assets/logos/logo.png';

const currencies = [
  { 
    code: 'USD', 
    symbol: '$', 
    flag: 'https://flagcdn.com/w40/us.png', 
    name: 'US Dollar' 
  },
  { 
    code: 'EUR', 
    symbol: '€', 
    flag: 'https://flagcdn.com/w40/eu.png', 
    name: 'Euro' 
  },
  { 
    code: 'GBP', 
    symbol: '£', 
    flag: 'https://flagcdn.com/w40/gb.png', 
    name: 'British Pound' 
  },
  { 
    code: 'AUD', 
    symbol: 'A$', 
    flag: 'https://flagcdn.com/w40/au.png', 
    name: 'Australian Dollar' 
  },
  { 
    code: 'CAD', 
    symbol: 'C$', 
    flag: 'https://flagcdn.com/w40/ca.png', 
    name: 'Canadian Dollar' 
  },
  { 
    code: 'JPY', 
    symbol: '¥', 
    flag: 'https://flagcdn.com/w40/jp.png', 
    name: 'Japanese Yen' 
  },
];

/**
 * Navigation bar component that displays the main navigation links and authentication status
 * Handles user navigation and logout functionality
 */
interface NavbarProps {
  className?: string;
}

const Navbar: React.FC = () => {
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency);
    setShowCurrencyDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={LogoImage} alt="Retreat Finder Logo" className="h-10 w-auto" />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link>
            <Link to="/help" className="text-gray-500 hover:text-gray-900">Help</Link>
            <Link to="/featured" className="text-gray-500 hover:text-gray-900">Featured</Link>
            <Link to="/wishlist" className="text-gray-500 hover:text-gray-900">Wishlist</Link>
            <Link to="/dashboard/retreats/new" className="text-gray-500 hover:text-gray-900">Add Retreat</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <select className="form-select rounded-md border-gray-300">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/auth/owner/login"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;