import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase';
import { PlusCircle, Trash2 } from 'lucide-react';

interface RetreatType {
  id: string;
  name: string;
  description: string;
}

interface NewRetreatType {
  name: string;
  description: string;
}

const RetreatTypeManager: React.FC = () => {
  const [retreatTypes, setRetreatTypes] = useState<RetreatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<NewRetreatType>({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchRetreatTypes();
  }, []);

  const fetchRetreatTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('retreat_types')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setRetreatTypes(data || []);
    } catch (err) {
      console.error('Error fetching retreat types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch retreat types');
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = async () => {
    try {
      if (!newType.name || !newType.description) {
        setError('Please fill in all fields');
        return;
      }

      const { data, error } = await supabase
        .from('retreat_types')
        .insert([newType])
        .select()
        .single();

      if (error) throw error;

      setRetreatTypes([...retreatTypes, data]);
      setIsAdding(false);
      setNewType({ name: '', description: '' });
    } catch (err) {
      console.error('Error adding retreat type:', err);
      setError(err instanceof Error ? err.message : 'Failed to add retreat type');
    }
  };

  const handleDeleteType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('retreat_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRetreatTypes(retreatTypes.filter(type => type.id !== id));
    } catch (err) {
      console.error('Error deleting retreat type:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete retreat type');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Manage Retreat Types</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isAdding}
        >
          <PlusCircle className="w-5 h-5" />
          Add New Type
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Retreat Type</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newType.name}
                  onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Meditation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newType.description}
                  onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Focus on mindfulness and inner peace"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewType({ name: '', description: '' });
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddType}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
        {retreatTypes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No retreat types found. Add your first one!
          </div>
        ) : (
          retreatTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </div>
              <button
                onClick={() => handleDeleteType(type.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete type"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RetreatTypeManager; 