import React from 'react';
import { Check } from 'lucide-react';
import CallToAction from '../components/layout/CallToAction';

const HomePage: React.FC = () => {
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