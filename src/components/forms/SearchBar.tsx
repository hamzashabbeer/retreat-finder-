import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { createPortal } from 'react-dom';
import { supabase, verifyAndCreateLocationsTable, verifyAndCreateRetreatTypesTable } from '@lib/supabase';

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

interface DateRange {
  from: Date;
  to?: Date;
}

interface Location {
  id: string;
  city: string;
  country: string;
}

interface RetreatType {
  id: string;
  name: string;
  description: string;
  icon: string;
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [retreatTypes, setRetreatTypes] = useState<RetreatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verify and create tables if they don't exist
        await verifyAndCreateLocationsTable();
        await verifyAndCreateRetreatTypesTable();
        
        // Fetch locations
        const { data: locationsData, error: locationsError } = await supabase
          .from('locations')
          .select('*')
          .order('city', { ascending: true });

        if (locationsError) {
          console.error('Error fetching locations:', locationsError);
          throw locationsError;
        }
        setLocations(locationsData || []);

        // Fetch retreat types
        const { data: typesData, error: typesError } = await supabase
          .from('retreat_types')
          .select('*')
          .order('name', { ascending: true });

        if (typesError) {
          console.error('Error fetching retreat types:', typesError);
          throw typesError;
        }
        setRetreatTypes(typesData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const renderDropdown = (
    isOpen: boolean,
    content: React.ReactNode,
    targetRef: React.RefObject<HTMLDivElement>
  ) => {
    if (!isOpen || !targetRef.current) return null;

    const rect = targetRef.current.getBoundingClientRect();
    const style = {
      position: 'fixed' as const,
      top: `${rect.bottom + window.scrollY + 8}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      zIndex: 9999,
    };

    return createPortal(
      <div style={style}>{content}</div>,
      document.body
    );
  };

  return (
    <div className="relative z-[100]">
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
              <div className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-lg max-h-[320px] overflow-auto border border-gray-100 z-[110]">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading locations...</div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">{error}</div>
                ) : (
                  <>
                    <button
                      key="anywhere"
                      type="button"
                      className="w-full px-5 py-3 text-left hover:bg-gray-50 bg-blue-500 hover:bg-blue-400 text-white"
                      onClick={() => {
                        setLocation('Anywhere');
                        setShowLocationDropdown(false);
                      }}
                    >
                      <span className="block text-[15px] font-medium">Anywhere</span>
                    </button>
                    {locations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        className="w-full px-5 py-3 text-left hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                        onClick={() => {
                          setLocation(`${loc.city}, ${loc.country}`);
                          setShowLocationDropdown(false);
                        }}
                      >
                        <span className="block text-[15px] font-medium">{loc.city}</span>
                        <span className="block text-sm mt-0.5 opacity-70">{loc.country}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="relative md:w-[260px] group">
            <div 
              className="flex flex-col px-8 py-3 cursor-pointer border-t md:border-t-0 md:border-l border-gray-100 rounded-full transition-colors group-hover:bg-gray-50"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <div className="flex items-center gap-1.5">
                <Tag className="w-5 h-5 text-gray-400" strokeWidth={2} />
                <label className="text-sm font-medium text-gray-900">Category</label>
              </div>
              <div className="pl-[26px]">
                <span className={`block text-base font-medium mt-1 truncate ${category ? 'text-gray-500' : 'text-gray-400'}`}>
                  {category || 'What are you seeking?'}
                </span>
              </div>
            </div>

            {/* Category Dropdown */}
            {showCategoryDropdown && (
              <div className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-lg max-h-[280px] overflow-auto border border-gray-100 z-[110]">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading categories...</div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">{error}</div>
                ) : (
                  retreatTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className="w-full px-5 py-3 text-left hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        setCategory(type.name);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{type.icon}</span>
                        <div>
                          <div className="text-[15px] font-medium">{type.name}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="relative md:w-[260px] group">
            <div 
              className="flex flex-col px-8 py-3 cursor-pointer border-t md:border-t-0 md:border-l border-gray-100 rounded-full transition-colors group-hover:bg-gray-50"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-gray-400" strokeWidth={2} />
                <label className="text-sm font-medium text-gray-900">Dates</label>
              </div>
              <div className="pl-[26px]">
                <span className={`block text-base font-medium mt-1 truncate ${dateRange?.from ? 'text-gray-500' : 'text-gray-400'}`}>
                  {dateRange?.from
                    ? `${format(dateRange.from, 'MMM d')}${
                        dateRange.to ? ` - ${format(dateRange.to, 'MMM d')}` : ''
                      }`
                    : 'When are you going?'}
                </span>
              </div>
            </div>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute left-0 mt-2 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 z-[110]">
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  numberOfMonths={2}
                  className="bg-white"
                />
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex items-center pr-4">
            <button
              type="submit"
              className="h-[60px] w-[60px] bg-blue-500 text-white rounded-full hover:bg-blue-400 flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Search className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;