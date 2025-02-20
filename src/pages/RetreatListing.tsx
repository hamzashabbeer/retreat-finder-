import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

import { Filter, SortAsc, ChevronDown, ChevronUp, X, Check, Users } from 'lucide-react';
import RetreatCard from '@components/common/RetreatCard';
import SearchBar from '@components/forms/SearchBar';
import type { Retreat, SearchFilters } from '@types';
import { useRetreats } from '@hooks/useRetreats';
import { useWishlist } from '@context/WishlistContext';
import { Heart, MapPin, Star, Calendar } from 'lucide-react';

const RetreatListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([26, 33000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([2, 90]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [filteredResults, setFilteredResults] = useState<Retreat[]>([]);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [openSections, setOpenSections] = useState({
    price: true,
    skillLevel: true,
    duration: true,
    area: true,
    food: true,
    ageGroup: true,
    roomType: true
  });
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedFoodOptions, setSelectedFoodOptions] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);

  const { retreats, loading, error, fetchRetreats } = useRetreats();

  // Debounced fetch function to reduce API calls
  const debouncedFetch = React.useCallback(
    debounce((filters: SearchFilters) => {
      fetchRetreats(filters);
    }, 300),
    []
  );

  const fetchRetreatsWithFilters = () => {
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');

    const filters: SearchFilters = {
      location: location || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      type: category ? [category] : undefined,
      priceRange: priceRange[0] !== 26 || priceRange[1] !== 33000 
        ? [priceRange[0].toString(), priceRange[1].toString()] as [string, string]
        : undefined,
      duration: durationRange[0] !== 2 || durationRange[1] !== 90 
        ? [durationRange[0].toString(), durationRange[1].toString()] as [string, string]
        : undefined,
      skillLevel: selectedSkillLevels.length > 0 ? selectedSkillLevels : undefined,
      area: selectedAreas.length > 0 ? selectedAreas : undefined,
      food: selectedFoodOptions.length > 0 ? selectedFoodOptions : undefined,
      ageGroup: selectedAgeGroups.length > 0 ? selectedAgeGroups : undefined,
      roomType: selectedRoomTypes.length > 0 ? selectedRoomTypes : undefined
    };

    debouncedFetch(filters);
  };

  // Add useEffect to handle initial search params and filter changes
  useEffect(() => {
    fetchRetreatsWithFilters();
  }, [
    searchParams,
    priceRange,
    durationRange,
    selectedSkillLevels,
    selectedAreas,
    selectedFoodOptions,
    selectedAgeGroups,
    selectedRoomTypes
  ]);

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

  const removeFilter = (type: string, value: string) => {
    switch(type) {
      case 'location':
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('location');
        fetchRetreatsWithFilters();
        break;
      case 'duration':
        setDurationRange([2, 90]);
        break;
      case 'price':
        setPriceRange([26, 33000]);
        break;
      case 'skillLevel':
        setSelectedSkillLevels(prev => prev.filter(level => level !== value));
        break;
      case 'area':
        setSelectedAreas(prev => prev.filter(area => area !== value));
        break;
      case 'food':
        setSelectedFoodOptions(prev => prev.filter(food => food !== value));
        break;
      case 'ageGroup':
        setSelectedAgeGroups(prev => prev.filter(age => age !== value));
        break;
      case 'roomType':
        setSelectedRoomTypes(prev => prev.filter(room => room !== value));
        break;
    }
  };

  const clearAllFilters = () => {
    setPriceRange([26, 33000]);
    setDurationRange([2, 90]);
    setSelectedSkillLevels([]);
    setSelectedAreas([]);
    setSelectedFoodOptions([]);
    setSelectedAgeGroups([]);
    setSelectedRoomTypes([]);
    
    // Clear URL params
    setSearchParams(new URLSearchParams());
    
    // Fetch retreats with no filters
    fetchRetreats();
  };

  // Memoize the filtered results
  const filteredRetreats = React.useMemo(() => {
    if (!retreats || !Array.isArray(retreats)) {
      return [];
    }

    return retreats.filter(retreat => {
      if (!retreat) return false;

      try {
    // Location filter from search params
    const locationParam = searchParams.get('location');
        if (locationParam && locationParam !== 'Anywhere') {
          const [cityParam, countryParam] = locationParam.split(', ');
          const cityMatch = retreat.location?.city?.toLowerCase().includes(cityParam.toLowerCase());
          const countryMatch = retreat.location?.country?.toLowerCase().includes(countryParam.toLowerCase());
          if (!cityMatch && !countryMatch) return false;
        }

        // Category filter from search params
        const categoryParam = searchParams.get('category');
        if (categoryParam && !retreat.type.some(type => 
          type.toLowerCase() === categoryParam.toLowerCase()
        )) {
      return false;
    }

        // Date range filter from search params
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        if (startDate && endDate) {
          const retreatStartDate = new Date(retreat.start_date);
          const filterStartDate = new Date(startDate);
          const filterEndDate = new Date(endDate);
          if (retreatStartDate < filterStartDate || retreatStartDate > filterEndDate) {
            return false;
          }
        }

    // Price filter
    if (retreat.price.amount < priceRange[0] || retreat.price.amount > priceRange[1]) {
      return false;
    }

        // Other filters...
        if (selectedSkillLevels.length > 0 && 
            !selectedSkillLevels.some(level => retreat.skill_level.includes(level))) {
          return false;
        }

        if (selectedAreas.length > 0 && 
            !selectedAreas.some(area => retreat.area.includes(area))) {
          return false;
        }

        if (selectedFoodOptions.length > 0 && 
            !selectedFoodOptions.some(food => retreat.food.includes(food))) {
      return false;
    }

        if (selectedAgeGroups.length > 0 && 
            !selectedAgeGroups.some(age => retreat.age_group.includes(age))) {
          return false;
        }

        if (selectedRoomTypes.length > 0 && 
            !selectedRoomTypes.some(room => retreat.room_type.includes(room))) {
          return false;
        }

        return true;
      } catch (e) {
        console.error('Error filtering retreat:', e);
        return false;
      }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price.amount - b.price.amount;
      case 'price_high':
        return b.price.amount - a.price.amount;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      default:
        return 0;
    }
  });
  }, [
    retreats,
    searchParams,
    priceRange,
    selectedSkillLevels,
    selectedAreas,
    selectedFoodOptions,
    selectedAgeGroups,
    selectedRoomTypes,
    sortBy
  ]);

  // Update filtered results when filters change
  useEffect(() => {
    setFilteredResults(filteredRetreats);
  }, [filteredRetreats]);

  // Debounced filter handlers
  const handlePriceChange = React.useCallback(
    debounce((newRange: [number, number]) => {
      setPriceRange(newRange);
    }, 300),
    []
  );

  const handleDurationChange = React.useCallback(
    debounce((newRange: [number, number]) => {
      setDurationRange(newRange);
    }, 300),
    []
  );

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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading retreats: {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      {/* Header Section with Background */}
      <div className="bg-gray-50 backdrop-blur-sm z-[50] mb-24">
        <div className="flex justify-center py-4">
          <div className="relative w-[1373px] rounded-3xl">
          {/* Background Image */}
            <div className="h-[350px] rounded-3xl overflow-hidden">
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
            <div className="absolute -bottom-12 w-full max-w-4xl mx-auto px-4">
              <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {searchParams.get('location') && searchParams.get('location') !== 'Anywhere' && (
            <button
              onClick={() => removeFilter('location', '')}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              Location: {searchParams.get('location')}
              <X className="w-4 h-4 ml-2" />
            </button>
          )}
          {(priceRange[0] !== 26 || priceRange[1] !== 33000) && (
            <button
              onClick={() => removeFilter('price', '')}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              US${priceRange[0]} - US${priceRange[1]}
              <X className="w-4 h-4 ml-2" />
            </button>
          )}
          {selectedSkillLevels.map(level => (
            <button
              key={level}
              onClick={() => removeFilter('skillLevel', level)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              Skill: {level}
              <X className="w-4 h-4 ml-2" />
            </button>
          ))}
          {selectedAreas.map(area => (
            <button
              key={area}
              onClick={() => removeFilter('area', area)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              Area: {area}
              <X className="w-4 h-4 ml-2" />
            </button>
          ))}
          {selectedFoodOptions.map(food => (
            <button
              key={food}
              onClick={() => removeFilter('food', food)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              Food: {food}
              <X className="w-4 h-4 ml-2" />
            </button>
          ))}
          {selectedAgeGroups.map(age => (
            <button
              key={age}
              onClick={() => removeFilter('ageGroup', age)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              Age: {age}
              <X className="w-4 h-4 ml-2" />
            </button>
          ))}
          {selectedRoomTypes.map(room => (
            <button
              key={room}
              onClick={() => removeFilter('roomType', room)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              Room: {room}
              <X className="w-4 h-4 ml-2" />
            </button>
          ))}
          {(searchParams.get('location') || 
            priceRange[0] !== 26 || 
            priceRange[1] !== 33000 || 
            selectedSkillLevels.length > 0 ||
            selectedAreas.length > 0 ||
            selectedFoodOptions.length > 0 ||
            selectedAgeGroups.length > 0 ||
            selectedRoomTypes.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200"
            >
              Clear All
              <X className="w-4 h-4 ml-2" />
            </button>
          )}
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
                    onClick={clearAllFilters}
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
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>US${priceRange[0]}</span>
                          <span>US${priceRange[1]}</span>
                        </div>
                        <input
                          type="range"
                          min={26}
                          max={33000}
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <input
                          type="range"
                          min={26}
                          max={33000}
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Skill Level Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('skillLevel')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Skill Level</h4>
                    {openSections.skillLevel ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.skillLevel && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                          <label key={level} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedSkillLevels.includes(level)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSkillLevels(prev => [...prev, level]);
                                } else {
                                  setSelectedSkillLevels(prev => prev.filter(l => l !== level));
                                }
                                fetchRetreatsWithFilters();
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{level}</span>
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
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>{durationRange[0]} days</span>
                          <span>{durationRange[1]} days</span>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={90}
                          value={durationRange[1]}
                          onChange={(e) => handleDurationChange([durationRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <input
                          type="range"
                          min={2}
                          max={90}
                          value={durationRange[0]}
                          onChange={(e) => handleDurationChange([parseInt(e.target.value), durationRange[1]])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Area Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('area')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Area</h4>
                    {openSections.area ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.area && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {['Close to Nature', 'Mountain', 'Near the Beach', 'Forest', 'Jungle', 'City'].map(area => (
                          <label key={area} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedAreas.includes(area)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAreas(prev => [...prev, area]);
                                } else {
                                  setSelectedAreas(prev => prev.filter(a => a !== area));
                                }
                                fetchRetreatsWithFilters();
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Food Options Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('food')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Food Options</h4>
                    {openSections.food ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.food && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {['Vegetarian', 'Vegan', 'Raw', 'Organic', 'Gluten Free', 'Dairy-free'].map(food => (
                          <label key={food} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFoodOptions.includes(food)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFoodOptions(prev => [...prev, food]);
                                } else {
                                  setSelectedFoodOptions(prev => prev.filter(f => f !== food));
                                }
                                fetchRetreatsWithFilters();
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{food}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Age Group Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('ageGroup')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Age Group</h4>
                    {openSections.ageGroup ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.ageGroup && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {['18-24', '25-40', '41-60', '60+'].map(age => (
                          <label key={age} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedAgeGroups.includes(age)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAgeGroups(prev => [...prev, age]);
                                } else {
                                  setSelectedAgeGroups(prev => prev.filter(a => a !== age));
                                }
                                fetchRetreatsWithFilters();
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{age}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Room Type Section */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('roomType')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-700">Room Type</h4>
                    {openSections.roomType ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openSections.roomType && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {['Private', 'Shared'].map(room => (
                          <label key={room} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedRoomTypes.includes(room)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRoomTypes(prev => [...prev, room]);
                                } else {
                                  setSelectedRoomTypes(prev => prev.filter(r => r !== room));
                                }
                                fetchRetreatsWithFilters();
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 group-hover:text-gray-900">{room}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
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
                  <option value="newest">Newest</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{filteredRetreats.length} retreats</span>
              </div>
            </div>

            {/* Enhanced Results Grid */}
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
              ) : retreats?.length ? (
                filteredRetreats.map((retreat) => (
                  <div key={retreat.id} className="relative bg-white rounded-2xl shadow-[0_3px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden h-[242px]">
                    <div className="flex h-full">
                      {/* Left Section - Image */}
                      <div className="w-[300px] relative overflow-hidden">
                        <img
                          src={retreat.images[0]}
                          alt={retreat.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const isWishlisted = isInWishlist(retreat.id);
                            if (isWishlisted) {
                              removeFromWishlist(retreat.id);
                            } else {
                              addToWishlist(retreat);
                            }
                          }}
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 hover:bg-white text-gray-500 hover:text-rose-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 z-10"
                        >
                          <Heart 
                            className={`w-4 h-4 stroke-[2.5] ${
                              isInWishlist(retreat.id) ? 'fill-rose-500 text-rose-500' : ''
                            }`} 
                          />
                        </button>
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-2 text-white text-sm font-medium bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{retreat.duration} days</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Section - Main Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-br from-white via-white to-gray-50/50">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-900 transition-colors mb-2.5 line-clamp-1">
                            {retreat.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
                              <MapPin className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
                              <span className="font-medium text-gray-700">{retreat.location.city},</span>
                              <span className="text-gray-500">{retreat.location.country}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {retreat.description || "Experience a transformative journey in this peaceful retreat, offering a perfect blend of relaxation and rejuvenation."}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {retreat.type.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1.5 text-xs font-medium bg-indigo-50/60 text-indigo-600 rounded-full ring-1 ring-indigo-100 hover:bg-indigo-100 hover:ring-indigo-200 transition-all duration-200"
                            >
                              {t}
                            </span>
                          ))}
                          {retreat.type.length > 3 && (
                            <span className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer hover:underline">
                              +{retreat.type.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Price and Actions */}
                      <div className="w-[280px] p-6 border-l border-gray-100 flex flex-col justify-between bg-white">
                        <div className="space-y-2.5">
                          <div>
                            <div className="text-gray-400 text-sm mb-0.5">From</div>
                            <div className="text-2xl font-bold text-gray-900">
                              US${retreat.price.amount}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center ring-1 ring-orange-100">
                              <Users className="w-3 h-3 text-orange-500 stroke-[2.5]" />
                            </div>
                            <span className="text-gray-600">
                              4 people are interested
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center ring-1 ring-green-100">
                              <Check className="w-3 h-3 text-green-500 stroke-[2.5]" />
                            </div>
                            <span className="text-gray-600">
                              FREE Cancellation
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-sm text-gray-900">
                              <span className="font-semibold">
                                {retreat.rating.toFixed(2)}
                              </span>
                              <span className="text-yellow-400">★</span>
                              <span className="text-gray-500">
                                ({retreat.review_count} reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 mt-4">
                          <Link 
                            to={`/retreats/${retreat.id}/book`}
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 text-center"
                          >
                            Book Now
                          </Link>
                          <Link 
                            to={`/retreats/${retreat.id}`}
                            className="px-4 py-2 text-indigo-600 text-xs font-medium hover:bg-indigo-50 rounded-lg transition-all duration-200 border border-indigo-200 hover:border-indigo-600 hover:shadow-sm text-center"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No retreats found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetreatListing; 