import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

/**
 * Interface for the search parameters
 */
interface SearchParams {
  location: string;
  type: string;
  startDate: string;
  endDate: string;
}

interface SearchBarProps {
  initialValues?: SearchParams;
  onSearch?: (params: SearchParams) => void;
}

/**
 * SearchBar component that provides search functionality for retreats
 * Allows users to search by location, category, and date range
 */
export const SearchBar: React.FC<SearchBarProps> = ({ 
  initialValues = {
    location: '',
    type: '',
    startDate: '',
    endDate: ''
  },
  onSearch
}) => {
  const navigate = useNavigate();
  
  // State for search parameters
  const [searchParams, setSearchParams] = useState<SearchParams>(initialValues);

  useEffect(() => {
    setSearchParams(initialValues);
  }, [initialValues]);

  /**
   * Handles form submission and navigation to search results
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (searchParams.location) queryParams.set('location', searchParams.location);
    if (searchParams.type) queryParams.set('type', searchParams.type);
    if (searchParams.startDate) queryParams.set('startDate', searchParams.startDate);
    if (searchParams.endDate) queryParams.set('endDate', searchParams.endDate);

    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Navigate to search results with query parameters
      navigate(`/retreats?${queryParams.toString()}`);
    }
  };

  /**
   * Updates search parameters state
   * @param field - Field to update
   * @param value - New value
   */
  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-md">
        {/* Location Input */}
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={searchParams.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Where are you going?"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Type Select */}
        <div className="flex-1">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={searchParams.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="yoga">Yoga</option>
            <option value="meditation">Meditation</option>
            <option value="wellness">Wellness</option>
            <option value="spiritual">Spiritual</option>
          </select>
        </div>

        {/* Date Range Inputs */}
        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Check In
            </label>
            <input
              type="date"
              id="startDate"
              value={searchParams.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Check Out
            </label>
            <input
              type="date"
              id="endDate"
              value={searchParams.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;