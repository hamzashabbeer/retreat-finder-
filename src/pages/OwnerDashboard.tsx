import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@lib/supabase';
import { PlusCircle, Settings, Calendar, Users, BarChart } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        navigate('/auth/owner/login');
        return;
      }

      // Check if user is an owner
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError || profileData?.role !== 'owner') {
        navigate('/auth/owner/login');
        return;
      }

      // Load dashboard data
      loadDashboardData(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const loadDashboardData = async (userId: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual data fetching from Supabase
      // For now using mock data
      setStats({
        totalRetreats: 5,
        activeRetreats: 3,
        totalBookings: 25,
        revenue: 12500
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500">Manage your retreats and bookings</p>
          </div>
          <button
            onClick={() => navigate('/retreats/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Retreat
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Total Retreats</h3>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold">{stats.totalRetreats}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Active Retreats</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold">{stats.activeRetreats}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Total Bookings</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold">{stats.totalBookings}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Total Revenue</h3>
              <BarChart className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold">${stats.revenue}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Recent Bookings</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-4">No recent bookings</p>
            </div>
          </div>

          {/* Your Retreats */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Your Retreats</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-4">No retreats found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard; 