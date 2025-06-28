import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, MapPin, Users, Filter } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import {
  useMatchStore,
  MatchPreferences,
  SkillLevel,
} from "../stores/matchStore";
import { cn } from "../../../shared/utils/cn";

// Validation schema
const matchPreferencesSchema = z.object({
  clubs: z.array(z.string()).min(1, "Odaberite najmanje jedan klub"),
  skillLevels: z.array(z.string()).min(1, "Odaberite nivo veštine"),
  matchType: z.enum(["casual", "competitive"]),
  startDate: z.string().min(1, "Odaberite početni datum"),
  endDate: z.string().min(1, "Odaberite krajnji datum"),
  timeSlots: z.array(z.string()).min(1, "Odaberite vreme"),
  onlyOnlinePlayers: z.boolean(),
});

type FormData = z.infer<typeof matchPreferencesSchema>;

interface MatchPreferencesFormProps {
  onNext: () => void;
}

// Time slots available for matches
const timeSlots = [
  { value: "08:00", label: "08:00" },
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
  { value: "21:00", label: "21:00" },
];

export function MatchPreferencesForm({
  onNext,
}: MatchPreferencesFormProps): JSX.Element {
  const { clubs, skillLevels, preferences, setPreferences } = useMatchStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get today and 7 days from now as default dates
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(matchPreferencesSchema),
    defaultValues: {
      clubs: preferences?.clubs || [],
      skillLevels: preferences?.skillLevels || [],
      matchType: preferences?.matchType || "casual",
      startDate: preferences?.dateRange.startDate || today,
      endDate: preferences?.dateRange.endDate || nextWeek,
      timeSlots: preferences?.timeSlots || [],
      onlyOnlinePlayers: preferences?.onlyOnlinePlayers || false,
    },
    mode: "onChange",
  });

  const watchedClubs = watch("clubs");
  const watchedSkillLevels = watch("skillLevels");
  const watchedTimeSlots = watch("timeSlots");

  const handleClubToggle = useCallback(
    (clubId: string) => {
      const currentClubs = watchedClubs || [];
      const newClubs = currentClubs.includes(clubId)
        ? currentClubs.filter((id) => id !== clubId)
        : [...currentClubs, clubId];
      setValue("clubs", newClubs, { shouldValidate: true });
    },
    [watchedClubs, setValue]
  );

  const handleSkillLevelToggle = useCallback(
    (level: SkillLevel) => {
      const currentLevels = watchedSkillLevels || [];
      const newLevels = currentLevels.includes(level)
        ? currentLevels.filter((l) => l !== level)
        : [...currentLevels, level];
      setValue("skillLevels", newLevels, { shouldValidate: true });
    },
    [watchedSkillLevels, setValue]
  );

  const handleTimeSlotToggle = useCallback(
    (timeSlot: string) => {
      const currentSlots = watchedTimeSlots || [];
      const newSlots = currentSlots.includes(timeSlot)
        ? currentSlots.filter((slot) => slot !== timeSlot)
        : [...currentSlots, timeSlot];
      setValue("timeSlots", newSlots, { shouldValidate: true });
    },
    [watchedTimeSlots, setValue]
  );

  const onSubmit = useCallback(
    (data: FormData) => {
      const matchPreferences: MatchPreferences = {
        clubs: data.clubs,
        skillLevels: data.skillLevels as SkillLevel[],
        matchType: data.matchType,
        dateRange: {
          startDate: data.startDate,
          endDate: data.endDate,
        },
        timeSlots: data.timeSlots,
        maxDistance: 10, // Default for now
        onlyOnlinePlayers: data.onlyOnlinePlayers,
      };

      setPreferences(matchPreferences);
      onNext();
    },
    [setPreferences, onNext]
  );

  return (
    <div className="min-h-full bg-neutral-50">
      <div className="bg-white px-6 py-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-900">
          Pronađi Protivnika
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Podesi svoje preference za sledeći meč
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Match Type Selection */}
        <div>
          <h3 className="text-base font-medium text-neutral-900 mb-3">
            Tip meča
          </h3>
          <Controller
            name="matchType"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange("casual")}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    field.value === "casual"
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-medium">Opušteno</div>
                      <div className="text-sm text-neutral-600">Za zabavu</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("competitive")}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    field.value === "competitive"
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Filter className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-medium">Takmičarski</div>
                      <div className="text-sm text-neutral-600">
                        Ozbiljan meč
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )}
          />
        </div>

        {/* Club Selection */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="w-4 h-4 text-neutral-600" />
            <h3 className="text-base font-medium text-neutral-900">Klubovi</h3>
          </div>
          {errors.clubs && (
            <p className="text-sm text-error-600 mb-2">
              {errors.clubs.message}
            </p>
          )}
          <div className="space-y-2">
            {clubs.map((club) => (
              <button
                key={club.id}
                type="button"
                onClick={() => handleClubToggle(club.id)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all",
                  watchedClubs?.includes(club.id)
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

        {/* Skill Level Selection */}
        <div>
          <h3 className="text-base font-medium text-neutral-900 mb-3">
            Nivo protivnika
          </h3>
          {errors.skillLevels && (
            <p className="text-sm text-error-600 mb-2">
              {errors.skillLevels.message}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {skillLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleSkillLevelToggle(level.value)}
                className={cn(
                  "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                  watchedSkillLevels?.includes(level.value)
                    ? "border-primary-500 bg-primary-600 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-neutral-600" />
            <h3 className="text-base font-medium text-neutral-900">Datum</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Od
              </label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    min={today}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-sm text-error-600 mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Do
              </label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    min={watch("startDate")}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              />
              {errors.endDate && (
                <p className="text-sm text-error-600 mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-neutral-600" />
            <h3 className="text-base font-medium text-neutral-900">Vreme</h3>
          </div>
          {errors.timeSlots && (
            <p className="text-sm text-error-600 mb-2">
              {errors.timeSlots.message}
            </p>
          )}
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => handleTimeSlotToggle(slot.value)}
                className={cn(
                  "p-2 rounded-lg border text-sm font-medium transition-all",
                  watchedTimeSlots?.includes(slot.value)
                    ? "border-primary-500 bg-primary-600 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                )}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-primary-600 font-medium"
          >
            <Filter className="w-4 h-4" />
            <span>Dodatne opcije</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-neutral-50 rounded-lg">
              <Controller
                name="onlyOnlinePlayers"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      Samo aktivni igrači
                    </span>
                  </label>
                )}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full"
            size="lg"
          >
            Pronađi Protivnike
          </Button>
        </div>
      </form>
    </div>
  );
}
