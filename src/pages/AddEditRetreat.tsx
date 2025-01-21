import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@lib/supabase';
import type { Retreat } from '@types';

const AddEditRetreat: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<Partial<Retreat>>({
    title: '',
    description: '',
    location: {
      city: '',
      country: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    price: {
      amount: 0,
      currency: 'USD'
    },
    duration: 7,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: [],
    amenities: [],
    images: []
  });

  React.useEffect(() => {
    const fetchRetreat = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('retreats')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setFormData(data);
      } catch (err) {
        console.error('Error fetching retreat:', err);
        setError(err instanceof Error ? err.message : 'Failed to load retreat');
      } finally {
        setLoading(false);
      }
    };

    fetchRetreat();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        navigate('/auth/owner/login');
        return;
      }

      const retreatData = {
        ...formData,
        hostId: user.id
      };

      let result;
      if (id) {
        // Update existing retreat
        result = await supabase
          .from('retreats')
          .update(retreatData)
          .eq('id', id)
          .select()
          .single();
      } else {
        // Insert new retreat
        result = await supabase
          .from('retreats')
          .insert([retreatData])
          .select()
          .single();
      }

      if (result.error) throw result.error;
      
      navigate(`/retreats/${result.data.id}`);
    } catch (err) {
      console.error('Error saving retreat:', err);
      setError(err instanceof Error ? err.message : 'Failed to save retreat');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (name: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handlePriceChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [field]: field === 'amount' ? Number(value) : value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {id ? 'Edit Retreat' : 'Add New Retreat'}
      </h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={formData.location?.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={formData.location?.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing and Duration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Pricing and Duration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={formData.price?.amount}
                onChange={(e) => handlePriceChange('amount', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={formData.price?.currency}
                onChange={(e) => handlePriceChange('currency', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate?.split('T')[0]}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate?.split('T')[0]}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Type and Amenities */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Type and Amenities</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type (comma-separated)</label>
              <input
                type="text"
                value={formData.type?.join(', ')}
                onChange={(e) => handleArrayInputChange('type', e.target.value.split(',').map(s => s.trim()))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Meditation, Yoga, Wellness"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
              <input
                type="text"
                value={formData.amenities?.join(', ')}
                onChange={(e) => handleArrayInputChange('amenities', e.target.value.split(',').map(s => s.trim()))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Pool, Spa, Wifi"
                required
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
            <input
              type="text"
              value={formData.images?.join(', ')}
              onChange={(e) => handleArrayInputChange('images', e.target.value.split(',').map(s => s.trim()))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : (id ? 'Update Retreat' : 'Create Retreat')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditRetreat; 