import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Star, Check, Shield, Sparkle, ChevronRight, X, Grid, Heart, ChevronDown } from 'lucide-react';
import { supabase } from '@lib/supabase';
import type { Retreat } from '@types';

const RetreatDetails: React.FC = () => {
  const { id } = useParams();
  const [retreat, setRetreat] = React.useState<Retreat | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    summary: boolean;
    description: boolean;
  }>({
    summary: false,
    description: false
  });

  React.useEffect(() => {
    const fetchRetreat = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('retreats')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setRetreat(data);
      } catch (err) {
        console.error('Error fetching retreat:', err);
        setError(err instanceof Error ? err.message : 'Failed to load retreat');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRetreat();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !retreat) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/retreats" className="hover:text-indigo-600 transition-colors">Retreats</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-indigo-600 font-medium">{retreat.title}</span>
        </nav>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4 hover:text-indigo-600 transition-colors">
                {retreat.title}
              </h1>

              {/* Reviews, Location, and Badges Row */}
              <div className="flex items-center flex-wrap gap-4">
                {/* Rating */}
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors cursor-pointer group">
                  <Star className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-900">{retreat.rating.toFixed(2)}</span>
                  <span className="text-gray-500 group-hover:text-gray-700 transition-colors">({retreat.reviewCount} reviews)</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer group">
                  <MapPin className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-900">{retreat.location.city}, {retreat.location.country}</span>
                </div>

                {/* Top Rated Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer group">
                  <Sparkle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Top Rated Retreat</span>
                </div>

                {/* Verified Host Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors cursor-pointer group">
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Verified Host</span>
                </div>
              </div>
            </div>

            {/* Best Price Badge and Book Now Button */}
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors cursor-pointer group">
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Best Price Guarantee</span>
              </div>
              <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl active:translate-y-0">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-2 gap-4">
            {/* Main Large Image */}
            <div className="relative h-[480px] rounded-xl overflow-hidden group">
              <img 
                src={retreat.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'} 
                alt={retreat.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Recently booked badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Recently booked!</span>
              </div>
            </div>

            {/* Right Side Images Grid */}
            <div className="grid grid-cols-2 gap-4 h-[480px]">
              {[1, 2, 3].map((index) => (
                <div key={index} className="relative rounded-xl overflow-hidden group">
                  <img 
                    src={retreat.images?.[index] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'} 
                    alt={`${retreat.title} ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
              
              {/* Show All Photos Button */}
              <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img 
                  src={retreat.images?.[4] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'} 
                  alt={`${retreat.title} 5`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <button 
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center"
                >
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg transform group-hover:scale-110 transition-all duration-300 hover:bg-gray-50">
                    <Grid className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-sm text-gray-700">Show all photos</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
              <div className="relative">
                <div className={`prose prose-lg max-w-none ${!expandedSections.summary && 'max-h-48 overflow-hidden'}`}>
                  <p className="text-gray-600 leading-relaxed">
                    {retreat.description}
                  </p>
                  {/* Add more summary content here */}
                </div>
                {!expandedSections.summary && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, summary: !prev.summary }))}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 group"
              >
                {expandedSections.summary ? 'Show less' : 'Show more'}
                <ChevronDown className={`w-4 h-4 transform transition-transform group-hover:translate-y-0.5 ${expandedSections.summary ? 'rotate-180' : ''}`} />
              </button>
            </section>

            {/* Features Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Styles</h3>
                    <div className="space-y-3">
                      {['Hatha Yoga', 'Vinyasa Yoga'].map((style, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{style}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Level</h3>
                    <div className="space-y-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map((level, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
              <div className="relative">
                <div className={`prose prose-lg max-w-none ${!expandedSections.description && 'max-h-48 overflow-hidden'}`}>
                  <p className="text-gray-600 leading-relaxed">
                    {retreat.description}
                  </p>
                </div>
                {!expandedSections.description && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, description: !prev.description }))}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 group"
              >
                {expandedSections.description ? 'Show less' : 'Show more'}
                <ChevronDown className={`w-4 h-4 transform transition-transform group-hover:translate-y-0.5 ${expandedSections.description ? 'rotate-180' : ''}`} />
              </button>
            </section>

            {/* Cancellation Policy Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cancellation Policy</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-stretch gap-6">
                  <div className="relative w-1 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 rounded-full flex-shrink-0 self-stretch" />
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 hover:bg-green-200 transition-colors">
                        <span className="text-xl font-bold text-green-600">100%</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Full Refund</div>
                        <div className="text-sm text-gray-500">60 days before retreat start date</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 hover:bg-yellow-200 transition-colors">
                        <span className="text-xl font-bold text-yellow-600">50%</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Partial Refund</div>
                        <div className="text-sm text-gray-500">30-59 days before retreat start date</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 hover:bg-red-200 transition-colors">
                        <span className="text-xl font-bold text-red-600">0%</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">No Refund</div>
                        <div className="text-sm text-gray-500">0-29 days before retreat start date</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Be more relaxed and refreshed than you've ever been",
                  "Become stronger mentally and find inner peace",
                  "A chance to get away and step aside from all the hustle and bustle of city life",
                  "Peace and quiet for the mind, refreshing energy for the body"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 bg-red-50 rounded-xl p-4">
                    <Heart className="w-5 h-5 text-red-500 mt-1" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* What's Included Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Welcome drink - coconut water, juice, tea or coffee',
                  '7 nights accommodation in a quiet place with a view on jungle or rice terrace',
                  '3 daily delicious and nutritious meals',
                  'Daily morning yoga practice',
                  'One acupuncture session with Oriental Healing specialist (1h)',
                  'Two balinese massages',
                  '1 hour hot stone massage',
                  '1 hour foot reflexology massage',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* What's Not Included Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Not Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Airport transfer',
                  'Travel insurance',
                  'Visa fee',
                  'Personal expenses',
                  'Additional treatments',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-red-50 rounded-xl p-4">
                    <X className="w-5 h-5 text-red-500 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Staff Insights Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Insights</h2>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-start gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Staff member"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Connie</h3>
                    <p className="text-indigo-600 font-medium mb-4">Support Team</p>
                    <p className="text-gray-600 leading-relaxed italic">
                      "Oh Bali! The ultimate hub for health, wellness, and yoga lovers - definitely the place to come if you're looking for a full mind & body reset."
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 group cursor-pointer">
                  <span className="group-hover:text-indigo-600 transition-colors">${retreat.price.amount}</span>
                  <span className="text-lg text-gray-500 font-normal group-hover:text-gray-700 transition-colors">/{retreat.duration} days</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">Best price guarantee • No booking fees</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <Calendar className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-gray-900">Duration</div>
                    <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{retreat.duration} days</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <Clock className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-gray-900">Start Date</div>
                    <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      {new Date(retreat.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <Users className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-gray-900">Type</div>
                    <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{retreat.type.join(', ')}</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-500 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0">
                Book Now
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer group">
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Free cancellation up to 24 hours before start</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {showAllPhotos && <PhotoGalleryModal />}
    </div>
  );
};

export default RetreatDetails; 