import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Star, Check } from 'lucide-react';
import { supabase } from '@lib/supabase';
import type { Retreat } from '@types';

const RetreatDetails: React.FC = () => {
  const { id } = useParams();
  const [retreat, setRetreat] = React.useState<Retreat | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{retreat.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{retreat.location.city}, {retreat.location.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>{retreat.rating} ({retreat.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img 
                src={retreat.images[0]} 
                alt={retreat.title}
                className="w-full h-full object-cover"
              />
            </div>
            {retreat.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {retreat.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${retreat.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{retreat.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {retreat.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-indigo-600">
                ${retreat.price.amount}
                <span className="text-lg text-gray-500">/{retreat.duration} days</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-sm text-gray-500">{retreat.duration} days</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-semibold">Start Date</div>
                  <div className="text-sm text-gray-500">
                    {new Date(retreat.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-semibold">Type</div>
                  <div className="text-sm text-gray-500">{retreat.type.join(', ')}</div>
                </div>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Book Now
            </button>

            <div className="mt-4 text-sm text-gray-500 text-center">
              Free cancellation up to 24 hours before start
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetreatDetails; 