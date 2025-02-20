import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Star, Check, Shield, Sparkle, ChevronRight, X, Grid, Heart, ChevronDown } from 'lucide-react';
import { useWishlist } from '@context/WishlistContext';
import { supabase } from '@lib/supabase';
import type { Retreat } from '@types';

const RetreatDetails: React.FC = () => {
  const { id } = useParams();
  const [retreat, setRetreat] = useState<Retreat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    summary: boolean;
    description: boolean;
  }>({
    summary: false,
    description: false
  });
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = retreat ? isInWishlist(retreat.id) : false;

  useEffect(() => {
    fetchRetreat();
  }, [id]);

  const fetchRetreat = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('retreats')
        .select(`
          *,
          location:locations(
            id,
            city,
            country,
            coordinates
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Retreat not found');

      console.log('Fetched retreat data:', data); // Debug log
      setRetreat(data);
    } catch (err) {
      console.error('Error fetching retreat:', err);
      setError(err instanceof Error ? err.message : 'Failed to load retreat');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to split text into points
  const splitIntoPoints = (text: string) => {
    return text?.split('\n').filter(point => point.trim().length > 0) || [];
  };

  const handleWishlistClick = () => {
    if (!retreat) return;
    
    if (isInWishlist(retreat.id)) {
      removeFromWishlist(retreat.id);
    } else {
      addToWishlist(retreat);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !retreat) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Retreat not found'}
        </div>
      </div>
    );
  }

  const PhotoGalleryModal = () => (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="relative min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-white">All Photos</h2>
            <button 
              onClick={() => setShowAllPhotos(false)}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {retreat.images.map((image, index) => (
              <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden group">
                <img 
                  src={image} 
                  alt={`${retreat.title} ${index + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Breadcrumbs */}
      <div className="relative py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link to="/" className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
              <MapPin className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/retreats" className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
              Retreats
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">{retreat.title}</span>
          </nav>

          {/* Main Heading Box */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-indigo-50/50 via-white to-white">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <div className="space-y-6 flex-1">
                  {/* Type Tags */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {retreat.type?.map((type) => (
                      <span key={type} className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-sm font-medium shadow-sm border border-indigo-100 hover:shadow-md transition-all duration-200">
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Title and Info */}
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{retreat.title}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-medium text-gray-900">{retreat.location?.city}, {retreat.location?.country}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Start Date</div>
                          <div className="font-medium text-gray-900">{formatDate(retreat.start_date)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-medium text-gray-900">{retreat.duration} days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Card */}
                <div className="flex-shrink-0 w-full lg:w-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="w-8 h-8 text-yellow-400 fill-current" />
                        <span className="text-2xl font-bold text-gray-900 ml-2">{retreat.rating.toFixed(1)}</span>
                      </div>
                      <div className="h-12 w-px bg-gray-200"></div>
                      <div>
                        <div className="text-xs text-gray-500">Based on</div>
                        <div className="text-sm font-semibold text-gray-900">{retreat.review_count} reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Large Image */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden group h-[450px]">
              <img 
                src={retreat.images?.[0]} 
                alt={retreat.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Side Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {retreat.images?.slice(1, 5).map((image, index) => (
                <div key={index} className="relative rounded-2xl overflow-hidden group h-[215px]">
                  <img 
                    src={image}
                    alt={`${retreat.title} ${index + 2}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setShowAllPhotos(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Grid className="w-4 h-4" />
              <span>View all photos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Summary Section */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Summary</h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">{retreat.summary}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {retreat.features && splitIntoPoints(retreat.features).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Overview */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Perfect For</h3>
                  <p className="text-gray-600 text-sm">{retreat.atmosphere?.join(', ')}</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Skill Level</h3>
                  <p className="text-gray-600 text-sm">{retreat.skill_level?.join(', ')}</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Area</h3>
                  <p className="text-gray-600 text-sm">{retreat.area?.join(', ')}</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center">
                    <span role="img" aria-label="food" className="text-xl">🍽️</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Food Options</h3>
                  <p className="text-gray-600 text-sm">{retreat.food?.join(', ')}</p>
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About This Retreat</h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{retreat.description}</p>
              </div>
            </section>

            {/* Benefits Grid */}
            {retreat.benefits && (
              <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {splitIntoPoints(retreat.benefits).map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100/50">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Sparkle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <span className="text-gray-800">{benefit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What's Included/Not Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {retreat.whats_included && (
                <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    What's Included
                  </h2>
                  <div className="space-y-3">
                    {splitIntoPoints(retreat.whats_included).map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-white border border-green-100/50">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {retreat.whats_not_included && (
                <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    What's Not Included
                  </h2>
                  <div className="space-y-3">
                    {splitIntoPoints(retreat.whats_not_included).map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-white border border-red-100/50">
                        <X className="w-5 h-5 text-red-500 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Price Section */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">${retreat.price?.amount}</span>
                    <span className="text-gray-500">per person</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Best price guarantee • No booking fees</span>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Retreat Dates</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Start Date</div>
                      <div className="font-medium text-gray-900">{formatDate(retreat.start_date)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">End Date</div>
                      <div className="font-medium text-gray-900">{formatDate(retreat.end_date)}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 space-y-4">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 transform hover:-translate-y-0.5">
                    Book Now
                  </button>
                  <button 
                    onClick={handleWishlistClick}
                    className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 px-6 rounded-xl hover:bg-indigo-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                  >
                    <Heart className={isInWishlist(retreat.id) ? "fill-red-500 text-red-500" : ""} />
                    {isInWishlist(retreat.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>

                {/* Host Section */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hosted by Retreat Team</h3>
                      <p className="text-sm text-gray-500">Member since 2023</p>
                    </div>
                  </div>
                  <button className="w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Contact Host
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAllPhotos && <PhotoGalleryModal />}
    </div>
  );
};

export default RetreatDetails; 