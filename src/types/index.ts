/**
 * User profile types
 */
export interface UserProfile {
  id: string;
  role: 'owner' | 'customer';
  full_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Retreat types
 */
export interface Retreat {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  type: string;
  amenities: string[];
  images: string[];
  max_guests: number;
  created_at: string;
  updated_at: string;
}

/**
 * Booking types
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
 * Search parameters type
 */
export interface SearchParams {
  location?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  priceMin?: number;
  priceMax?: number;
  guests?: number;
}

/**
 * Authentication types
 */
export interface AuthResponse {
  user: UserProfile | null;
  error: Error | null;
}

/**
 * Form types
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  full_name: string;
  role: 'owner' | 'customer';
}

export interface SearchFilters {
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  types?: string[];
}