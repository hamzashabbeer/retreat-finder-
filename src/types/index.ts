/**
 * Core Types
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  city: string;
  country: string;
  coordinates: Coordinates;
}

export interface Price {
  amount: number;
  currency: string;
}

/**
 * Retreat Types
 */
export interface Retreat {
  id: number | string;
  title: string;
  description: string;
  location: Location;
  price: Price;
  duration: number;
  startDate: string;
  endDate: string;
  type: string[];
  amenities: string[];
  images: string[];
  hostId: string;
  rating: number;
  reviewCount: number;
}

/**
 * User Types
 */
export interface UserProfile {
  id: string;
  role: 'owner' | 'customer';
  full_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Booking Types
 */
export interface Booking {
  id: string;
  retreat_id: string;
  customer_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

/**
 * Search and Filter Types
 */
export interface SearchFilters {
  location?: string;
  startDate?: string;
  endDate?: string;
  type?: string[];
  priceRange?: [number, number];
  amenities?: string[];
  duration?: string[];
}

/**
 * Component Props Types
 */
export interface RetreatCardProps {
  retreat: Retreat;
}

export interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

/**
 * Context Types
 */
export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, role: 'owner' | 'customer') => Promise<void>;
}