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
    {
      label: "Anywhere",
      highlighted: true
    },
    {
      label: "India",
      highlighted: false
    },
    {
      label: "Asia",
      highlighted: false
    },
    {
      label: "Bali",
      subtext: "Indonesia",
      highlighted: false
    },
    {
      label: "Thailand",
      highlighted: false
    },
    {
      label: "Nepal",
      highlighted: false
    },
    {
      label: "Indonesia",
      highlighted: false
    },
    {
      label: "Vietnam",
      highlighted: false
    }
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
    <form onSubmit={handleSubmit} className="relative w-[920px] mx-auto">
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
                  className={`