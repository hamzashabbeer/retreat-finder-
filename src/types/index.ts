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
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: {
    amount: number;
    currency: string;
  };
  duration: number;
  startDate: string;
  endDate: string;
  type: string[];
  amenities: string[];
  images: string[];
  hostId: string;
  rating: number;
  reviewCount: number;
  summary: string;
  features: string;
  benefits: string;
  whatsIncluded: string;
  whatsNotIncluded: string;
  staffInsights: string;
  reviews: number;
  atmosphere: string[];
  skillLevel: string[];
  area: string[];
  food: string[];
  ageGroup: string[];
  roomType: string[];
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