import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Retreat, SearchParams } from '../types';

/**
 * Custom hook for handling retreat operations
 */
export const useRetreats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch retreats with optional search parameters
   */
  const fetchRetreats = async (searchParams?: SearchParams) => {
    setLoading(true);
    try {
      let query = supabase
        .from('retreats')
        .select('*');

      // Apply filters based on search parameters
      if (searchParams?.location) {
        query = query.ilike('location', `%${searchParams.location}%`);
      }
      if (searchParams?.category) {
        query = query.eq('type', searchParams.category);
      }
      if (searchParams?.priceMin) {
        query = query.gte('price_per_night', searchParams.priceMin);
      }
      if (searchParams?.priceMax) {
        query = query.lte('price_per_night', searchParams.priceMax);
      }
      if (searchParams?.guests) {
        query = query.gte('max_guests', searchParams.guests);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch retreats'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new retreat
   */
  const createRetreat = async (retreat: Omit<Retreat, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data, error: createError } = await supabase
        .from('retreats')
        .insert([retreat])
        .select()
        .single();

      if (createError) throw createError;
      return { data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to create retreat')
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing retreat
   */
  const updateRetreat = async (id: string, updates: Partial<Retreat>) => {
    setLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from('retreats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update retreat')
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a retreat
   */
  const deleteRetreat = async (id: string) => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('retreats')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete retreat')
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a single retreat by ID
   */
  const getRetreatById = async (id: string) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('retreats')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch retreat')
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchRetreats,
    createRetreat,
    updateRetreat,
    deleteRetreat,
    getRetreatById
  };
};

export default useRetreats;