import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SortAsc, ChevronDown, ChevronUp } from 'lucide-react';
import RetreatCard from '@components/common/RetreatCard';
import SearchBar from '@components/forms/SearchBar';
import type { Retreat } from '@types';
import { useRetreats } from '@hooks/useRetreats';

const RetreatListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [openSections, setOpenSections] = useState({
    price: true,
    type: true,
    duration: true,
    amenities: true
  });

  const { retreats, loading, error } = useRetreats();

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    <div className="pt-16">
      {/* Header Section with Background */}
      <div className="flex justify-center mb-32 relative z-10">
        <div className="relative w-[1373px] rounded-3xl mt-8">
          {/* Background Image */}
          <div className="h-[400px] rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1532798442725-41036acc7489?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Retreat Landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 rounded-3xl"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Find Your Perfect Retreat
              </h1>
              <p className="text-lg text-gray-200 mb-4 max-w-2xl mx-auto">
                Discover transformative experiences in breathtaking locations around the world
              </p>
            </div>

            {/* Search Bar */}
            <div className="absolute -bottom-12 w-full px-4">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 z-30 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    Filters
                  </h3>
                  <button 
                    onClick={() => {
                      setPriceRange([0, 1000]);
                      setSelectedTypes([]);
                      setSelectedDuration([]);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
                
                {/* Price Range Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Price Range</h4>
                    {openSections.price ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.price && (
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Min"
                          />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Retreat Types Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('type')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Retreat Type</h4>
                    {openSections.type ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.type && (
                    <div className="p-4">
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {retreatTypes.map(type => (
                          <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={() => handleTypeChange(type)}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Duration Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('duration')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Duration</h4>
                    {openSections.duration ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.duration && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {durations.map(duration => (
                          <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedDuration.includes(duration)}
                              onChange={() => setSelectedDuration(prev =>
                                prev.includes(duration)
                                  ? prev.filter(d => d !== duration)
                                  : [...prev, duration]
                              )}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{duration}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Amenities Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('amenities')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Amenities</h4>
                    {openSections.amenities ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.amenities && (
                    <div className="p-4">
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {amenities.map(amenity => (
                          <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
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
    </div>
  );
};

export default RetreatListing; 