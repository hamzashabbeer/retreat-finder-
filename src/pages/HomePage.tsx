import React from 'react';
import SearchBar from '../components/forms/SearchBar';
import RetreatCard from '../components/common/RetreatCard';
import type { Retreat } from '../types';

const HomePage: React.FC = () => {
  // Mock data for featured retreats
  const featuredRetreats: Retreat[] = [
    {
      id: 1,
      title: "Mountain Zen Retreat",
      description: "A peaceful mountain retreat focused on mindfulness and meditation",
      location: {
        city: "Swiss Alps",
        country: "Switzerland",
        coordinates: {
          lat: 46.8182,
          lng: 8.2275
        }
      },
      price: {
        amount: 299,
        currency: "USD"
      },
      duration: 7,
      startDate: "2024-05-01",
      endDate: "2024-05-07",
      type: ["Meditation", "Yoga"],
      amenities: ["Mountain View", "Spa", "Organic Meals"],
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
      hostId: "host1",
      rating: 4.8,
      reviewCount: 24
    },
    {
      id: 2,
      title: "Beachside Meditation",
      description: "Find inner peace with the sound of waves in beautiful Bali",
      location: {
        city: "Bali",
        country: "Indonesia",
        coordinates: {
          lat: -8.4095,
          lng: 115.1889
        }
      },
      price: {
        amount: 199,
        currency: "USD"
      },
      duration: 5,
      startDate: "2024-06-01",
      endDate: "2024-06-05",
      type: ["Meditation", "Wellness"],
      amenities: ["Beach Access", "Pool", "Yoga Studio"],
      images: ["https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
      hostId: "host2",
      rating: 4.9,
      reviewCount: 18
    }
  ];

  const categories = [
    { name: "Meditation", icon: "🧘‍♀️" },
    { name: "Yoga", icon: "🌟" },
    { name: "Wellness", icon: "💆‍♀️" },
    { name: "Adventure", icon: "🏃‍♂️" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl font-bold mb-6 text-center">
            Find Your Perfect Retreat
          </h1>
          <p className="text-xl mb-8 text-center max-w-2xl">
            Discover peaceful retreats worldwide for meditation, yoga, and spiritual growth
          </p>
          <div className="w-full max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Retreats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Retreats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRetreats.map((retreat) => (
            <RetreatCard key={retreat.id} retreat={retreat} />
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Host Your Retreat?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of retreat hosts and share your space with the world
          </p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Become a Host
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 