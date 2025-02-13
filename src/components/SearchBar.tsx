import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Tag } from 'lucide-react';
import { supabase, verifyAndCreateLocationsTable } from '../lib/supabase';

interface Location {
  id: string;
  city: string;
  country: string;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        // First, verify and create the locations table if needed
        await verifyAndCreateLocationsTable();

        // Then fetch the locations
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('city', { ascending: true });

        if (error) throw error;
        console.log('Fetched locations:', data);
        setLocations(data || []);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (selectedLocation) {
      params.append('city', selectedLocation.city);
      params.append('country', selectedLocation.country);
    }
    if (category) params.append('category', category);
    if (dateRange) params.append('dates', dateRange);

    navigate(`/retreats?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative z-50">
      <div className="h-[60px] flex items-center gap-2 px-5 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Location */}
        <div className="flex-1 flex items-center gap-2 min-w-[200px] relative" ref={locationDropdownRef}>
          <MapPin className="w-5 h-5 text-gray-400" />
          <button
            type="button"
            className="w-full text-left bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          >
            {selectedLocation ? `${selectedLocation.city} • ${selectedLocation.country}` : 'Anywhere'}
          </button>
          
          {isLocationDropdownOpen && (
            <div 
              className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
              style={{ 
                top: '100%',
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto',
                width: '100%'
              }}
            >
              <div className="py-1">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none"
                  onClick={() => {
                    setSelectedLocation(null);
                    setIsLocationDropdownOpen(false);
                  }}
                >
                  <span className="block text-sm font-medium">Anywhere</span>
                </button>
                
                {isLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Loading locations...</div>
                ) : locations.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">No locations available</div>
                ) : (
                  locations.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none"
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationDropdownOpen(false);
                      }}
                    >
                      <span className="block text-sm font-medium">{location.city}</span>
                      <span className="block text-sm text-gray-500">{location.country}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        {/* Category */}
        <div className="flex-1 flex items-center gap-2 min-w-[180px]">
          <Tag className="w-5 h-5 text-gray-400" />
          <select
            className="w-full bg-transparent border-none focus:outline-none text-gray-800"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="meditation">Meditation</option>
            <option value="yoga">Yoga</option>
            <option value="wellness">Wellness</option>
            <option value="spiritual">Spiritual</option>
            <option value="adventure">Adventure</option>
            <option value="nature">Nature</option>
          </select>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        {/* Date Range */}
        <div className="flex-1 flex items-center gap-2 min-w-[200px]">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Select dates"
            className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          className="ml-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}