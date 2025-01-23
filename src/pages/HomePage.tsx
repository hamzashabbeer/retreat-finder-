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
    <div>
      {/* Hero Section */}
      <div className="w-[1150px] mx-auto pt-[100px]">
        <div className="flex justify-between items-center">
          {/* Left Column - Text */}
          <div className="w-[450px] space-y-6 text-center">
            <h1 className="text-[34px] lg:text-[42px] font-bold leading-tight text-gray-900">
              Discover the best handpicked retreats and trainings on the planet
            </h1>
            <p className="text-xl text-gray-600">
              Unplug. De-stress. Recharge.
            </p>
          </div>

          {/* Right Column - Images */}
          <div className="relative w-[686px] h-[393px]">
            {/* First image (left) */}
            <div className="absolute left-0 w-[218px] h-[393px] rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Yoga practice"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Second image (top right) */}
            <div className="absolute left-[233px] top-[37px] w-[357px] h-[186px] rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Group yoga session"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Third image (bottom left) */}
            <div className="absolute left-[233px] bottom-0 w-[286px] h-[155px] rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Meditation session"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Fourth image (bottom right) */}
            <div className="absolute left-[534px] bottom-0 w-[173px] h-[141px] rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Yoga pose"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mt-12">
          <SearchBar />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-blue-500" />
            <span>Best price, guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-blue-500" />
            <span>FREE cancellation available</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-blue-500" />
            <span>No booking fees</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer border border-gray-100"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex items-center justify-center">
                  <span className="text-3xl">{category.icon}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Retreats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Retreats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRetreats.map((retreat) => (
              <RetreatCard key={retreat.id} retreat={retreat} />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Host Your Retreat?</h2>
          <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
            Join our community of retreat hosts and share your transformative experiences with the world
          </p>
          <button className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
            Become a Host
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 