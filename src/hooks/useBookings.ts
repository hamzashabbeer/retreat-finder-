import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types';

/**
 * Custom hook for handling booking operations
 */
export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Create a new booking
   */
  const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    setLoading(true);
    try {
      const { data, error: createError } = await supabase
        .from('bookings')
        .insert([{ ...booking, status: 'pending' }])
        .select()
        .single();

      if (createError) throw createError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create booking')
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a booking's status
   */
  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update booking status')
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get bookings for a customer
   */
  const getCustomerBookings = async (customerId: string) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          retreat:retreats(*)
        `)
        .eq('customer_id', customerId);

      if (fetchError) throw fetchError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch customer bookings')
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get bookings for a retreat owner
   */
  const getOwnerBookings = async (ownerId: string) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          retreat:retreats!inner(*),
          customer:profiles!inner(*)
        `)
        .eq('retreats.owner_id', ownerId);

      if (fetchError) throw fetchError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch owner bookings')
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check retreat availability for given dates
   */
  const checkAvailability = async (retreatId: string, checkIn: string, checkOut: string) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('retreat_id', retreatId)
        .eq('status', 'confirmed')
        .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`);

      if (fetchError) throw fetchError;
      return { 
        available: data.length === 0,
        error: null 
      };
    } catch (err) {
      return {
        available: false,
        error: err instanceof Error ? err : new Error('Failed to check availability')
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBooking,
    updateBookingStatus,
    getCustomerBookings,
    getOwnerBookings,
    checkAvailability
  };
};

export default useBookings; 