export interface Retreat {
  id: number;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
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