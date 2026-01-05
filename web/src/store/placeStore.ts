import { create } from 'zustand';
import { Place } from '../core/model/Place';
import { placeRepository } from '../core/repo/placeRepository';

interface PlaceStore {
  places: Place[];
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  refreshPlaces: () => Promise<void>;
  addPlace: (
    latitude: number,
    longitude: number,
    emoji: string,
    note: string
  ) => Promise<void>;
  getPlace: (id: number) => Promise<Place | null>;
}

export const usePlaceStore = create<PlaceStore>((set, get) => ({
  places: [],
  isLoading: false,
  error: null,

  init: async () => {
    try {
      await placeRepository.init();
      await get().refreshPlaces();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },

  refreshPlaces: async () => {
    try {
      set({ isLoading: true, error: null });
      const places = await placeRepository.getAllPlaces();
      set({ places, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  addPlace: async (
    latitude: number,
    longitude: number,
    emoji: string,
    note: string
  ) => {
    try {
      await placeRepository.addPlace(latitude, longitude, emoji, note);
      await get().refreshPlaces();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  },

  getPlace: async (id: number) => {
    try {
      return await placeRepository.getPlace(id);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
      return null;
    }
  },
}));