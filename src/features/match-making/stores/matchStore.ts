import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types for match-making
export interface Club {
  id: string;
  name: string;
  location: string;
  courts: number;
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  skillLevel: SkillLevel;
  rating: number;
  location: string;
  preferredClubs: string[];
  isOnline: boolean;
  lastActive: string;
  matchesPlayed: number;
  winRate: number;
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  club: Club;
  court: string;
  dateTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  matchType: MatchType;
  createdAt: string;
}

export type SkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert"
  | "pro";
export type MatchType = "casual" | "competitive";

export interface MatchPreferences {
  clubs: string[];
  skillLevels: SkillLevel[];
  matchType: MatchType;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  timeSlots: string[];
  maxDistance: number;
  onlyOnlinePlayers: boolean;
}

interface MatchState {
  // Current preferences
  preferences: MatchPreferences | null;

  // Search results
  availableMatches: Player[];
  searchLoading: boolean;
  searchError: string | null;

  // Selected match
  selectedPlayer: Player | null;

  // Booking state
  bookingLoading: boolean;
  bookingError: string | null;
  bookedMatch: Match | null;

  // Available data
  clubs: Club[];
  skillLevels: { value: SkillLevel; label: string }[];

  // Actions
  setPreferences: (preferences: MatchPreferences) => void;
  updatePreferences: (updates: Partial<MatchPreferences>) => void;
  searchMatches: () => Promise<void>;
  selectPlayer: (player: Player) => void;
  bookMatch: (player: Player, club: Club, dateTime: string) => Promise<void>;
  resetSearch: () => void;
  resetBooking: () => void;
}

// Default preferences
const defaultPreferences: MatchPreferences = {
  clubs: [],
  skillLevels: [],
  matchType: "casual",
  dateRange: {
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  timeSlots: [],
  maxDistance: 10,
  onlyOnlinePlayers: false,
};

// Mock data
const mockClubs: Club[] = [
  {
    id: "baseline",
    name: "Baseline Tennis Club",
    location: "Novi Beograd",
    courts: 8,
    rating: 4.8,
  },
  {
    id: "ace",
    name: "Ace Tennis Center",
    location: "Vračar",
    courts: 6,
    rating: 4.6,
  },
  {
    id: "match-point",
    name: "Match Point",
    location: "Zemun",
    courts: 4,
    rating: 4.7,
  },
  {
    id: "tennis-plus",
    name: "Tennis Plus",
    location: "Zvezdara",
    courts: 5,
    rating: 4.5,
  },
];

const mockPlayers: Player[] = [
  {
    id: "player1",
    name: "Ana Jovanović",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    skillLevel: "intermediate",
    rating: 1450,
    location: "Novi Beograd",
    preferredClubs: ["baseline", "ace"],
    isOnline: true,
    lastActive: "2 min ago",
    matchesPlayed: 47,
    winRate: 0.68,
  },
  {
    id: "player2",
    name: "Marko Nikolić",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    skillLevel: "advanced",
    rating: 1680,
    location: "Vračar",
    preferredClubs: ["ace", "match-point"],
    isOnline: true,
    lastActive: "5 min ago",
    matchesPlayed: 89,
    winRate: 0.72,
  },
  {
    id: "player3",
    name: "Milica Petrović",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b65c?w=150",
    skillLevel: "intermediate",
    rating: 1380,
    location: "Zemun",
    preferredClubs: ["match-point", "tennis-plus"],
    isOnline: false,
    lastActive: "1 hour ago",
    matchesPlayed: 32,
    winRate: 0.65,
  },
  {
    id: "player4",
    name: "Stefan Milošević",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    skillLevel: "expert",
    rating: 1820,
    location: "Novi Beograd",
    preferredClubs: ["baseline"],
    isOnline: true,
    lastActive: "now",
    matchesPlayed: 156,
    winRate: 0.78,
  },
];

const skillLevelsData = [
  { value: "beginner" as SkillLevel, label: "Početnik" },
  { value: "intermediate" as SkillLevel, label: "Srednji" },
  { value: "advanced" as SkillLevel, label: "Napredni" },
  { value: "expert" as SkillLevel, label: "Ekspert" },
  { value: "pro" as SkillLevel, label: "Profesionalac" },
];

// Simulate API calls
const simulateApiDelay = (ms: number = 1500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useMatchStore = create<MatchState>()(
  devtools(
    (set, get) => ({
      // Initial state
      preferences: null,
      availableMatches: [],
      searchLoading: false,
      searchError: null,
      selectedPlayer: null,
      bookingLoading: false,
      bookingError: null,
      bookedMatch: null,
      clubs: mockClubs,
      skillLevels: skillLevelsData,

      // Set preferences
      setPreferences: (preferences) => {
        set({ preferences }, false, "setPreferences");
      },

      // Update preferences partially
      updatePreferences: (updates) => {
        const currentPrefs = get().preferences || defaultPreferences;
        const newPrefs = { ...currentPrefs, ...updates };
        set({ preferences: newPrefs }, false, "updatePreferences");
      },

      // Search for matches
      searchMatches: async () => {
        const { preferences } = get();
        if (!preferences) return;

        set(
          { searchLoading: true, searchError: null },
          false,
          "searchMatches:start"
        );

        try {
          await simulateApiDelay();

          // Filter players based on preferences
          let filteredPlayers = mockPlayers.filter((player) => {
            // Filter by skill level
            if (
              preferences.skillLevels.length > 0 &&
              !preferences.skillLevels.includes(player.skillLevel)
            ) {
              return false;
            }

            // Filter by clubs
            if (preferences.clubs.length > 0) {
              const hasCommonClub = player.preferredClubs.some((club) =>
                preferences.clubs.includes(club)
              );
              if (!hasCommonClub) return false;
            }

            // Filter by online status
            if (preferences.onlyOnlinePlayers && !player.isOnline) {
              return false;
            }

            return true;
          });

          // Sort by rating and online status
          filteredPlayers = filteredPlayers.sort((a, b) => {
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            return b.rating - a.rating;
          });

          set(
            {
              availableMatches: filteredPlayers,
              searchLoading: false,
            },
            false,
            "searchMatches:success"
          );
        } catch (error) {
          set(
            {
              searchLoading: false,
              searchError: "Greška prilikom pretrage. Pokušajte ponovo.",
            },
            false,
            "searchMatches:error"
          );
        }
      },

      // Select a player for match
      selectPlayer: (player) => {
        set({ selectedPlayer: player }, false, "selectPlayer");
      },

      // Book a match
      bookMatch: async (player, club, dateTime) => {
        set(
          { bookingLoading: true, bookingError: null },
          false,
          "bookMatch:start"
        );

        try {
          await simulateApiDelay(2000);

          // Simulate random success/failure
          if (Math.random() > 0.8) {
            throw new Error("Ovaj termin je upravo zauzet. Pokušajte drugi.");
          }

          const newMatch: Match = {
            id: `match-${Date.now()}`,
            player1: {
              id: "current-user",
              name: "Marko Petrović",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
              skillLevel: "intermediate",
              rating: 1420,
              location: "Novi Beograd",
              preferredClubs: ["baseline"],
              isOnline: true,
              lastActive: "now",
              matchesPlayed: 23,
              winRate: 0.61,
            },
            player2: player,
            club,
            court: `Teren ${Math.floor(Math.random() * club.courts) + 1}`,
            dateTime,
            status: "confirmed",
            matchType: get().preferences?.matchType || "casual",
            createdAt: new Date().toISOString(),
          };

          set(
            {
              bookedMatch: newMatch,
              bookingLoading: false,
              selectedPlayer: null,
            },
            false,
            "bookMatch:success"
          );
        } catch (error) {
          set(
            {
              bookingLoading: false,
              bookingError:
                error instanceof Error ? error.message : "Neočekivana greška",
            },
            false,
            "bookMatch:error"
          );
        }
      },

      // Reset search
      resetSearch: () => {
        set(
          {
            availableMatches: [],
            searchError: null,
            selectedPlayer: null,
          },
          false,
          "resetSearch"
        );
      },

      // Reset booking
      resetBooking: () => {
        set(
          {
            bookingError: null,
            bookedMatch: null,
          },
          false,
          "resetBooking"
        );
      },
    }),
    { name: "match-store" }
  )
);
