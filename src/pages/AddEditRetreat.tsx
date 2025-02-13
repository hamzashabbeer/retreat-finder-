import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@lib/supabase';
import { 
  ChevronLeft,
  MapPin, 
  Tag, 
  Calendar,
  DollarSign,
  ImageIcon,
  UtensilsIcon,
  Check, 
  X, 
  Star,
  PlusCircle
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { Retreat } from '@types';
import { FilterOptions } from '@types';

interface LocationOption {
  id: string;
  city: string;
  country: string;
}

interface RetreatType {
  id: string;
  name: string;
  description: string;
}

const AddEditRetreat: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [retreatTypes, setRetreatTypes] = useState<RetreatType[]>([]);

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
    images: [],
    summary: '',
    features: '',
    benefits: '',
    whatsIncluded: '',
    whatsNotIncluded: '',
    reviews: 0,
    rating: 0,
    reviewCount: 0
  });

  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('city', { ascending: true });

        if (error) throw error;
        console.log('Fetched locations:', data); // For debugging
        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchRetreatTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('retreat_types')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setRetreatTypes(data || []);
      } catch (err) {
        console.error('Error fetching retreat types:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch retreat types');
      }
    };

    fetchRetreatTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Basic required fields for step 1
      const step1Fields = ['title', 'description', 'location', 'price', 'duration', 'startDate', 'endDate'] as const;
      const missingStep1Fields = step1Fields.filter(field => !formData[field as keyof typeof formData]);

      if (missingStep1Fields.length > 0) {
        throw new Error(`Missing required fields: ${missingStep1Fields.join(', ')}`);
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        navigate('/auth/owner/login');
        return;
      }

      // Format dates to ISO strings
      const startDate = formData.startDate ? new Date(formData.startDate).toISOString() : null;
      const endDate = formData.endDate ? new Date(formData.endDate).toISOString() : null;

      // Only include fields that exist in the database schema
      const dataToSubmit = {
        title: formData.title || '',
        description: formData.description || '',
        location: formData.location || { city: '', country: '', coordinates: { lat: 0, lng: 0 } },
        price: formData.price || { amount: 0, currency: 'USD' },
        duration: parseInt(String(formData.duration || '0')),
        start_date: startDate,
        end_date: endDate,
        type: formData.type || [],
        amenities: formData.amenities || [],
        images: formData.images || [],
        host_id: user.id,
        rating: parseFloat(String(formData.rating || '0')),
        review_count: parseInt(String(formData.reviewCount || '0'))
      };

      console.log('Submitting data:', dataToSubmit);

      const { data, error: saveError } = await supabase
          .from('retreats')
        .insert([dataToSubmit])
        .select()
        .single();

      if (saveError) throw saveError;

      // Navigate to the retreats list on success
      navigate('/dashboard/retreats');
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
        ...(prev.location || { city: '', country: '', coordinates: { lat: 0, lng: 0 } }),
        [field]: value
      }
    }));
  };

  const handlePriceChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      price: {
        ...(prev.price || { amount: 0, currency: 'USD' }),
        [field]: field === 'amount' ? Number(value) : value
      }
    }));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Function to render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Basic Information */}
                  <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                    <input
                      type="text"
                      name="title"
                    value={formData.title || ''}
                      onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter retreat title"
                    />
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                    <textarea
                      name="description"
                    value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter retreat description"
                    />
                  </div>

                {/* Location Field */}
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => {
                          const location = locations.find(loc => loc.id === e.target.value);
                          setSelectedLocation(e.target.value);
                          if (location) {
                            setFormData(prev => ({
                              ...prev,
                              location: {
                                city: location.city,
                                country: location.country,
                                coordinates: { lat: 0, lng: 0 }
                              }
                            }));
                          }
                        }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.city} • {location.country}
                          </option>
                        ))}
                      </select>
                    </div>

                {/* Retreat Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retreat Types
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {retreatTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`
                          flex items-center gap-2 p-3 rounded-lg cursor-pointer border
                          ${formData.type?.includes(type.name)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={formData.type?.includes(type.name) || false}
                          onChange={(e) => {
                            const currentTypes = formData.type || [];
                            const newTypes = e.target.checked
                              ? [...currentTypes, type.name]
                              : currentTypes.filter(t => t !== type.name);
                            handleArrayInputChange('type', newTypes);
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                      </label>
                    ))}
                </div>
              </div>

                {/* Price Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="relative rounded-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          {formData.price?.currency === 'USD' ? '$' : 
                           formData.price?.currency === 'EUR' ? '€' : 
                           formData.price?.currency === 'GBP' ? '£' : '$'}
                        </span>
                        </div>
                        <input
                          type="number"
                          value={formData.price?.amount}
                          onChange={(e) => handlePriceChange('amount', e.target.value)}
                        className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={formData.price?.currency}
                        onChange={(e) => handlePriceChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    </div>

                {/* Dates and Duration Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate?.split('T')[0]}
                        onChange={(e) => {
                          handleInputChange(e);
                          // Update duration when start date changes
                          if (formData.endDate) {
                            const start = new Date(e.target.value);
                            const end = new Date(formData.endDate);
                            const diffTime = Math.abs(end.getTime() - start.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            setFormData(prev => ({
                              ...prev,
                              duration: diffDays
                            }));
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate?.split('T')[0]}
                        onChange={(e) => {
                          handleInputChange(e);
                          // Update duration when end date changes
                          if (formData.startDate) {
                            const start = new Date(formData.startDate);
                            const end = new Date(e.target.value);
                            const diffTime = Math.abs(end.getTime() - start.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            setFormData(prev => ({
                              ...prev,
                              duration: diffDays
                            }));
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Auto-calculated from dates</p>
                    </div>
                  </div>

                {/* Rating and Review Count Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <input
                      type="number"
                      name="rating"
                      value={formData.rating || 0}
                        onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter a rating between 0 and 5</p>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Count</label>
                      <input
                      type="number"
                      name="reviewCount"
                      value={formData.reviewCount || 0}
                        onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    <p className="mt-1 text-xs text-gray-500">Number of reviews received</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.images?.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Retreat image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...(formData.images || [])];
                        newImages.splice(index, 1);
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                </div>
                ))}
                
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      const newImages = files.map(file => URL.createObjectURL(file));
                      setFormData(prev => ({
                        ...prev,
                        images: [...(prev.images || []), ...newImages]
                      }));
                    }}
                  />
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Filter Options */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
              
              {/* Atmosphere */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                  Atmosphere
                    </label>
                <div className="flex flex-wrap gap-2">
                  {FilterOptions.atmosphere.map((option) => (
                    <label key={option} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-50">
                    <input
                        type="checkbox"
                        checked={formData.atmosphere?.includes(option) || false}
                        onChange={(e) => {
                          const newAtmosphere = e.target.checked
                            ? [...(formData.atmosphere || []), option]
                            : (formData.atmosphere || []).filter(item => item !== option);
                          handleArrayInputChange('atmosphere', newAtmosphere);
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                  </div>
                </div>

              {/* Skill Level */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Skill Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {FilterOptions.skillLevel.map((option) => (
                    <label key={option} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.skillLevel?.includes(option) || false}
                        onChange={(e) => {
                          const newSkillLevel = e.target.checked
                            ? [...(formData.skillLevel || []), option]
                            : (formData.skillLevel || []).filter(item => item !== option);
                          handleArrayInputChange('skillLevel', newSkillLevel);
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
              </div>
                </div>

              {/* Area */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                  Area
                    </label>
                <div className="flex flex-wrap gap-2">
                  {FilterOptions.area.map((option) => (
                    <label key={option} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-50">
                    <input
                        type="checkbox"
                        checked={formData.area?.includes(option) || false}
                        onChange={(e) => {
                          const newArea = e.target.checked
                            ? [...(formData.area || []), option]
                            : (formData.area || []).filter(item => item !== option);
                          handleArrayInputChange('area', newArea);
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                  </div>
                </div>

              {/* Food */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Food Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {FilterOptions.food.map((option) => (
                    <label key={option} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.food?.includes(option) || false}
                        onChange={(e) => {
                          const newFood = e.target.checked
                            ? [...(formData.food || []), option]
                            : (formData.food || []).filter(item => item !== option);
                          handleArrayInputChange('food', newFood);
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
              </div>
                </div>

              {/* Age Group */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Age Group
                </label>
                <div className="flex flex-wrap gap-2">
                  {FilterOptions.ageGroup.map((option) => (
                    <label key={option} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.ageGroup?.includes(option) || false}
                        onChange={(e) => {
                          const newAgeGroup = e.target.checked
                            ? [...(formData.ageGroup || []), option]
                            : (formData.ageGroup || []).filter(item => item !== option);
                          handleArrayInputChange('ageGroup', newAgeGroup);
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Room Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {FilterOptions.roomType.map((option) => (
                    <label key={option} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.roomType?.includes(option) || false}
                        onChange={(e) => {
                          const newRoomType = e.target.checked
                            ? [...(formData.roomType || []), option]
                            : (formData.roomType || []).filter(item => item !== option);
                          handleArrayInputChange('roomType', newRoomType);
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Summary
                </label>
                <div className="space-y-2">
                  <textarea
                    name="summary"
                    value={formData.summary || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write a brief summary of your retreat..."
                  />
                </div>
              </div>

              {/* Features - Point Based */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Features
                </label>
                <div className="space-y-2">
                  {(formData.features?.split('\n') || ['']).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = formData.features?.split('\n') || [''];
                          newFeatures[index] = e.target.value;
                          handleInputChange({
                            target: {
                              name: 'features',
                              value: newFeatures.join('\n')
                            }
                          } as any);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a feature..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = formData.features?.split('\n') || [''];
                          if (index === newFeatures.length - 1) {
                            newFeatures.push('');
                          } else {
                            newFeatures.splice(index, 1);
                          }
                          handleInputChange({
                            target: {
                              name: 'features',
                              value: newFeatures.join('\n')
                            }
                          } as any);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {index === (formData.features?.split('\n') || ['']).length - 1 ? (
                          <PlusCircle className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                  </div>
                  ))}
                </div>
                  </div>

              {/* Benefits - Point Based */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Benefits
                </label>
                <div className="space-y-2">
                  {(formData.benefits?.split('\n') || ['']).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = formData.benefits?.split('\n') || [''];
                          newBenefits[index] = e.target.value;
                          handleInputChange({
                            target: {
                              name: 'benefits',
                              value: newBenefits.join('\n')
                            }
                          } as any);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a benefit..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newBenefits = formData.benefits?.split('\n') || [''];
                          if (index === newBenefits.length - 1) {
                            newBenefits.push('');
                          } else {
                            newBenefits.splice(index, 1);
                          }
                          handleInputChange({
                            target: {
                              name: 'benefits',
                              value: newBenefits.join('\n')
                            }
                          } as any);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {index === (formData.benefits?.split('\n') || ['']).length - 1 ? (
                          <PlusCircle className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                  </div>
                  ))}
                </div>
              </div>

              {/* What's Included - Point Based */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  What's Included
                </label>
                <div className="space-y-2">
                  {(formData.whatsIncluded?.split('\n') || ['']).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = formData.whatsIncluded?.split('\n') || [''];
                          newItems[index] = e.target.value;
                          handleInputChange({
                            target: {
                              name: 'whatsIncluded',
                              value: newItems.join('\n')
                            }
                          } as any);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add an included item..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = formData.whatsIncluded?.split('\n') || [''];
                          if (index === newItems.length - 1) {
                            newItems.push('');
                          } else {
                            newItems.splice(index, 1);
                          }
                          handleInputChange({
                            target: {
                              name: 'whatsIncluded',
                              value: newItems.join('\n')
                            }
                          } as any);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {index === (formData.whatsIncluded?.split('\n') || ['']).length - 1 ? (
                          <PlusCircle className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                </div>
                  ))}
              </div>
                </div>

              {/* What's Not Included - Point Based */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  What's Not Included
                </label>
                <div className="space-y-2">
                  {(formData.whatsNotIncluded?.split('\n') || ['']).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = formData.whatsNotIncluded?.split('\n') || [''];
                          newItems[index] = e.target.value;
                          handleInputChange({
                            target: {
                              name: 'whatsNotIncluded',
                              value: newItems.join('\n')
                            }
                          } as any);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a not included item..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = formData.whatsNotIncluded?.split('\n') || [''];
                          if (index === newItems.length - 1) {
                            newItems.push('');
                          } else {
                            newItems.splice(index, 1);
                          }
                          handleInputChange({
                            target: {
                              name: 'whatsNotIncluded',
                              value: newItems.join('\n')
                            }
                          } as any);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {index === (formData.whatsNotIncluded?.split('\n') || ['']).length - 1 ? (
                          <PlusCircle className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                    </div>
                  </div>
                </div>
              </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back and Save Buttons */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevStep}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              form="retreat-form"
              disabled={saving}
              className={`
                inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm
                text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 ease-in-out transform hover:scale-105
              `}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                id ? 'Update Retreat' : 'Create Retreat'
              )}
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      1
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Basic Information</p>
                      <p className="text-sm text-gray-500">Start with the essentials</p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-gray-300 mx-4"></div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      2
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Details & Media</p>
                      <p className="text-sm text-gray-500">Add descriptions and images</p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-gray-300 mx-4"></div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      3
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Final Details</p>
                      <p className="text-sm text-gray-500">Complete your listing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form id="retreat-form" onSubmit={handleSubmit} className="space-y-8 pb-20">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {saving ? 'Saving...' : 'Save Retreat'}
                </button>
              )}
            </div>
          </form>
          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEditRetreat; 