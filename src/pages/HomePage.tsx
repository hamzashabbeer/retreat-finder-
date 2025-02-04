import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/forms/SearchBar';
import CallToAction from '../components/layout/CallToAction';

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
    <div>
      {/* Hero Section */}
      <div className="w-[1150px] mx-auto pt-[100px] pb-20">
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

      {/* Featured In Section */}
      <div className="w-full bg-[#F1F5F9] py-16">
        <div className="w-[1150px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
              <span className="text-blue-600 font-medium text-sm tracking-wider uppercase">Featured In</span>
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
            </div>
            <h2 className="text-[32px] font-semibold text-gray-900">Leading Publications Trust Us</h2>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-x-16 gap-y-12 items-center justify-items-center px-8">
            {/* Forbes */}
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <p className="text-[28px] font-serif font-bold tracking-tight text-gray-800 group-hover:text-blue-600 transition-colors">
                FORBES
              </p>
            </div>
            
            {/* National Geographic */}
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <p className="text-xl font-bold uppercase tracking-widest text-yellow-600 group-hover:text-yellow-500 transition-colors text-center">
                National<br/>Geographic
              </p>
            </div>
            
            {/* Conde Nast */}
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <p className="text-2xl font-serif italic font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                Condé Nast
              </p>
            </div>
            
            {/* Lonely Planet */}
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <p className="text-[26px] font-sans-serif font-bold text-blue-500 group-hover:text-blue-600 transition-colors">
                Lonely Planet
              </p>
            </div>
            
            {/* Travel + Leisure */}
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <p className="text-xl font-serif uppercase tracking-wider text-gray-800 group-hover:text-blue-600 transition-colors text-center">
                Travel +<br/>Leisure
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Join thousands of satisfied travelers who have discovered their perfect retreat through our trusted platform
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="w-full bg-white py-24">
        <div className="max-w-[1150px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <span className="text-blue-600 font-medium text-sm tracking-wider uppercase">About Find Retreat</span>
                <h2 className="text-[42px] font-semibold text-gray-900 mt-3 leading-tight">
                  Your Journey to Inner Peace Starts Here
                </h2>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                We curate the world's finest wellness retreats, making it easy for you to discover, compare, and book transformative experiences that align with your personal journey.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <p className="text-gray-600">Verified Retreats</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50k+</div>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                  <p className="text-gray-600">Secure Booking</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <p className="text-gray-600">Support Available</p>
                </div>
              </div>

              <Link to="/about">
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Learn More About Us
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>

            {/* Right Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-[280px] transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1545205597-3d9d02c29597" 
                      alt="Meditation" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-[200px] transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1506126613408-eca07ce68773" 
                      alt="Yoga" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden h-[200px] transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b" 
                      alt="Wellness" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-[280px] transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1599447421416-3414500d18a5" 
                      alt="Adventure" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="w-full bg-[#F1F5F9]">
        <div className="max-w-[1150px] mx-auto px-4 py-24">
          <div className="flex justify-between items-end gap-8 mb-16">
            <div className="max-w-xl">
              <span className="text-blue-600 font-medium text-sm tracking-wider uppercase mb-4 block">Explore</span>
              <h2 className="text-[42px] font-semibold text-gray-900 leading-tight">
                Find Your Perfect Retreat Experience
              </h2>
              <p className="text-gray-500 text-lg mt-4 leading-relaxed">
                Discover transformative experiences tailored to your wellness journey, from meditation retreats to yoga escapes.
              </p>
            </div>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              View All Categories
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Large Card 1 */}
            <div className="col-span-12 md:col-span-8">
              <div className="group h-[400px] relative rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1545205597-3d9d02c29597" 
                    alt="Meditation Retreats" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium inline-block mb-4">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Meditation Retreats</h3>
                  <p className="text-gray-200">Find inner peace and mindfulness</p>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="col-span-12 md:col-span-4">
              <div className="group h-[400px] relative rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773" 
                    alt="Yoga Retreats" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium inline-block mb-4">
                    Featured
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Yoga Retreats</h3>
                  <p className="text-gray-200">Transform body and mind</p>
                </div>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="col-span-12 md:col-span-4">
              <div className="group h-[350px] relative rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b" 
                    alt="Wellness Retreats" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium inline-block mb-4">
                    Trending
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Wellness Retreats</h3>
                  <p className="text-gray-200">Rejuvenate your whole being</p>
                </div>
              </div>
            </div>

            {/* Large Card 2 */}
            <div className="col-span-12 md:col-span-8">
              <div className="group h-[350px] relative rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1599447421416-3414500d18a5" 
                    alt="Adventure Retreats" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium inline-block mb-4">
                    New
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Adventure Retreats</h3>
                  <p className="text-gray-200">Challenge yourself in nature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Retreats Section */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-[1150px] mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
              <span className="text-blue-600 font-medium text-sm tracking-wider uppercase">Featured Experiences</span>
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
            </div>
            <h2 className="text-[32px] font-semibold text-gray-900 mb-4">Transformative Retreats Await</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our carefully curated selection of life-changing experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRetreats.map((retreat) => (
              <div key={retreat.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-[240px] overflow-hidden">
                  <img
                    src={retreat.images[0]}
                    alt={retreat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {retreat.type.map((type) => (
                      <span key={type} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center text-yellow-400">
                      {"★".repeat(Math.floor(retreat.rating))}
                      {"☆".repeat(5 - Math.floor(retreat.rating))}
                    </div>
                    <span className="text-gray-600 text-sm">({retreat.reviewCount} reviews)</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{retreat.title}</h3>
                  <p className="text-gray-600 mb-4">{retreat.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-gray-900">
                      <span className="text-2xl font-bold">${retreat.price.amount}</span>
                      <span className="text-gray-600 text-sm"> / person</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Explore All Retreats
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-[1150px] mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Begin Your Journey to Inner Peace</h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Transform your life with our curated wellness experiences. Your path to serenity starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Your Journey
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1150px] mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <img 
                src="/src/assets/logos/logo.png" 
                alt="FindRetreat Logo" 
                className="h-12 w-auto"
              />
              <p className="text-gray-600">
                Discover and book the best wellness retreats worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Meditation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Yoga</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Wellness</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Spiritual</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h4>
              <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 FindRetreat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 