import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Target,
  Star,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { LoadingSpinner } from "../../../shared/components/ui/LoadingSpinner";
import { useTrainingStore, Trainer, TimeSlot } from "../stores/trainingStore";
import { cn } from "../../../shared/utils/cn";

interface SessionBookingProps {
  trainer: Trainer;
  onBack: () => void;
  onContinue: () => void;
}

interface DayCardProps {
  date: string;
  isSelected: boolean;
  isToday: boolean;
  hasAvailability: boolean;
  onClick: (date: string) => void;
}

function DayCard({
  date,
  isSelected,
  isToday,
  hasAvailability,
  onClick,
}: DayCardProps): JSX.Element {
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString("sr-RS", { weekday: "short" });
  const dayNumber = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString("sr-RS", { month: "short" });

  const handleClick = useCallback(() => {
    if (hasAvailability) {
      onClick(date);
    }
  }, [date, onClick, hasAvailability]);

  return (
    <button
      onClick={handleClick}
      disabled={!hasAvailability}
      className={cn(
        "p-3 rounded-lg border-2 text-center transition-all min-w-[80px]",
        !hasAvailability && "opacity-50 cursor-not-allowed",
        isSelected && hasAvailability
          ? "border-primary-500 bg-primary-50"
          : hasAvailability
          ? "border-neutral-200 bg-white hover:border-neutral-300"
          : "border-neutral-200 bg-neutral-50",
        isToday && "ring-2 ring-warning-200"
      )}
    >
      <div
        className={cn(
          "text-xs font-medium mb-1",
          isSelected
            ? "text-primary-700"
            : hasAvailability
            ? "text-neutral-600"
            : "text-neutral-400"
        )}
      >
        {dayName}
      </div>
      <div
        className={cn(
          "text-xl font-bold mb-1",
          isSelected
            ? "text-primary-900"
            : hasAvailability
            ? "text-neutral-900"
            : "text-neutral-400"
        )}
      >
        {dayNumber}
      </div>
      <div
        className={cn(
          "text-xs",
          isSelected
            ? "text-primary-600"
            : hasAvailability
            ? "text-neutral-500"
            : "text-neutral-400"
        )}
      >
        {monthName}
      </div>
      {isToday && (
        <div className="text-xs text-warning-600 font-medium mt-1">Danas</div>
      )}
      {!hasAvailability && (
        <div className="text-xs text-neutral-400 mt-1">Nedostupno</div>
      )}
    </button>
  );
}

interface TimeSlotCardProps {
  slot: TimeSlot;
  isSelected: boolean;
  duration: number;
  onClick: (slot: TimeSlot) => void;
}

function TimeSlotCard({
  slot,
  isSelected,
  duration,
  onClick,
}: TimeSlotCardProps): JSX.Element {
  const handleClick = useCallback(() => {
    if (slot.available) {
      onClick(slot);
    }
  }, [slot, onClick]);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  const totalPrice = slot.price * duration;

  return (
    <button
      onClick={handleClick}
      disabled={!slot.available}
      className={cn(
        "p-4 rounded-lg border-2 text-left transition-all w-full",
        !slot.available && "opacity-50 cursor-not-allowed",
        isSelected
          ? "border-primary-500 bg-primary-50"
          : slot.available
          ? "border-neutral-200 bg-white hover:border-neutral-300"
          : "border-neutral-200 bg-neutral-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={cn(
              "font-semibold text-lg mb-1",
              isSelected ? "text-primary-900" : "text-neutral-900"
            )}
          >
            {slot.time}
          </div>
          <div
            className={cn(
              "text-sm",
              isSelected ? "text-primary-700" : "text-neutral-600"
            )}
          >
            {slot.available ? "Dostupno" : "Zauzeto"}
          </div>
        </div>

        <div className="text-right">
          <div
            className={cn(
              "font-bold",
              isSelected ? "text-primary-900" : "text-neutral-900"
            )}
          >
            {formatPrice(totalPrice)}
          </div>
          {duration > 1 && (
            <div
              className={cn(
                "text-sm",
                isSelected ? "text-primary-600" : "text-neutral-500"
              )}
            >
              {duration}h
            </div>
          )}
        </div>

        {isSelected && (
          <div className="ml-3">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

export function SessionBooking({
  trainer,
  onBack,
  onContinue,
}: SessionBookingProps): JSX.Element {
  const {
    selectedDate,
    selectedTime,
    sessionType,
    sessionDuration,
    sessionFocus,
    availableTimeSlots,
    focusAreas,
    loading,
    error,
    setSelectedDate,
    setSelectedTime,
    setSessionDuration,
    setSessionFocus,
    loadAvailableSlots,
    clearError,
  } = useTrainingStore();

  // Generate next 14 days for selection
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    setAvailableDates(dates);
  }, []);

  // Check if trainer is available on specific day
  const isTrainerAvailable = useCallback(
    (date: string): boolean => {
      const dayName = new Date(date).toLocaleDateString("en-US", {
        weekday: "lowercase",
      });
      const availability = trainer.availability[dayName];
      return availability ? availability.available : false;
    },
    [trainer.availability]
  );

  const handleDateSelect = useCallback(
    async (date: string) => {
      setSelectedDate(date);
      setSelectedTime("");
      clearError();
      await loadAvailableSlots(trainer.id, date);
    },
    [
      setSelectedDate,
      setSelectedTime,
      clearError,
      loadAvailableSlots,
      trainer.id,
    ]
  );

  const handleTimeSelect = useCallback(
    (slot: TimeSlot) => {
      setSelectedTime(slot.time);
    },
    [setSelectedTime]
  );

  const handleDurationChange = useCallback(
    (newDuration: number) => {
      if (newDuration >= 1 && newDuration <= 3) {
        setSessionDuration(newDuration);
      }
    },
    [setSessionDuration]
  );

  const handleFocusToggle = useCallback(
    (focus: string) => {
      const currentFocus = sessionFocus || [];
      const newFocus = currentFocus.includes(focus)
        ? currentFocus.filter((f) => f !== focus)
        : [...currentFocus, focus];
      setSessionFocus(newFocus);
    },
    [sessionFocus, setSessionFocus]
  );

  const handleContinue = useCallback(() => {
    if (selectedDate && selectedTime) {
      onContinue();
    }
  }, [selectedDate, selectedTime, onContinue]);

  const today = new Date().toISOString().split("T")[0];
  const canContinue = selectedDate && selectedTime && !loading;

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  const getSessionPrice = (): number => {
    switch (sessionType) {
      case "individual":
        return trainer.hourlyRate;
      case "group":
        return Math.round(trainer.hourlyRate * 0.7);
      case "assessment":
        return Math.round(trainer.hourlyRate * 1.2);
      case "match-play":
        return Math.round(trainer.hourlyRate * 1.1);
      default:
        return trainer.hourlyRate;
    }
  };

  const totalPrice = getSessionPrice() * sessionDuration;

  const getSessionTypeLabel = (): string => {
    const sessionTypeLabels = {
      individual: "Individualni trening",
      group: "Grupni trening",
      assessment: "Procena igre",
      "match-play": "Match play",
    };
    return sessionTypeLabels[sessionType] || "Individualni trening";
  };

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="flex items-center px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 -ml-2 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              Rezerviši trening
            </h1>
            <p className="text-sm text-neutral-600">sa {trainer.name}</p>
          </div>
        </div>
      </div>

      {/* Trainer info */}
      <div className="bg-primary-50 px-6 py-4">
        <div className="flex items-center space-x-4">
          <img
            src={trainer.avatar}
            alt={trainer.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-primary-900">{trainer.name}</h3>
            <div className="flex items-center space-x-3 text-sm text-primary-700">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current" />
                <span>{trainer.rating}</span>
              </div>
              <span>•</span>
              <span>{getSessionTypeLabel()}</span>
              <span>•</span>
              <span>{formatPrice(getSessionPrice())}/h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Date selection */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-neutral-600" />
            <h2 className="text-lg font-semibold text-neutral-900">
              Odaberite datum
            </h2>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2">
            {availableDates.map((date) => (
              <DayCard
                key={date}
                date={date}
                isSelected={selectedDate === date}
                isToday={date === today}
                hasAvailability={isTrainerAvailable(date)}
                onClick={handleDateSelect}
              />
            ))}
          </div>
        </div>

        {/* Duration selection */}
        <div>
          <h3 className="text-base font-semibold text-neutral-900 mb-3">
            Trajanje treninga
          </h3>

          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDurationChange(sessionDuration - 1)}
              disabled={sessionDuration <= 1}
              className="p-2"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-neutral-900">
                {sessionDuration}
              </span>
              <span className="text-neutral-600">
                {sessionDuration === 1 ? "sat" : "sata"}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDurationChange(sessionDuration + 1)}
              disabled={sessionDuration >= 3}
              className="p-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-neutral-600 mt-2">
            Minimum 1 sat, maksimum 3 sata
          </p>
        </div>

        {/* Focus areas */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-neutral-600" />
            <h3 className="text-base font-semibold text-neutral-900">
              Fokus treninga (opciono)
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {focusAreas.slice(0, 12).map((area) => (
              <button
                key={area}
                onClick={() => handleFocusToggle(area)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-all",
                  sessionFocus?.includes(area)
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                )}
              >
                {area}
              </button>
            ))}
          </div>

          <p className="text-sm text-neutral-600 mt-2">
            Odaberite oblasti na kojima želite da radite tokom treninga
          </p>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-neutral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">
                Dostupni termini
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Učitavam dostupne termine..." />
              </div>
            ) : error ? (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-error-600" />
                  <span className="text-error-700 font-medium">Greška</span>
                </div>
                <p className="text-error-600 mt-1">{error}</p>
                <Button
                  variant="secondary"
                  onClick={() => handleDateSelect(selectedDate)}
                  className="mt-3"
                  size="sm"
                >
                  Pokušaj ponovo
                </Button>
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Nema dostupnih termina
                </h3>
                <p className="text-neutral-600">
                  {trainer.name} nije dostupan ovog dana. Molimo odaberite drugi
                  datum.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableTimeSlots.map((slot) => (
                  <TimeSlotCard
                    key={slot.time}
                    slot={slot}
                    isSelected={selectedTime === slot.time}
                    duration={sessionDuration}
                    onClick={handleTimeSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary and continue */}
      {canContinue && (
        <div className="bg-white border-t border-neutral-200 p-6">
          <div className="max-w-md mx-auto">
            {/* Session summary */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-neutral-900 mb-3">
                Pregled treninga
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Trener:</span>
                  <span className="font-medium">{trainer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tip:</span>
                  <span className="font-medium">{getSessionTypeLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Datum:</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString("sr-RS", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Vreme:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Trajanje:</span>
                  <span className="font-medium">
                    {sessionDuration} {sessionDuration === 1 ? "sat" : "sata"}
                  </span>
                </div>
                {sessionFocus && sessionFocus.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Fokus:</span>
                    <span className="font-medium">
                      {sessionFocus.slice(0, 2).join(", ")}
                    </span>
                  </div>
                )}
                <div className="border-t border-neutral-200 pt-2 mt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Ukupno:</span>
                    <span className="text-primary-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleContinue} className="w-full" size="lg">
              Nastavi sa rezervacijom
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
