import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Tag } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    if (dateRange) params.append('dates', dateRange);

    navigate(`/retreats?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="h-[60px] flex items-center gap-2 px-5 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Location */}
        <div className="flex-1 flex items-center gap-2 min-w-[200px]">
          <MapPin className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Where to?"
            className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
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