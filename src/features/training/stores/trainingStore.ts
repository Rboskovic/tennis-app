import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types for training system
export interface Trainer {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  experience: number; // years
  specialties: string[];
  certifications: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: {
    [day: string]: { start: string; end: string; available: boolean };
  };
  location: string;
  clubs: string[]; // Club IDs where trainer works
  isOnline: boolean;
  responseTime: string; // "Usually responds within X hours"
  cancellationPolicy: string;
  reviews: TrainerReview[];
}

export interface TrainerReview {
  id: string;
  playerName: string;
  playerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface TrainingSession {
  id: string;
  trainerId: string;
  playerId: string;
  clubId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  sessionType: SessionType;
  focus: string[]; // e.g., ["forehand", "serve", "strategy"]
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
  playerLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

export type SessionType = "individual" | "group" | "assessment" | "match-play";

export interface TrainingFilters {
  specialties?: string[];
  priceRange?: [number, number];
  rating?: number;
  experience?: number;
  location?: string;
  clubs?: string[];
  availability?: string; // day of week
  sessionType?: SessionType;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  sessionType: SessionType;
}

interface TrainingState {
  // Trainers data
  trainers: Trainer[];
  filteredTrainers: Trainer[];
  selectedTrainer: Trainer | null;

  // Search and filters
  searchQuery: string;
  filters: TrainingFilters;

  // Booking flow
  selectedDate: string;
  selectedTime: string;
  sessionType: SessionType;
  sessionDuration: number;
  sessionFocus: string[];
  availableTimeSlots: TimeSlot[];

  // API states
  loading: boolean;
  error: string | null;
  bookingLoading: boolean;
  bookingError: string | null;

  // User sessions
  userSessions: TrainingSession[];
  currentSession: TrainingSession | null;

  // Available options
  availableSpecialties: string[];
  availableClubs: { id: string; name: string; location: string }[];
  sessionTypes: { type: SessionType; label: string; description: string }[];
  focusAreas: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TrainingFilters>) => void;
  selectTrainer: (trainer: Trainer) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setSessionType: (type: SessionType) => void;
  setSessionDuration: (duration: number) => void;
  setSessionFocus: (focus: string[]) => void;
  loadAvailableSlots: (trainerId: string, date: string) => Promise<void>;
  bookSession: (sessionData: Partial<TrainingSession>) => Promise<void>;
  loadUserSessions: () => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
  resetBookingFlow: () => void;
  clearError: () => void;
}

// Mock data
const mockClubs = [
  { id: "baseline", name: "Baseline Tennis Club", location: "Novi Beograd" },
  { id: "ace", name: "Ace Tennis Center", location: "Vračar" },
  { id: "match-point", name: "Match Point", location: "Zemun" },
  { id: "tennis-plus", name: "Tennis Plus", location: "Zvezdara" },
];

const mockSpecialties = [
  "Forhend",
  "Bekhend",
  "Servis",
  "Vole",
  "Strategija",
  "Mentalna priprema",
  "Brzina",
  "Izdržljivost",
  "Tehnička analiza",
  "Taktika",
  "Match play",
];

const focusAreas = [
  "Forhend",
  "Bekhend",
  "Servis",
  "Return servisa",
  "Vole",
  "Smash",
  "Drop shot",
  "Lob",
  "Strategija",
  "Mentalna igra",
  "Fizička priprema",
  "Footwork",
  "Taktika",
  "Match play",
  "Defensiva",
  "Agresivna igra",
];

const sessionTypesData = [
  {
    type: "individual" as SessionType,
    label: "Individualni trening",
    description: "Personalizovani jedan-na-jedan trening",
  },
  {
    type: "group" as SessionType,
    label: "Grupni trening",
    description: "Trening u maloj grupi (2-4 igrača)",
  },
  {
    type: "assessment" as SessionType,
    label: "Procena igre",
    description: "Analiza tehnike i preporuke za napredovanje",
  },
  {
    type: "match-play" as SessionType,
    label: "Match play",
    description: "Simulacija meča sa strategijskim savjetima",
  },
];

const mockTrainers: Trainer[] = [
  {
    id: "trainer1",
    name: "Marija Jovanović",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b65c?w=200",
    bio: "Profesionalna teniska trenerka sa 8 godina iskustva. Specijalizovana za rad sa početnicima i srednjim igračima.",
    experience: 8,
    specialties: ["Forhend", "Bekhend", "Strategija"],
    certifications: ["PTR Certified", "ITF Level 2", "Mental Coaching"],
    languages: ["Srpski", "Engleski"],
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 4500,
    availability: {
      monday: { start: "09:00", end: "18:00", available: true },
      tuesday: { start: "09:00", end: "18:00", available: true },
      wednesday: { start: "09:00", end: "18:00", available: true },
      thursday: { start: "09:00", end: "18:00", available: true },
      friday: { start: "09:00", end: "18:00", available: true },
      saturday: { start: "08:00", end: "16:00", available: true },
      sunday: { start: "10:00", end: "15:00", available: false },
    },
    location: "Novi Beograd",
    clubs: ["baseline", "ace"],
    isOnline: true,
    responseTime: "Obično odgovara za 2 sata",
    cancellationPolicy: "Otkazivanje 24h unapred bez naknade",
    reviews: [
      {
        id: "r1",
        playerName: "Ana Petrović",
        playerAvatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
        rating: 5,
        comment: "Odlična trenerka! Značajno mi je poboljšala forhend.",
        date: "2024-01-15",
        verified: true,
      },
    ],
  },
  {
    id: "trainer2",
    name: "Stefan Milošević",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    bio: "Bivši profesionalni igrač i sadašnji trener. Fokus na naprednim tehnikama i mentalnu pripremu.",
    experience: 12,
    specialties: ["Servis", "Mentalna priprema", "Match play"],
    certifications: ["ITF Level 3", "Mental Performance Coach", "USPTA Elite"],
    languages: ["Srpski", "Engleski", "Italijanski"],
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 6000,
    availability: {
      monday: { start: "08:00", end: "20:00", available: true },
      tuesday: { start: "08:00", end: "20:00", available: true },
      wednesday: { start: "08:00", end: "20:00", available: true },
      thursday: { start: "08:00", end: "20:00", available: true },
      friday: { start: "08:00", end: "20:00", available: true },
      saturday: { start: "09:00", end: "17:00", available: true },
      sunday: { start: "09:00", end: "17:00", available: true },
    },
    location: "Vračar",
    clubs: ["ace", "match-point"],
    isOnline: true,
    responseTime: "Obično odgovara za 1 sat",
    cancellationPolicy: "Otkazivanje 48h unapred bez naknade",
    reviews: [
      {
        id: "r2",
        playerName: "Marko Nikolić",
        playerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 5,
        comment:
          "Izvanredan rad na mentalnoj pripremi. Značajno poboljšanje u mečevima.",
        date: "2024-01-20",
        verified: true,
      },
    ],
  },
  {
    id: "trainer3",
    name: "Nikola Petrović",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
    bio: "Mladi i energičan trener specijalizovan za rad sa decom i mladima.",
    experience: 4,
    specialties: ["Brzina", "Footwork", "Tehnička analiza"],
    certifications: ["ITF Level 1", "Youth Tennis Coach"],
    languages: ["Srpski", "Engleski"],
    rating: 4.7,
    reviewCount: 45,
    hourlyRate: 3500,
    availability: {
      monday: { start: "15:00", end: "21:00", available: true },
      tuesday: { start: "15:00", end: "21:00", available: true },
      wednesday: { start: "15:00", end: "21:00", available: true },
      thursday: { start: "15:00", end: "21:00", available: true },
      friday: { start: "15:00", end: "21:00", available: true },
      saturday: { start: "09:00", end: "18:00", available: true },
      sunday: { start: "09:00", end: "18:00", available: false },
    },
    location: "Zemun",
    clubs: ["match-point", "tennis-plus"],
    isOnline: false,
    responseTime: "Obično odgovara za 4 sata",
    cancellationPolicy: "Otkazivanje 12h unapred bez naknade",
    reviews: [],
  },
  {
    id: "trainer4",
    name: "Jelena Stojanović",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    bio: "Iskusna trenerka sa fokusom na ženski tenis i strategiju igre.",
    experience: 10,
    specialties: ["Strategija", "Vole", "Taktika"],
    certifications: ["WTA Coaching", "ITF Level 2", "Fitness for Tennis"],
    languages: ["Srpski", "Nemački", "Engleski"],
    rating: 4.9,
    reviewCount: 76,
    hourlyRate: 5200,
    availability: {
      monday: { start: "10:00", end: "19:00", available: true },
      tuesday: { start: "10:00", end: "19:00", available: true },
      wednesday: { start: "10:00", end: "19:00", available: false },
      thursday: { start: "10:00", end: "19:00", available: true },
      friday: { start: "10:00", end: "19:00", available: true },
      saturday: { start: "09:00", end: "15:00", available: true },
      sunday: { start: "09:00", end: "15:00", available: true },
    },
    location: "Novi Beograd",
    clubs: ["baseline", "tennis-plus"],
    isOnline: true,
    responseTime: "Obično odgovara za 3 sata",
    cancellationPolicy: "Otkazivanje 24h unapred bez naknade",
    reviews: [],
  },
];

// API simulation
const simulateApiDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate time slots for trainer on specific date
const generateTimeSlots = (trainer: Trainer, date: string): TimeSlot[] => {
  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "lowercase",
  });
  const availability = trainer.availability[dayName];

  if (!availability || !availability.available) return [];

  const slots: TimeSlot[] = [];
  const startHour = parseInt(availability.start.split(":")[0]);
  const endHour = parseInt(availability.end.split(":")[0]);

  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    const available = Math.random() > 0.3; // Simulate availability

    slots.push({
      time,
      available,
      price: trainer.hourlyRate,
      sessionType: "individual",
    });
  }

  return slots;
};

export const useTrainingStore = create<TrainingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      trainers: mockTrainers,
      filteredTrainers: mockTrainers,
      selectedTrainer: null,
      searchQuery: "",
      filters: {},
      selectedDate: "",
      selectedTime: "",
      sessionType: "individual",
      sessionDuration: 1,
      sessionFocus: [],
      availableTimeSlots: [],
      loading: false,
      error: null,
      bookingLoading: false,
      bookingError: null,
      userSessions: [],
      currentSession: null,
      availableSpecialties: mockSpecialties,
      availableClubs: mockClubs,
      sessionTypes: sessionTypesData,
      focusAreas,

      // Set search query and filter trainers
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterTrainers();
      },

      // Set filters and update filtered trainers
      setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        set({ filters: updatedFilters });
        get().filterTrainers();
      },

      // Filter trainers based on search and filters
      filterTrainers: () => {
        const { trainers, searchQuery, filters } = get();

        let filtered = trainers.filter((trainer) => {
          // Text search
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const matchesName = trainer.name
              .toLowerCase()
              .includes(searchLower);
            const matchesSpecialty = trainer.specialties.some((s) =>
              s.toLowerCase().includes(searchLower)
            );
            if (!matchesName && !matchesSpecialty) return false;
          }

          // Specialties filter
          if (filters.specialties && filters.specialties.length > 0) {
            const hasSpecialty = trainer.specialties.some((specialty) =>
              filters.specialties!.includes(specialty)
            );
            if (!hasSpecialty) return false;
          }

          // Price range filter
          if (filters.priceRange) {
            const [minPrice, maxPrice] = filters.priceRange;
            if (
              trainer.hourlyRate < minPrice ||
              trainer.hourlyRate > maxPrice
            ) {
              return false;
            }
          }

          // Rating filter
          if (filters.rating && trainer.rating < filters.rating) {
            return false;
          }

          // Experience filter
          if (filters.experience && trainer.experience < filters.experience) {
            return false;
          }

          // Location filter
          if (filters.location && trainer.location !== filters.location) {
            return false;
          }

          // Clubs filter
          if (filters.clubs && filters.clubs.length > 0) {
            const hasClub = trainer.clubs.some((club) =>
              filters.clubs!.includes(club)
            );
            if (!hasClub) return false;
          }

          return true;
        });

        // Sort by rating and online status
        filtered = filtered.sort((a, b) => {
          if (a.isOnline && !b.isOnline) return -1;
          if (!a.isOnline && b.isOnline) return 1;
          return b.rating - a.rating;
        });

        set({ filteredTrainers: filtered });
      },

      // Select trainer
      selectTrainer: (trainer) => {
        set({
          selectedTrainer: trainer,
          selectedDate: "",
          selectedTime: "",
          availableTimeSlots: [],
        });
      },

      // Set selected date
      setSelectedDate: (date) => {
        set({
          selectedDate: date,
          selectedTime: "",
          availableTimeSlots: [],
        });
      },

      // Set selected time
      setSelectedTime: (time) => {
        set({ selectedTime: time });
      },

      // Set session type
      setSessionType: (type) => {
        set({ sessionType: type });
      },

      // Set session duration
      setSessionDuration: (duration) => {
        set({ sessionDuration: duration });
      },

      // Set session focus areas
      setSessionFocus: (focus) => {
        set({ sessionFocus: focus });
      },

      // Load available time slots
      loadAvailableSlots: async (trainerId, date) => {
        set({ loading: true, error: null });

        try {
          await simulateApiDelay();

          const trainer = get().trainers.find((t) => t.id === trainerId);
          if (!trainer) {
            throw new Error("Trener nije pronađen");
          }

          const timeSlots = generateTimeSlots(trainer, date);

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

      // Book training session
      bookSession: async (sessionData) => {
        set({ bookingLoading: true, bookingError: null });

        try {
          await simulateApiDelay(2000);

          // Simulate random booking failure
          if (Math.random() > 0.9) {
            throw new Error(
              "Ovaj termin je upravo rezervisan. Molimo odaberite drugi."
            );
          }

          const {
            selectedTrainer,
            selectedDate,
            selectedTime,
            sessionType,
            sessionDuration,
            sessionFocus,
          } = get();

          if (!selectedTrainer || !selectedDate || !selectedTime) {
            throw new Error("Molimo kompletiranje svih informacija");
          }

          const startHour = parseInt(selectedTime.split(":")[0]);
          const endHour = startHour + sessionDuration;
          const endTime = `${endHour.toString().padStart(2, "0")}:00`;

          const newSession: TrainingSession = {
            id: `session-${Date.now()}`,
            trainerId: selectedTrainer.id,
            playerId: "current-user",
            clubId: selectedTrainer.clubs[0],
            date: selectedDate,
            startTime: selectedTime,
            endTime,
            duration: sessionDuration,
            sessionType,
            focus: sessionFocus,
            status: "confirmed",
            totalPrice: selectedTrainer.hourlyRate * sessionDuration,
            specialRequests: sessionData.specialRequests,
            createdAt: new Date().toISOString(),
            playerLevel: sessionData.playerLevel || "intermediate",
          };

          set({
            currentSession: newSession,
            bookingLoading: false,
            userSessions: [...get().userSessions, newSession],
          });
        } catch (error) {
          set({
            bookingLoading: false,
            bookingError:
              error instanceof Error ? error.message : "Greška pri rezervaciji",
          });
        }
      },

      // Load user sessions
      loadUserSessions: async () => {
        set({ loading: true });

        try {
          await simulateApiDelay();
          // In real app, fetch from API
          set({ loading: false });
        } catch (error) {
          set({
            loading: false,
            error: "Greška pri učitavanju sesija",
          });
        }
      },

      // Cancel session
      cancelSession: async (sessionId) => {
        set({ loading: true });

        try {
          await simulateApiDelay();

          const updatedSessions = get().userSessions.map((session) =>
            session.id === sessionId
              ? { ...session, status: "cancelled" as const }
              : session
          );

          set({
            userSessions: updatedSessions,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: "Greška pri otkazivanju sesije",
          });
        }
      },

      // Reset booking flow
      resetBookingFlow: () => {
        set({
          selectedTrainer: null,
          selectedDate: "",
          selectedTime: "",
          sessionType: "individual",
          sessionDuration: 1,
          sessionFocus: [],
          availableTimeSlots: [],
          currentSession: null,
          bookingError: null,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null, bookingError: null });
      },
    }),
    { name: "training-store" }
  )
);
