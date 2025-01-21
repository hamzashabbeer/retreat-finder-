import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">FindRetreat</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link
              to="/auth/owner/login"
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Owner Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;