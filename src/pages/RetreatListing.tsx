import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SortAsc } from 'lucide-react';
import RetreatCard from '../components/common/RetreatCard';
import type { Retreat } from '../types';

const RetreatListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');

  // Mock data - This will be replaced with Supabase data
  const retreats: Retreat[] = [
    {
      id: "1",
      owner_id: "host1",
      title: "Mountain Zen Retreat",
      description: "A peaceful mountain retreat focused on mindfulness and meditation",
      location: "Swiss Alps, Switzerland",
      price_per_night: 299,
      type: "Meditation",
      amenities: ["Mountain View", "Spa", "Organic Meals"],
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
      max_guests: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Add more mock retreats here
  ];

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

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              
              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              </div>

              {/* Retreat Types */}
              <div>
                <h4 className="font-medium mb-2">Retreat Type</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {retreatTypes.map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="rounded text-indigo-600"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h4 className="font-medium mb-2">Duration</h4>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <label key={duration} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDuration.includes(duration)}
                        onChange={() => setSelectedDuration(prev =>
                          prev.includes(duration)
                            ? prev.filter(d => d !== duration)
                            : [...prev, duration]
                        )}
                        className="rounded text-indigo-600"
                      />
                      <span>{duration}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-medium mb-2">Amenities</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {amenities.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded text-indigo-600"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and View Options */}
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
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{retreats.length} retreats</span>
            </div>
          </div>

          {/* Retreats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retreats.map(retreat => (
              <RetreatCard key={retreat.id} retreat={retreat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetreatListing; 