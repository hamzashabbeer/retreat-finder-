import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

/**
 * Interface for the search parameters
 */
// interface SearchParams {
//   location?: string;
//   category?: string;
//   startDate?: string;
//   endDate?: string;
// }

interface DateRange {
  from: Date;
  to?: Date;
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
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

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

  const locations = [
    { label: "Anywhere", highlighted: true },
    { label: "India", highlighted: false },
    { label: "Asia", highlighted: false },
    { label: "Bali", subtext: "Indonesia", highlighted: false },
    { label: "Thailand", highlighted: false },
    { label: "Nepal", highlighted: false },
    { label: "Indonesia", highlighted: false },
    { label: "Vietnam", highlighted: false }
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
    <div className="w-full max-w-[920px] mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 py-1.5">
          {/* Location */}
          <div className="relative md:w-[260px] group">
            <div 
              className="flex flex-col px-8 py-3 cursor-pointer rounded-full transition-colors group-hover:bg-gray-50"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-gray-400" strokeWidth={2} />
                <label className="text-sm font-medium text-gray-900">Location</label>
              </div>
              <div className="pl-[26px]">
                <span className={`block text-base font-medium mt-1 truncate ${location ? 'text-gray-500' : 'text-gray-400'}`}>
                  {location || 'Where are you going?'}
                </span>
              </div>
            </div>

            {/* Location Dropdown */}
            {showLocationDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-lg max-h-[320px] overflow-auto border border-gray-100">
                {locations.map((loc) => (
                  <button
                    key={loc.label}
                    type="button"
                    className={`w-full px-6 py-4 text-left hover:bg-gray-50 flex flex-col ${
                      loc.highlighted ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setLocation(loc.label);
                      setShowLocationDropdown(false);
                    }}
                  >
                    <span className="font-medium text-gray-900">{loc.label}</span>
                    {loc.subtext && (
                      <span className="text-sm text-gray-500">{loc.subtext}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="relative md:w-[260px] group">
            <div 
              className="flex flex-col px-8 py-3 cursor-pointer rounded-full transition-colors group-hover:bg-gray-50"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <div className="flex items-center gap-1.5">
                <Tag className="w-5 h-5 text-gray-400" strokeWidth={2} />
                <label className="text-sm font-medium text-gray-900">Category</label>
              </div>
              <div className="pl-[26px]">
                <span className={`block text-base font-medium mt-1 truncate ${category ? 'text-gray-500' : 'text-gray-400'}`}>
                  {category || 'What type of retreat?'}
                </span>
              </div>
            </div>

            {/* Category Dropdown */}
            {showCategoryDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-lg max-h-[320px] overflow-auto border border-gray-100">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className="w-full px-6 py-4 text-left hover:bg-gray-50"
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <span className="font-medium text-gray-900">{cat}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="relative md:w-[260px] group">
            <div 
              className="flex flex-col px-8 py-3 cursor-pointer rounded-full transition-colors group-hover:bg-gray-50"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-gray-400" strokeWidth={2} />
                <label className="text-sm font-medium text-gray-900">Dates</label>
              </div>
              <div className="pl-[26px]">
                <span className={`block text-base font-medium mt-1 truncate ${dateRange?.from ? 'text-gray-500' : 'text-gray-400'}`}>
                  {dateRange?.from
                    ? `${format(dateRange.from, 'MMM d')} - ${dateRange.to ? format(dateRange.to, 'MMM d') : 'Select'}`
                    : 'When do you want to go?'}
                </span>
              </div>
            </div>

            {/* Date Picker */}
            {showDatePicker && (
              <div className="absolute z-20 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={(range: any) => {
                    setDateRange(range);
                    if (range?.to) setShowDatePicker(false);
                  }}
                  numberOfMonths={2}
                  className="bg-white"
                />
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-5 h-5" strokeWidth={2} />
            <span className="font-medium">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;