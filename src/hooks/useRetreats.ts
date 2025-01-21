import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Retreat } from '../types';

interface UseRetreatsParams {
  location?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useRetreats(params: UseRetreatsParams) {
  return useQuery({
    queryKey: ['retreats', params],
    queryFn: async () => {
      let query = supabase
        .from('retreats')
        .select('*');

      if (params.location) {
        // Use containedBy for JSON field search
        query = query.or(
          `location->>'city.ilike.${params.location}`,
          `location->>'country.ilike.${params.location}`
        );
      }

      if (params.startDate) {
        query = query.gte('startDate', params.startDate);
      }

      if (params.endDate) {
        query = query.lte('endDate', params.endDate);
      }

      if (params.type) {
        query = query.contains('type', [params.type]);
      }

      if (params.minPrice) {
        query = query.gte('price->>amount', params.minPrice);
      }

      if (params.maxPrice) {
        query = query.lte('price->>amount', params.maxPrice);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching retreats:', error);
        return [];
      }

      return data as Retreat[];
    },
  });
}