import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Heart } from 'lucide-react';
import type { RetreatCardProps } from '@types';
import { useWishlist } from '@context/WishlistContext';

/**
 * RetreatCard Component
 * 
 * Displays a retreat in a card format with image, title, location, price, and other details.
 * Used in both the homepage for featured retreats and the listing page for search results.
 */
const RetreatCard: React.FC<RetreatCardProps> = ({ retreat }) => {
  const {
    id,
    title,
    location,
    price,
    duration,
    startDate,
    type,
    images,
    rating,
    reviewCount
  } = retreat;

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default action
    e.stopPropagation(); // Stop the event from bubbling up
    
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(retreat);
    }
  };

  return (
    <Link to={`/retreats/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div 
            onClick={handleWishlistClick}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg group/heart z-10 cursor-pointer"
          >
            <Heart 
              className={`w-4 h-4 transition-colors group-hover/heart:scale-110 ${
                isWishlisted 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 group-hover/heart:text-red-500'
              }`} 
            />
          </div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
            ${price.amount}/night
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
              {title}
            </h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">
                {rating} ({reviewCount})
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {location.city}, {location.country}
            </span>
          </div>

          {/* Duration and Date */}
          <div className="flex items-center text-gray-500 mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {duration} days • Starts {new Date(startDate).toLocaleDateString()}
            </span>
          </div>

          {/* Types */}
          <div className="flex flex-wrap gap-2">
            {type.map((t) => (
              <span
                key={t}
                className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RetreatCard;