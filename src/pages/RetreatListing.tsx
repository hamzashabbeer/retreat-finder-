import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SortAsc } from 'lucide-react';
import RetreatCard from '@components/common/RetreatCard';
import type { Retreat } from '@types';
import { useRetreats } from '@hooks/useRetreats';

const RetreatListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');

  const { retreats, loading, error } = useRetreats();

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Filter and sort retreats
  const filteredRetreats = retreats.filter(retreat => {
    // Price filter
    if (retreat.price.amount < priceRange[0] || retreat.price.amount > priceRange[1]) {
      return false;
    }

    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.some(type => retreat.type.includes(type))) {
      return false;
    }

    // Duration filter
    if (selectedDuration.length > 0) {
      const durationMatches = selectedDuration.some(duration => {
        switch (duration) {
          case 'Weekend (2-3 days)':
            return retreat.duration >= 2 && retreat.duration <= 3;
          case 'Short (4-6 days)':
            return retreat.duration >= 4 && retreat.duration <= 6;
          case 'Week (7 days)':
            return retreat.duration === 7;
          case 'Long (8-14 days)':
            return retreat.duration >= 8 && retreat.duration <= 14;
          case 'Extended (14+ days)':
            return retreat.duration > 14;
          default:
            return true;
        }
      });
      if (!durationMatches) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price.amount - b.price.amount;
      case 'price_high':
        return b.price.amount - a.price.amount;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      default:
        return 0;
    }
  });

  const retreatTypes = [
    "Yoga",
    "Meditation",
    "Wellness",
    "Spiritual",
    "Women's Only",
    "Mental Health",
    "Detox",
    "Fitness",
    "Silent",
    "Couples",
    "Weight Loss",
    "Healing",
    "Ayurvedic"
  ];

  const durations = [
    "Weekend (2-3 days)",
    "Short (4-6 days)",
    "Week (7 days)",
    "Long (8-14 days)",
    "Extended (14+ days)"
  ];

  const amenities = [
    "Pool",
    "Spa",
    "Private Room",
    "Shared Room",
    "Organic Meals",
    "Vegan Options",
    "WiFi",
    "Nature Surroundings",
    "Beach Access",
    "Mountain View"
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading retreats: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              
              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              </div>

              {/* Retreat Types */}
              <div>
                <h4 className="font-medium mb-2">Retreat Type</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {retreatTypes.map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="rounded text-indigo-600"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h4 className="font-medium mb-2">Duration</h4>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <label key={duration} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDuration.includes(duration)}
                        onChange={() => setSelectedDuration(prev =>
                          prev.includes(duration)
                            ? prev.filter(d => d !== duration)
                            : [...prev, duration]
                        )}
                        className="rounded text-indigo-600"
                      />
                      <span>{duration}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-medium mb-2">Amenities</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {amenities.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded text-indigo-600"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and View Options */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <SortAsc className="w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none bg-transparent focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{filteredRetreats.length} retreats</span>
            </div>
          </div>

          {/* Retreats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRetreats.map(retreat => (
              <RetreatCard key={retreat.id} retreat={retreat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetreatListing; 