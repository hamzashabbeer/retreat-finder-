import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@lib/supabase';

interface Location {
  id: string;
  city: string;
  country: string;
}

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('city', { ascending: true });

        if (error) throw error;
        console.log('Fetched locations:', data);
        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
    onFilterChange({
      location: location ? { city: location.city, country: location.country } : null,
      priceRange,
      types: selectedTypes
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="relative" style={{ zIndex: 1000 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <div ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {selectedLocation ? `${selectedLocation.city}, ${selectedLocation.country}` : 'Anywhere'}
          </button>

          {isLocationDropdownOpen && (
            <div 
              className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto"
              style={{ 
                zIndex: 1001,
                maxHeight: '300px',
                position: 'absolute',
                width: '100%',
                top: '100%'
              }}
            >
              <div className="py-1">
                <button
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 border-b border-gray-100"
                  onClick={() => handleLocationSelect(null)}
                >
                  <span className="text-base font-medium">Anywhere</span>
                </button>
                {loading ? (
                  <div className="px-4 py-3 text-gray-500">Loading locations...</div>
                ) : locations.length > 0 ? (
                  locations.map((location) => (
                    <button
                      key={location.id}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 border-b border-gray-100"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <span className="text-base">{location.city}</span>
                      <span className="text-sm text-gray-500 ml-2">{location.country}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">No locations available</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => {
              const newPriceRange = { ...priceRange, min: e.target.value };
              setPriceRange(newPriceRange);
              onFilterChange({
                location: selectedLocation,
                priceRange: newPriceRange,
                types: selectedTypes
              });
            }}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => {
              const newPriceRange = { ...priceRange, max: e.target.value };
              setPriceRange(newPriceRange);
              onFilterChange({
                location: selectedLocation,
                priceRange: newPriceRange,
                types: selectedTypes
              });
            }}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Retreat Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['yoga', 'meditation', 'wellness', 'fitness', 'spiritual', 'adventure'].map((type) => (
            <label
              key={type}
              className={`
                flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer
                ${selectedTypes.includes(type)
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
              `}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedTypes.includes(type)}
                onChange={() => {
                  const newTypes = selectedTypes.includes(type)
                    ? selectedTypes.filter(t => t !== type)
                    : [...selectedTypes, type];
                  setSelectedTypes(newTypes);
                  onFilterChange({
                    location: selectedLocation,
                    priceRange,
                    types: newTypes
                  });
                }}
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters; 