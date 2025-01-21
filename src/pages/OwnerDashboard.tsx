import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@lib/supabase';
import { PlusCircle, Settings, Calendar, Users, BarChart } from 'lucide-react';
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

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth/owner/login');
          return;
        }

        // Fetch owner's retreats
        const { data: retreatsData, error: retreatsError } = await supabase
          .from('retreats')
          .select('*')
          .eq('hostId', user.id);

        if (retreatsError) throw retreatsError;
        
        setRetreats(retreatsData || []);
        
        // Calculate stats
        const now = new Date();
        const activeRetreats = retreatsData?.filter(retreat => 
          new Date(retreat.endDate) >= now
        ) || [];

        // Fetch bookings (you'll need to create this table in Supabase)
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('hostId', user.id);

        if (bookingsError) throw bookingsError;

        setStats({
          totalRetreats: retreatsData?.length || 0,
          activeRetreats: activeRetreats.length,
          totalBookings: bookingsData?.length || 0,
          revenue: bookingsData?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/owner/login');
        return;
      }

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
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: ["Meditation", "Yoga"],
        amenities: ["Mountain View", "Spa", "Organic Meals"],
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
        hostId: user.id,
        rating: 0,
        reviewCount: 0
      };

      const { data, error } = await supabase
        .from('retreats')
        .insert([newRetreat])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setRetreats(prev => [...prev, data]);
      setStats(prev => ({
        ...prev,
        totalRetreats: prev.totalRetreats + 1,
        activeRetreats: prev.activeRetreats + 1
      }));

      // Navigate to edit page (you'll need to create this)
      navigate(`/retreats/${data.id}/edit`);

    } catch (err) {
      console.error('Error adding retreat:', err);
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
        <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Retreats</h3>
            <BarChart className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.totalRetreats}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Active Retreats</h3>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.activeRetreats}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Bookings</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.totalBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Revenue</h3>
            <Settings className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-semibold mt-2">${stats.revenue}</p>
        </div>
      </div>

      {/* Add Retreat Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Retreats</h2>
        <button
          onClick={handleAddRetreat}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Retreat
        </button>
      </div>

      {/* Retreats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retreats.map(retreat => (
          <div key={retreat.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={retreat.images[0]}
              alt={retreat.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{retreat.title}</h3>
              <p className="text-gray-600 mb-4">{retreat.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-medium">
                  ${retreat.price.amount}/night
                </span>
                <button
                  onClick={() => navigate(`/retreats/${retreat.id}/edit`)}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard; 