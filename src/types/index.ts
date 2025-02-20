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
  id: string;
  title: string;
  description: string;
  location: {
    id: string;
    city: string;
    country: string;
  };
  location_id: string;
  price: {
    amount: number;
    currency: string;
  };
  duration: number;
  start_date: string;
  end_date: string;
  type: string[];
  amenities: string[];
  images: string[];
  summary: string;
  features: string;
  benefits: string;
  whats_included: string;
  whats_not_included: string;
  staff_insights: string;
  atmosphere: string[];
  skill_level: string[];
  area: string[];
  food: string[];
  age_group: string[];
  room_type: string[];
  host_id: string;
  rating: number;
  review_count: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * User Types
 */
export interface UserProfile {
  id: string;
  role: 'owner' | 'customer';
  full_name: string;
  email: string;
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
  priceRange?: [string, string];
  duration?: [string, string];
  amenities?: string[];
  skillLevel?: string[];
  area?: string[];
  food?: string[];
  ageGroup?: string[];
  roomType?: string[];
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
  signUp: (email: string, password: string, role: 'owner' | 'customer') => Promise<{
    user: any;
    profile: UserProfile;
  }>;
}

/**
 * Retreat Filter Options
 */
export interface RetreatFilters {
  atmosphere: string[];
  skillLevel: string[];
  area: string[];
  food: string[];
  features: string[];
  ageGroup: string[];
  roomType: string[];
}

export const FilterOptions = {
  atmosphere: [
    'Women Only',
    'Men Only',
    'For Solo Travelers',
    'Couples Only',
    'Family Friendly',
    'Alcohol Free',
    'Couples Friendly',
    'Child-friendly',
    'Pet-friendly'
  ],
  skillLevel: [
    'Beginner',
    'Intermediate',
    'Advanced'
  ],
  area: [
    'Close to Nature',
    'Mountain',
    'Near the Beach',
    'Forest',
    'Jungle',
    'City'
  ],
  food: [
    'Vegetarian',
    'Vegan',
    'Raw',
    'Organic',
    'Gluten Free',
    'Dairy-free'
  ],
  features: [
    'Meals Included',
    'Free Cancellation',
    'Airport Pickup'
  ],
  ageGroup: [
    '18-24',
    '25-40',
    '41-60',
    '60+'
  ],
  roomType: [
    'Private',
    'Shared'
  ]
} as const;