import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Heart, ChevronDown } from 'lucide-react';
import { useWishlist } from '@context/WishlistContext';
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
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency);
    setShowCurrencyDropdown(false);
  };

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
            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 relative group flex items-center gap-2">
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {wishlist.length}
                </span>
              )}
            </Link>
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
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img 
                  src={selectedCurrency.flag} 
                  alt={`${selectedCurrency.code} flag`}
                  className="w-5 h-5 rounded-sm object-cover"
                />
                <span className="text-sm font-medium">{selectedCurrency.code}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Currency Dropdown */}
              {showCurrencyDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                        selectedCurrency.code === currency.code ? 'bg-gray-50' : ''
                      }`}
                    >
                      <img 
                        src={currency.flag} 
                        alt={`${currency.code} flag`}
                        className="w-5 h-5 rounded-sm object-cover"
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{currency.code}</div>
                        <div className="text-xs text-gray-500">{currency.name}</div>
                      </div>
                      {selectedCurrency.code === currency.code && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

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