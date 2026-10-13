import { create } from 'zustand';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: ['prop-1', 'prop-6'], // pre-favorite two listings for demonstration
  toggleFavorite: (id: string) => {
    const current = get().favorites;
    if (current.includes(id)) {
      set({ favorites: current.filter((f) => f !== id) });
    } else {
      set({ favorites: [...current, id] });
    }
  },
  isFavorite: (id: string) => get().favorites.includes(id),
}));
