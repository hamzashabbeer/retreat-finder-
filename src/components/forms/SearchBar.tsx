import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

/**
 * Interface for the search parameters
 */
interface SearchParams {
  location: string;
  category: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * SearchBar component that provides search functionality for retreats
 * Allows users to search by location, category, and date range
 */
const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    "Meditation",
    "Yoga",
    "Wellness",
    "Spiritual",
    "Mental Health",
    "Detox",
    "Fitness",
    "Silent",
    "Couples",
    "Weight Loss",
    "Healing",
    "Ayurvedic"
  ];

  /**
   * Handles form submission and navigation to search results
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    if (dateRange?.from) params.append('startDate', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.append('endDate', format(dateRange.to, 'yyyy-MM-dd'));
    
    navigate(`/retreats?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex flex-col md:flex-row gap-2 p-2 bg-white rounded-lg shadow-lg">
        {/* Location */}
        <div className="flex-1 relative">
          <div className="flex items-center h-12 px-4 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full focus:outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Category */}
        <div className="relative">
          <div 
            className="flex items-center h-12 px-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Tag className="w-5 h-5 text-gray-400 mr-2" />
            <span className={category ? 'text-gray-900' : 'text-gray-500'}>
              {category || 'What are you seeking?'}
            </span>
          </div>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none"
                  onClick={() => {
                    setCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="relative">
          <div 
            className="flex items-center h-12 px-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <span className={dateRange?.from ? 'text-gray-900' : 'text-gray-500'}>
              {dateRange?.from
                ? `${format(dateRange.from, 'MMM d')}${
                    dateRange.to ? ` - ${format(dateRange.to, 'MMM d')}` : ''
                  }`
                : 'When are you going?'}
            </span>
          </div>

          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              {/* Add your date picker component here */}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="h-12 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;