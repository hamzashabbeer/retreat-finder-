import React from 'react';
import SearchBar from '@components/forms/SearchBar';
import RetreatCard from '@components/common/RetreatCard';
import { Check } from 'lucide-react';
import type { Retreat } from '@types';

const HomePage: React.FC = () => {
  // Mock data for featured retreats
  const featuredRetreats: Retreat[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
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
      id: "550e8400-e29b-41d4-a716-446655440001",
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
    { name: "Meditation", icon: "🧘‍♀️", description: "Find inner peace and mindfulness" },
    { name: "Yoga", icon: "🌟", description: "Transform body, mind and spirit" },
    { name: "Wellness", icon: "💆‍♀️", description: "Rejuvenate your whole being" },
    { name: "Adventure", icon: "🏃‍♂️", description: "Challenge yourself in nature" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1532798442725-41036acc7489?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover the best handpicked retreats and trainings on the planet
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Unplug. De-stress. Recharge.
            </p>
            <div className="mb-8">
              <SearchBar />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Best price, guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>FREE cancellation available</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>No booking fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="flex items-center justify-center">
                  <span className="text-5xl">{category.icon}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Retreats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Retreats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRetreats.map((retreat) => (
              <RetreatCard key={retreat.id} retreat={retreat} />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative bg-blue-600 py-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="CTA background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Host Your Retreat?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of retreat hosts and share your transformative experiences with the world
          </p>
          <button className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
            Become a Host
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 