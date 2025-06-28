import React, { useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { LoadingSpinner } from "../../../shared/components/ui/LoadingSpinner";
import { useMatchStore, Player, Club } from "../stores/matchStore";
import { cn } from "../../../shared/utils/cn";

interface MatchBookingProps {
  player: Player;
  onBack: () => void;
  onSuccess: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  court?: string;
}

export function MatchBooking({
  player,
  onBack,
  onSuccess,
}: MatchBookingProps): JSX.Element {
  const {
    clubs,
    preferences,
    bookingLoading,
    bookingError,
    bookedMatch,
    bookMatch,
    resetBooking,
  } = useMatchStore();

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Get available clubs based on player preferences and user preferences
  const availableClubs = clubs.filter(
    (club) =>
      player.preferredClubs.includes(club.id) &&
      preferences?.clubs.includes(club.id)
  );

  // Generate time slots for selected date
  const generateTimeSlots = useCallback(
    (clubId: string, date: string): TimeSlot[] => {
      if (!preferences) return [];

      return preferences.timeSlots.map((time) => ({
        time,
        available: Math.random() > 0.3, // Simulate availability
        court: `Teren ${
          Math.floor(Math.random() * (selectedClub?.courts || 4)) + 1
        }`,
      }));
    },
    [preferences, selectedClub]
  );

  const availableTimeSlots =
    selectedClub && selectedDate
      ? generateTimeSlots(selectedClub.id, selectedDate)
      : [];

  // Get available dates from preferences
  const getAvailableDates = useCallback((): string[] => {
    if (!preferences) return [];

    const dates = [];
    const start = new Date(preferences.dateRange.startDate);
    const end = new Date(preferences.dateRange.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }

    return dates;
  }, [preferences]);

  const availableDates = getAvailableDates();

  const handleClubSelect = useCallback((club: Club) => {
    setSelectedClub(club);
    setSelectedDate("");
    setSelectedTime("");
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleBookMatch = useCallback(async () => {
    if (!selectedClub || !selectedDate || !selectedTime) return;

    const dateTime = `${selectedDate}T${selectedTime}:00`;
    await bookMatch(player, selectedClub, dateTime);
  }, [selectedClub, selectedDate, selectedTime, player, bookMatch]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canBook =
    selectedClub && selectedDate && selectedTime && !bookingLoading;

  // Show success state
  if (bookedMatch) {
    return (
      <div className="min-h-full bg-neutral-50">
        <div className="bg-white px-6 py-4 border-b border-neutral-200">
          <h1 className="text-xl font-semibold text-neutral-900">
            Meč zakazan!
          </h1>
        </div>

        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success-600" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Uspešno zakazano!
            </h2>
            <p className="text-neutral-600 mb-8">
              Vaš meč je potvrđen. Detalji su poslati na email.
            </p>

            {/* Match details card */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 text-left mb-8">
              <h3 className="font-semibold text-neutral-900 mb-4">
                Detalji meča
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-neutral-400" />
                  <span className="text-neutral-600">Protivnik:</span>
                  <span className="font-medium">
                    {bookedMatch.player2.name}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-neutral-400" />
                  <span className="text-neutral-600">Datum:</span>
                  <span className="font-medium">
                    {formatDate(bookedMatch.dateTime.split("T")[0])}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-neutral-400" />
                  <span className="text-neutral-600">Vreme:</span>
                  <span className="font-medium">
                    {bookedMatch.dateTime.split("T")[1].slice(0, 5)}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-neutral-400" />
                  <span className="text-neutral-600">Lokacija:</span>
                  <span className="font-medium">
                    {bookedMatch.club.name}, {bookedMatch.court}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={onSuccess} className="w-full">
                Idi na početnu
              </Button>
              <Button
                variant="secondary"
                onClick={() => resetBooking()}
                className="w-full"
              >
                Zakaži još jedan meč
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-900">Zakaži meč</h1>
        <p className="text-sm text-neutral-600 mt-1">Meč sa {player.name}</p>
      </div>

      {/* Player info */}
      <div className="bg-primary-50 px-6 py-4">
        <div className="flex items-center space-x-4">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-primary-900">{player.name}</h3>
            <p className="text-sm text-primary-700">
              Rating: {player.rating} • {player.winRate * 100}% pobeda
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Club Selection */}
        <div>
          <h3 className="text-base font-medium text-neutral-900 mb-3">
            Odaberite klub
          </h3>
          <div className="space-y-2">
            {availableClubs.map((club) => (
              <button
                key={club.id}
                onClick={() => handleClubSelect(club)}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  selectedClub?.id === club.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">
                      {club.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {club.location} • {club.courts} terena
                    </div>
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    ⭐ {club.rating}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        {selectedClub && (
          <div>
            <h3 className="text-base font-medium text-neutral-900 mb-3">
              Odaberite datum
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {availableDates.slice(0, 6).map((date) => (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={cn(
                    "p-3 rounded-lg border text-sm transition-all",
                    selectedDate === date
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="font-medium">
                    {new Date(date).toLocaleDateString("sr-RS", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        {selectedClub && selectedDate && (
          <div>
            <h3 className="text-base font-medium text-neutral-900 mb-3">
              Odaberite vreme
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {availableTimeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "p-3 rounded-lg border text-sm transition-all",
                    !slot.available && "opacity-50 cursor-not-allowed",
                    selectedTime === slot.time && slot.available
                      ? "border-primary-500 bg-primary-50"
                      : slot.available
                      ? "border-neutral-200 bg-white hover:border-neutral-300"
                      : "border-neutral-200 bg-neutral-50"
                  )}
                >
                  <div className="font-medium">{slot.time}</div>
                  {slot.available ? (
                    <div className="text-xs text-success-600">Dostupno</div>
                  ) : (
                    <div className="text-xs text-error-600">Zauzeto</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Booking Error */}
        {bookingError && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-error-600" />
              <span className="text-error-700 font-medium">Greška</span>
            </div>
            <p className="text-error-600 mt-1">{bookingError}</p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="bg-white border-t border-neutral-200 p-6 space-y-3">
        <Button
          onClick={handleBookMatch}
          disabled={!canBook}
          loading={bookingLoading}
          className="w-full"
          size="lg"
        >
          {bookingLoading ? "Zakazujem..." : "Potvrdi rezervaciju"}
        </Button>

        <Button
          variant="secondary"
          onClick={onBack}
          disabled={bookingLoading}
          className="w-full"
        >
          Nazad na rezultate
        </Button>
      </div>
    </div>
  );
}
