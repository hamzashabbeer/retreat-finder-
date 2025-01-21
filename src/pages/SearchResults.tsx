import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import SearchBar from '../components/forms/SearchBar';
import RetreatCard from '../components/common/RetreatCard';
import { useRetreats } from '../hooks/useRetreats';
import type { Retreat } from '../types';

interface FilterState {
  priceRange: [number, number];
  types: string[];
  amenities: string[];
  rating: number | null;
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const { loading, error, fetchRetreats } = useRetreats();
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    types: [],
    amenities: [],
    rating: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRetreats({
        location: searchParams.get('location') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        category: searchParams.get('type') || undefined,
        priceMin: filters.priceRange[0],
        priceMax: filters.priceRange[1],
      });
      setRetreats(data || []);
    };
    fetchData();
  }, [searchParams, filters.priceRange, fetchRetreats]);

  const handleSearch = (params: Record<string, string>) => {
    setSearchParams(params);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      types: [],
      amenities: [],
      rating: null,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading retreats</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar initialValues={{
            location: searchParams.get('location') || '',
            type: searchParams.get('type') || '',
            startDate: searchParams.get('startDate') || '',
            endDate: searchParams.get('endDate') || ''
          }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-1/4 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Clear all
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Retreat Types */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Retreat Type</h3>
                  <div className="space-y-3">
                    {['Yoga', 'Meditation', 'Wellness', 'Spiritual'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...filters.types, type]
                              : filters.types.filter(t => t !== type);
                            handleFilterChange('types', newTypes);
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Amenities</h3>
                  <div className="space-y-3">
                    {['Pool', 'Spa', 'Wifi', 'Restaurant', 'Gym'].map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...filters.amenities, amenity]
                              : filters.amenities.filter(a => a !== amenity);
                            handleFilterChange('amenities', newAmenities);
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange('rating', rating)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filters.rating === rating
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {rating}+ Stars
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {retreats.length} retreats found
                  {searchParams.get('location') && (
                    <span className="text-gray-600 text-lg font-normal ml-2">
                      in {searchParams.get('location')}
                    </span>
                  )}
                </h1>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600"
              >
                {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
                <span>{showFilters ? 'Hide filters' : 'Show filters'}</span>
              </button>
            </div>

            <div className={`grid ${showFilters ? 'grid-cols-2' : 'grid-cols-3'} gap-6`}>
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
              ) : retreats.length > 0 ? (
                retreats.map((retreat: Retreat) => (
                  <RetreatCard key={retreat.id} retreat={retreat} />
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
}