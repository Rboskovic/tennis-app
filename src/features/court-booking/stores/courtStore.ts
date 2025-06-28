import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types for court booking
export interface Court {
  id: string;
  name: string;
  clubId: string;
  surface: "clay" | "hard" | "grass" | "indoor";
  lighting: boolean;
  covered: boolean;
  image: string;
  hourlyRate: number;
  features: string[];
}

export interface Club {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  amenities: string[];
  courts: Court[];
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  priceRange: {
    min: number;
    max: number;
  };
}

export interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  court?: Court;
}

export interface Booking {
  id: string;
  clubId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  createdAt: string;
  specialRequests?: string;
}

export interface BookingFilters {
  surface?: "clay" | "hard" | "grass" | "indoor";
  lighting?: boolean;
  covered?: boolean;
  priceRange?: [number, number];
  location?: string;
  amenities?: string[];
}

interface CourtState {
  // Clubs and courts data
  clubs: Club[];
  selectedClub: Club | null;
  selectedCourt: Court | null;

  // Filters and search
  searchQuery: string;
  filters: BookingFilters;
  filteredClubs: Club[];

  // Booking flow
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  availableTimeSlots: TimeSlot[];
  duration: number; // in hours

  // API states
  loading: boolean;
  error: string | null;
  bookingLoading: boolean;
  bookingError: string | null;

  // User bookings
  userBookings: Booking[];
  currentBooking: Booking | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<BookingFilters>) => void;
  selectClub: (club: Club) => void;
  selectCourt: (court: Court) => void;
  setSelectedDate: (date: string) => void;
  selectTimeSlot: (slot: TimeSlot) => void;
  setDuration: (hours: number) => void;
  loadAvailableTimeSlots: (
    clubId: string,
    courtId: string,
    date: string
  ) => Promise<void>;
  bookCourt: (bookingData: Partial<Booking>) => Promise<void>;
  loadUserBookings: () => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  resetBookingFlow: () => void;
  clearError: () => void;
}

// Mock data
const mockClubs: Club[] = [
  {
    id: "baseline",
    name: "Baseline Tennis Club",
    location: "Novi Beograd",
    address: "Bulevar Mihajla Pupina 10, Novi Beograd",
    phone: "+381 11 123-4567",
    email: "info@baseline.rs",
    rating: 4.8,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    ],
    description:
      "Moderni teniski klub sa vrhunskim terenima i kompletnim sadržajima.",
    amenities: [
      "Parking",
      "Kafić",
      "Svlačionice",
      "Tuševi",
      "Wi-Fi",
      "Prodavnica opreme",
    ],
    openingHours: {
      monday: { open: "07:00", close: "23:00" },
      tuesday: { open: "07:00", close: "23:00" },
      wednesday: { open: "07:00", close: "23:00" },
      thursday: { open: "07:00", close: "23:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "08:00", close: "22:00" },
      sunday: { open: "08:00", close: "22:00" },
    },
    priceRange: { min: 2000, max: 4000 },
    courts: [
      {
        id: "baseline-1",
        name: "Teren 1",
        clubId: "baseline",
        surface: "clay",
        lighting: true,
        covered: false,
        image:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        hourlyRate: 3000,
        features: ["Rasveta", "Crven šljak", "Profesionalne mreže"],
      },
      {
        id: "baseline-2",
        name: "Teren 2",
        clubId: "baseline",
        surface: "hard",
        lighting: true,
        covered: true,
        image:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400",
        hourlyRate: 4000,
        features: ["Rasveta", "Pokriveno", "Tvrda podloga", "Klima"],
      },
    ],
  },
  {
    id: "ace",
    name: "Ace Tennis Center",
    location: "Vračar",
    address: "Kneza Miloša 25, Vračar",
    phone: "+381 11 234-5678",
    email: "rezervacije@ace.rs",
    rating: 4.6,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
    ],
    description:
      "Ekskluzivni teniski centar u srcu Beograda sa premium uslugama.",
    amenities: [
      "Valet parking",
      "Restoran",
      "Spa",
      "Svlačionice",
      "Sauna",
      "Masaža",
    ],
    openingHours: {
      monday: { open: "06:00", close: "24:00" },
      tuesday: { open: "06:00", close: "24:00" },
      wednesday: { open: "06:00", close: "24:00" },
      thursday: { open: "06:00", close: "24:00" },
      friday: { open: "06:00", close: "24:00" },
      saturday: { open: "07:00", close: "24:00" },
      sunday: { open: "07:00", close: "23:00" },
    },
    priceRange: { min: 3500, max: 6000 },
    courts: [
      {
        id: "ace-1",
        name: "Center Court",
        clubId: "ace",
        surface: "hard",
        lighting: true,
        covered: true,
        image:
          "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=400",
        hourlyRate: 6000,
        features: ["Premium teren", "Pokriveno", "LED rasveta", "Tribine"],
      },
      {
        id: "ace-2",
        name: "Court 2",
        clubId: "ace",
        surface: "clay",
        lighting: true,
        covered: false,
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
        hourlyRate: 4500,
        features: ["Crven šljak", "Rasveta", "Profesionalne linije"],
      },
    ],
  },
  {
    id: "match-point",
    name: "Match Point",
    location: "Zemun",
    address: "Glavna 15, Zemun",
    phone: "+381 11 345-6789",
    email: "info@matchpoint.rs",
    rating: 4.7,
    reviewCount: 67,
    images: ["https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800"],
    description: "Prijatna atmosfera i kvalitetni tereni za sve nivoe igrača.",
    amenities: ["Parking", "Kafić", "Svlačionice", "Iznajmljivanje opreme"],
    openingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "23:00" },
      saturday: { open: "09:00", close: "23:00" },
      sunday: { open: "09:00", close: "21:00" },
    },
    priceRange: { min: 2500, max: 3500 },
    courts: [
      {
        id: "match-1",
        name: "Teren A",
        clubId: "match-point",
        surface: "hard",
        lighting: true,
        covered: false,
        image:
          "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400",
        hourlyRate: 3500,
        features: ["Rasveta", "Tvrda podloga"],
      },
    ],
  },
];

// Simulate API calls
const simulateApiDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate time slots for a given date
const generateTimeSlots = (
  club: Club,
  court: Court,
  date: string
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
    weekday: "lowercase",
  }) as keyof typeof club.openingHours;
  const hours = club.openingHours[dayOfWeek];

  if (hours.closed) return slots;

  const startHour = parseInt(hours.open.split(":")[0]);
  const endHour = parseInt(hours.close.split(":")[0]);

  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    const available = Math.random() > 0.3; // Simulate availability

    slots.push({
      time,
      available,
      price: court.hourlyRate,
      court,
    });
  }

  return slots;
};

export const useCourtStore = create<CourtState>()(
  devtools(
    (set, get) => ({
      // Initial state
      clubs: mockClubs,
      selectedClub: null,
      selectedCourt: null,
      searchQuery: "",
      filters: {},
      filteredClubs: mockClubs,
      selectedDate: "",
      selectedTimeSlot: null,
      availableTimeSlots: [],
      duration: 1,
      loading: false,
      error: null,
      bookingLoading: false,
      bookingError: null,
      userBookings: [],
      currentBooking: null,

      // Set search query and filter clubs
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterClubs();
      },

      // Set filters and update filtered clubs
      setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        set({ filters: updatedFilters });
        get().filterClubs();
      },

      // Filter clubs based on search and filters
      filterClubs: () => {
        const { clubs, searchQuery, filters } = get();

        let filtered = clubs.filter((club) => {
          // Text search
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const matchesName = club.name.toLowerCase().includes(searchLower);
            const matchesLocation = club.location
              .toLowerCase()
              .includes(searchLower);
            if (!matchesName && !matchesLocation) return false;
          }

          // Surface filter
          if (filters.surface) {
            const hasSurface = club.courts.some(
              (court) => court.surface === filters.surface
            );
            if (!hasSurface) return false;
          }

          // Lighting filter
          if (filters.lighting !== undefined) {
            const hasLighting = club.courts.some(
              (court) => court.lighting === filters.lighting
            );
            if (!hasLighting) return false;
          }

          // Covered filter
          if (filters.covered !== undefined) {
            const hasCovered = club.courts.some(
              (court) => court.covered === filters.covered
            );
            if (!hasCovered) return false;
          }

          // Price range filter
          if (filters.priceRange) {
            const [minPrice, maxPrice] = filters.priceRange;
            if (
              club.priceRange.max < minPrice ||
              club.priceRange.min > maxPrice
            ) {
              return false;
            }
          }

          return true;
        });

        set({ filteredClubs: filtered });
      },

      // Club selection
      selectClub: (club) => {
        set({
          selectedClub: club,
          selectedCourt: null,
          selectedDate: "",
          selectedTimeSlot: null,
          availableTimeSlots: [],
        });
      },

      // Court selection
      selectCourt: (court) => {
        set({
          selectedCourt: court,
          selectedDate: "",
          selectedTimeSlot: null,
          availableTimeSlots: [],
        });
      },

      // Date selection
      setSelectedDate: (date) => {
        set({
          selectedDate: date,
          selectedTimeSlot: null,
          availableTimeSlots: [],
        });
      },

      // Time slot selection
      selectTimeSlot: (slot) => {
        set({ selectedTimeSlot: slot });
      },

      // Duration selection
      setDuration: (hours) => {
        set({ duration: hours });
      },

      // Load available time slots
      loadAvailableTimeSlots: async (clubId, courtId, date) => {
        set({ loading: true, error: null });

        try {
          await simulateApiDelay();

          const club = get().clubs.find((c) => c.id === clubId);
          const court = club?.courts.find((c) => c.id === courtId);

          if (!club || !court) {
            throw new Error("Klub ili teren nije pronađen");
          }

          const timeSlots = generateTimeSlots(club, court, date);

          set({
            availableTimeSlots: timeSlots,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error:
              error instanceof Error ? error.message : "Greška pri učitavanju",
          });
        }
      },

      // Book court
      bookCourt: async (bookingData) => {
        set({ bookingLoading: true, bookingError: null });

        try {
          await simulateApiDelay(2000);

          // Simulate random booking failure
          if (Math.random() > 0.85) {
            throw new Error(
              "Ovaj termin je upravo rezervisan. Molimo odaberite drugi."
            );
          }

          const {
            selectedClub,
            selectedCourt,
            selectedDate,
            selectedTimeSlot,
            duration,
          } = get();

          if (!selectedClub || !selectedCourt || !selectedTimeSlot) {
            throw new Error("Molimo kompletiranje svih informacija");
          }

          const startTime = selectedTimeSlot.time;
          const startHour = parseInt(startTime.split(":")[0]);
          const endHour = startHour + duration;
          const endTime = `${endHour.toString().padStart(2, "0")}:00`;

          const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            clubId: selectedClub.id,
            courtId: selectedCourt.id,
            date: selectedDate,
            startTime,
            endTime,
            duration,
            totalPrice: selectedTimeSlot.price * duration,
            status: "confirmed",
            playerName: bookingData.playerName || "Marko Petrović",
            playerEmail: bookingData.playerEmail || "marko@example.com",
            playerPhone: bookingData.playerPhone || "+381 64 123-4567",
            createdAt: new Date().toISOString(),
            specialRequests: bookingData.specialRequests,
          };

          set({
            currentBooking: newBooking,
            bookingLoading: false,
            userBookings: [...get().userBookings, newBooking],
          });
        } catch (error) {
          set({
            bookingLoading: false,
            bookingError:
              error instanceof Error ? error.message : "Greška pri rezervaciji",
          });
        }
      },

      // Load user bookings
      loadUserBookings: async () => {
        set({ loading: true });

        try {
          await simulateApiDelay();
          // In real app, fetch from API
          // For now, use existing bookings
          set({ loading: false });
        } catch (error) {
          set({
            loading: false,
            error: "Greška pri učitavanju rezervacija",
          });
        }
      },

      // Cancel booking
      cancelBooking: async (bookingId) => {
        set({ loading: true });

        try {
          await simulateApiDelay();

          const updatedBookings = get().userBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "cancelled" as const }
              : booking
          );

          set({
            userBookings: updatedBookings,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: "Greška pri otkazivanju rezervacije",
          });
        }
      },

      // Reset booking flow
      resetBookingFlow: () => {
        set({
          selectedClub: null,
          selectedCourt: null,
          selectedDate: "",
          selectedTimeSlot: null,
          availableTimeSlots: [],
          duration: 1,
          currentBooking: null,
          bookingError: null,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null, bookingError: null });
      },
    }),
    { name: "court-store" }
  )
);
