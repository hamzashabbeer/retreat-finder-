import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, verifyDatabaseStructure } from '@lib/supabase';
import { PlusCircle, Settings, Calendar, Users, BarChart, MapPin } from 'lucide-react';
import type { Retreat } from '@types';

interface DashboardStats {
  totalRetreats: number;
  activeRetreats: number;
  totalBookings: number;
  revenue: number;
}

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalRetreats: 0,
    activeRetreats: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify database structure
        await verifyDatabaseStructure();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          navigate('/auth/owner/login');
          return;
        }

        // Fetch retreats for this owner
        const { data: retreatsData, error: retreatsError } = await supabase
          .from('retreats')
          .select('*')
          .eq('hostId', user.id);

        if (retreatsError) throw retreatsError;

        setRetreats(retreatsData || []);

        // Calculate active retreats (end date is in the future)
        const now = new Date();
        const activeRetreats = (retreatsData || []).filter(retreat => 
          new Date(retreat.endDate) >= now
        );

        // Fetch bookings for all retreats
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .in('retreatId', (retreatsData || []).map(r => r.id));

        // Ignore "does not exist" error as the table might not be created yet
        if (bookingsError && !bookingsError.message.includes('does not exist')) {
          throw bookingsError;
        }

        setStats({
          totalRetreats: retreatsData?.length || 0,
          activeRetreats: activeRetreats.length,
          totalBookings: bookingsData?.length || 0,
          revenue: bookingsData?.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0) || 0
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleAddRetreat = async () => {
    try {
      console.log('Starting to add retreat...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }
      
      if (!user) {
        console.log('No user found, redirecting to login...');
        navigate('/auth/owner/login');
        return;
      }

      console.log('Creating new retreat for user:', user.id);

      // Create a new retreat with default values
      const newRetreat = {
        title: "New Mountain Retreat",
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
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: ["Meditation", "Yoga"],
        amenities: ["Mountain View", "Spa", "Organic Meals"],
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
        hostId: user.id
      };

      console.log('Attempting to insert retreat:', newRetreat);

      const { data, error: insertError } = await supabase
        .from('retreats')
        .insert([newRetreat])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting retreat:', insertError);
        throw new Error(`Failed to insert retreat: ${insertError.message}`);
      }

      if (!data) {
        throw new Error('No data returned after inserting retreat');
      }

      console.log('Successfully added retreat:', data);

      // Update local state
      setRetreats(prev => [...prev, data]);
      setStats(prev => ({
        ...prev,
        totalRetreats: prev.totalRetreats + 1,
        activeRetreats: prev.activeRetreats + 1
      }));

      // Navigate to the edit page for the new retreat
      navigate(`/retreats/${data.id}/edit`);

    } catch (err) {
      console.error('Error in handleAddRetreat:', err);
      setError(err instanceof Error ? err.message : 'Failed to add retreat');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-8 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Retreats</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRetreats}</p>
            </div>
            <Settings className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Retreats</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeRetreats}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.revenue}</p>
            </div>
            <BarChart className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Retreats Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Retreats</h2>
          <button
            onClick={handleAddRetreat}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Retreat
          </button>
        </div>

        {retreats.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No retreats</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new retreat.</p>
            <div className="mt-6">
              <button
                onClick={handleAddRetreat}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Retreat
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retreats.map((retreat) => (
              <div
                key={retreat.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={retreat.images[0]}
                  alt={retreat.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{retreat.title}</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {retreat.location.city}, {retreat.location.country}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {retreat.duration} days • Starts {new Date(retreat.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard; 