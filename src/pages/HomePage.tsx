import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/forms/SearchBar';
import CallToAction from '../components/layout/CallToAction';
import { Check } from 'lucide-react';

const HomePage: React.FC = () => {
  // Mock data for featured retreats
  const featuredRetreats = [
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
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
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
      images: ["https://images.unsplash.com/photo-1540541338287-41700207dee6"],
      hostId: "host2",
      rating: 4.9,
      reviewCount: 18
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      title: "Desert Wellness Escape",
      description: "A luxurious wellness retreat in the heart of the Arabian desert",
      location: {
        city: "Dubai",
        country: "UAE",
        coordinates: {
          lat: 25.2048,
          lng: 55.2708
        }
      },
      price: {
        amount: 399,
        currency: "USD"
      },
      duration: 4,
      startDate: "2024-07-15",
      endDate: "2024-07-19",
      type: ["Wellness", "Luxury"],
      amenities: ["Spa", "Private Pool", "Gourmet Dining"],
      images: ["https://images.unsplash.com/photo-1582653291997-079a1c04e5a1"],
      hostId: "host3",
      rating: 4.7,
      reviewCount: 31
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Perfect Retreat
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover and book the best wellness retreats worldwide. Your journey to peace and rejuvenation starts here.
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative bg-white p-6 rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">Verified Retreats</h3>
              <p className="mt-2 text-gray-600">All our retreats are personally verified for quality and authenticity.</p>
            </div>

            <div className="relative bg-white p-6 rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">Best Price Guarantee</h3>
              <p className="mt-2 text-gray-600">Find the best prices for your wellness journey, guaranteed.</p>
            </div>

            <div className="relative bg-white p-6 rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">24/7 Support</h3>
              <p className="mt-2 text-gray-600">Our dedicated team is here to help you every step of the way.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  );
};

export default HomePage; 