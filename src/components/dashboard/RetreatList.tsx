import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@lib/supabase';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Retreat } from '@types';

const RetreatList: React.FC = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRetreats();
  }, []);

  const fetchRetreats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('retreats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRetreats(data || []);
    } catch (err) {
      console.error('Error fetching retreats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch retreats');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this retreat?')) return;

    try {
      const { error } = await supabase
        .from('retreats')
        .delete()
        .eq('id', id.toString());

      if (error) throw error;
      setRetreats(retreats.filter(retreat => retreat.id !== id));
    } catch (err) {
      console.error('Error deleting retreat:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete retreat');
    }
  };

  const filteredRetreats = retreats.filter(retreat =>
    retreat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retreat.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retreat.location.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading retreats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Retreats</h1>
        <Link
          to="/dashboard/retreats/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Retreat
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search retreats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredRetreats.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No retreats found
            </div>
          ) : (
            filteredRetreats.map((retreat) => (
              <div key={retreat.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{retreat.title}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      {retreat.location.city}, {retreat.location.country}
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        ${retreat.price.amount} per person
                      </span>
                      <span className="text-sm text-gray-600">
                        {retreat.duration} days
                      </span>
                      <div className="flex gap-1">
                        {retreat.type.map((type, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/retreats/edit/${retreat.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(retreat.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RetreatList; 