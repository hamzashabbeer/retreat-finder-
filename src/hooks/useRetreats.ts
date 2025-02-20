import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase';
import type { Retreat, SearchFilters } from '@types';

/**
 * useRetreats Hook
 * 
 * Custom hook for managing retreats data, including:
 * - Fetching retreats with filters
 * - Creating new retreats
 * - Updating existing retreats
 * - Deleting retreats
 */
export const useRetreats = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch retreats with optional filters
  const fetchRetreats = async (filters?: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('retreats')
        .select(`
          *,
          location:locations(
            id,
            city,
            country
          )
        `);

      // Apply filters
      if (filters) {
        // Location filter
        if (filters.location && filters.location !== 'Anywhere') {
          const [city = '', country = ''] = filters.location.split(', ');
          const { data: locationData } = await supabase
            .from('locations')
            .select('id')
            .or(`city.ilike.%${city}%,country.ilike.%${country}%`);

          if (locationData && locationData.length > 0) {
            const locationIds = locationData.map(loc => loc.id);
            query = query.in('location_id', locationIds);
          }
        }

        // Date filter
        if (filters.startDate) {
          query = query.gte('start_date', new Date(filters.startDate).toISOString());
        }

        if (filters.endDate) {
          query = query.lte('end_date', new Date(filters.endDate).toISOString());
        }

        // Category filter
        if (filters.type && filters.type.length > 0) {
          query = query.overlaps('type', filters.type);
        }

        // Price range filter
        if (filters.priceRange) {
          query = query
            .gte('price->amount', parseInt(filters.priceRange[0]))
            .lte('price->amount', parseInt(filters.priceRange[1]));
        }

        // Duration filter
        if (filters.duration) {
          query = query
            .gte('duration', parseInt(filters.duration[0]))
            .lte('duration', parseInt(filters.duration[1]));
        }

        // Amenities filter
        if (filters.amenities && filters.amenities.length > 0) {
          query = query.contains('amenities', filters.amenities);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      setRetreats(data as Retreat[]);
    } catch (err) {
      console.error('Error fetching retreats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch retreats');
    } finally {
      setLoading(false);
    }
  };

  // Create a new retreat
  const createRetreat = async (retreat: Omit<Retreat, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('retreats')
        .insert([retreat])
        .select()
        .single();

      if (error) throw error;
      setRetreats(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating retreat:', err);
      setError(err instanceof Error ? err.message : 'Failed to create retreat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing retreat
  const updateRetreat = async (id: string | number, updates: Partial<Retreat>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('retreats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRetreats(prev => prev.map(retreat => 
        retreat.id === id ? { ...retreat, ...data } : retreat
      ));
      return data;
    } catch (err) {
      console.error('Error updating retreat:', err);
      setError(err instanceof Error ? err.message : 'Failed to update retreat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a retreat
  const deleteRetreat = async (id: string | number) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('retreats')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRetreats(prev => prev.filter(retreat => retreat.id !== id));
    } catch (err) {
      console.error('Error deleting retreat:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete retreat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRetreats();
  }, []);

  return {
    retreats,
    loading,
    error,
    fetchRetreats,
    createRetreat,
    updateRetreat,
    deleteRetreat,
  };
};

export default useRetreats;