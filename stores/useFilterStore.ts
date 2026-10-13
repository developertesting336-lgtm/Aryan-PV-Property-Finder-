import { create } from 'zustand';

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  neighborhood: string;
  propertyType: string;
  bedrooms: number;
  oceanView: boolean | null;
  searchQuery: string;

  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setNeighborhood: (neighborhood: string) => void;
  setPropertyType: (propertyType: string) => void;
  setBedrooms: (bedrooms: number) => void;
  setOceanView: (oceanView: boolean | null) => void;
  setSearchQuery: (query: string) => void;
  applyPreset: (preset: 'all' | 'starter' | 'beachfront500k' | 'luxuryVilla') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  minPrice: 0,
  maxPrice: 2000000,
  neighborhood: 'all',
  propertyType: 'all',
  bedrooms: 0,
  oceanView: null,
  searchQuery: '',

  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setNeighborhood: (neighborhood) => set({ neighborhood }),
  setPropertyType: (propertyType) => set({ propertyType }),
  setBedrooms: (bedrooms) => set({ bedrooms }),
  setOceanView: (oceanView) => set({ oceanView }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  applyPreset: (preset) => {
    switch (preset) {
      case 'starter':
        set({ minPrice: 150000, maxPrice: 350000, propertyType: 'all', oceanView: null, bedrooms: 1 });
        break;
      case 'beachfront500k':
        set({ minPrice: 300000, maxPrice: 550000, propertyType: 'all', oceanView: true, bedrooms: 2 });
        break;
      case 'luxuryVilla':
        set({ minPrice: 800000, maxPrice: 2000000, propertyType: 'villa', oceanView: true, bedrooms: 3 });
        break;
      default:
        set({ minPrice: 0, maxPrice: 2000000, neighborhood: 'all', propertyType: 'all', bedrooms: 0, oceanView: null });
    }
  },

  resetFilters: () =>
    set({
      minPrice: 0,
      maxPrice: 2000000,
      neighborhood: 'all',
      propertyType: 'all',
      bedrooms: 0,
      oceanView: null,
      searchQuery: '',
    }),
}));
