import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, X } from 'lucide-react';
import { useWishlist } from '@context/WishlistContext';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-indigo-600 font-medium">Wishlist</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
          <p className="text-gray-600">Keep track of the retreats you love.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start exploring retreats and save your favorites here!</p>
            <Link 
              to="/retreats"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              Explore Retreats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((retreat) => (
              <div 
                key={retreat.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={retreat.images[0]}
                    alt={retreat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    onClick={() => removeFromWishlist(retreat.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                    ${retreat.price.amount}/night
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <Link to={`/retreats/${retreat.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {retreat.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <span>{retreat.location.city}, {retreat.location.country}</span>
                    •
                    <span>{retreat.duration} days</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {retreat.type.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage; 