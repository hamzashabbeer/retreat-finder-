import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Retreat, SearchFilters } from '../types';

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
        .select('*');

      // Apply filters
      if (filters) {
        if (filters.location) {
          query = query.ilike('location->>city', `%${filters.location}%`);
        }

        if (filters.startDate) {
          query = query.gte('start_date', filters.startDate);
        }

        if (filters.endDate) {
          query = query.lte('end_date', filters.endDate);
        }

        if (filters.type && filters.type.length > 0) {
          query = query.contains('type', filters.type);
        }

        if (filters.priceRange) {
          query = query
            .gte('price_per_night', filters.priceRange[0])
            .lte('price_per_night', filters.priceRange[1]);
        }

        if (filters.amenities && filters.amenities.length > 0) {
          query = query.contains('amenities', filters.amenities);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setRetreats(data || []);
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

  // Fetch retreats on mount
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