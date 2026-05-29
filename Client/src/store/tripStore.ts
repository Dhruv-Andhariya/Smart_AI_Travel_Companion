import { create } from "zustand";

export type SelectedTrip = {
  id: number;
  title: string;
  destination: string;
  totalDays: number;
  budget: number;
  travelType: string;
  interests: string;
};

type TripState = {
  selectedTrip: SelectedTrip | null;
  itineraryPreview: unknown[];
  setSelectedTrip: (trip: SelectedTrip | null) => void;
  setItineraryPreview: (days: unknown[]) => void;
};

export const useTripStore = create<TripState>((set) => ({
  selectedTrip: null,
  itineraryPreview: [],
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
  setItineraryPreview: (days) => set({ itineraryPreview: days }),
}));