import React, { createContext, useContext, useState } from 'react';

export interface SearchFilters {
  query: string;
  location: string;
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  verified?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  products: string[];
  priceRange: string;
  distance: string;
  image: string;
  description: string;
}

interface SearchContextType {
  filters: SearchFilters;
  results: Supplier[];
  loading: boolean;
  updateFilters: (newFilters: Partial<SearchFilters>) => void;
  search: () => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Mock supplier data
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Valley Produce',
    location: 'Dadar, Mumbai',
    rating: 4.8,
    verified: true,
    products: ['Vegetables', 'Fruits', 'Herbs'],
    priceRange: '₹50-500/kg',
    distance: '2.3 km',
    image: '/placeholder.svg',
    description: 'Premium quality fresh produce supplier with 10+ years experience'
  },
  {
    id: '2',
    name: 'Spice Master Co.',
    location: 'Crawford Market, Mumbai',
    rating: 4.6,
    verified: true,
    products: ['Spices', 'Masalas', 'Herbs'],
    priceRange: '₹100-2000/kg',
    distance: '3.1 km',
    image: '/placeholder.svg',
    description: 'Authentic spices and masalas directly from source farms'
  },
  {
    id: '3',
    name: 'Dairy Express',
    location: 'Bandra, Mumbai',
    rating: 4.7,
    verified: true,
    products: ['Milk', 'Cheese', 'Butter', 'Yogurt'],
    priceRange: '₹30-800/unit',
    distance: '4.5 km',
    image: '/placeholder.svg',
    description: 'Fresh dairy products with daily delivery service'
  },
  {
    id: '4',
    name: 'Grain & More',
    location: 'Andheri, Mumbai',
    rating: 4.5,
    verified: false,
    products: ['Rice', 'Wheat', 'Pulses', 'Flour'],
    priceRange: '₹40-200/kg',
    distance: '5.2 km',
    image: '/placeholder.svg',
    description: 'Wholesale grains and pulses at competitive prices'
  },
  {
    id: '5',
    name: 'Meat Junction',
    location: 'Kurla, Mumbai',
    rating: 4.4,
    verified: true,
    products: ['Chicken', 'Mutton', 'Fish', 'Seafood'],
    priceRange: '₹200-800/kg',
    distance: '6.1 km',
    image: '/placeholder.svg',
    description: 'Fresh meat and seafood with quality guarantee'
  }
];

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
  });
  const [results, setResults] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const search = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredResults = mockSuppliers;
      
      // Filter by query
      if (filters.query) {
        filteredResults = filteredResults.filter(supplier =>
          supplier.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          supplier.products.some(product => 
            product.toLowerCase().includes(filters.query.toLowerCase())
          )
        );
      }
      
      // Filter by location (basic matching)
      if (filters.location) {
        filteredResults = filteredResults.filter(supplier =>
          supplier.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Filter by verified status
      if (filters.verified) {
        filteredResults = filteredResults.filter(supplier => supplier.verified);
      }
      
      // Filter by rating
      if (filters.rating) {
        filteredResults = filteredResults.filter(supplier => supplier.rating >= filters.rating!);
      }
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setFilters({ query: '', location: '' });
    setResults([]);
  };

  return (
    <SearchContext.Provider value={{ 
      filters, 
      results, 
      loading, 
      updateFilters, 
      search, 
      clearSearch 
    }}>
      {children}
    </SearchContext.Provider>
  );
};
