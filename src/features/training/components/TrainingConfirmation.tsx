import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Check,
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Star,
  Calendar,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { useTrainingStore, Trainer } from "../stores/trainingStore";
import { cn } from "../../../shared/utils/cn";

interface TrainingConfirmationProps {
  trainer: Trainer;
  onBack: () => void;
  onSuccess: () => void;
}

// Validation schema
const trainingBookingSchema = z.object({
  playerName: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  playerEmail: z.string().email("Unesite validnu email adresu"),
  playerPhone: z.string().min(9, "Unesite validan broj telefona"),
  playerLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  specialRequests: z.string().optional(),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "Morate prihvatiti uslove korišćenja"),
});

type TrainingFormData = z.infer<typeof trainingBookingSchema>;

export function TrainingConfirmation({
  trainer,
  onBack,
  onSuccess,
}: TrainingConfirmationProps): JSX.Element {
  const {
    selectedDate,
    selectedTime,
    sessionType,
    sessionDuration,
    sessionFocus,
    bookingLoading,
    bookingError,
    bookSession,
    clearError,
  } = useTrainingStore();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingBookingSchema),
    defaultValues: {
      playerName: "Marko Petrović",
      playerEmail: "marko@example.com",
      playerPhone: "+381 64 123-4567",
      playerLevel: "intermediate",
      specialRequests: "",
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  const watchedName = watch("playerName");
  const watchedEmail = watch("playerEmail");
  const watchedPhone = watch("playerPhone");
  const watchedLevel = watch("playerLevel");

  const onSubmit = useCallback(
    async (data: TrainingFormData) => {
      if (!selectedTime) return;

      clearError();
      await bookSession({
        playerName: data.playerName,
        playerEmail: data.playerEmail,
        playerPhone: data.playerPhone,
        playerLevel: data.playerLevel,
        specialRequests: data.specialRequests,
      });

      // If no error, navigate to success
      if (!bookingError) {
        onSuccess();
      }
    },
    [selectedTime, clearError, bookSession, bookingError, onSuccess]
  );

  if (!selectedDate || !selectedTime) {
    return (
      <div className="min-h-full bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">
            Podaci o treningu nisu kompletni
          </p>
          <Button onClick={onBack}>Vrati se nazad</Button>
        </div>
      </div>
    );
  }

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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSessionTypeLabel = (): string => {
    const sessionTypeLabels = {
      individual: "Individualni trening",
      group: "Grupni trening",
      assessment: "Procena igre",
      "match-play": "Match play",
    };
    return sessionTypeLabels[sessionType] || "Individualni trening";
  };

  const getLevelLabel = (level: string): string => {
    const levelLabels = {
      beginner: "Početnik",
      intermediate: "Srednji",
      advanced: "Napredni",
      expert: "Ekspert",
    };
    return levelLabels[level as keyof typeof levelLabels] || level;
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
              Potvrda rezervacije
            </h1>
            <p className="text-sm text-neutral-600">
              Finalizujte vašu rezervaciju treninga
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Session summary */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
            <h2 className="text-lg font-semibold text-primary-900">
              Pregled treninga
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Trainer info */}
            <div className="flex items-start space-x-4">
              <img
                src={trainer.avatar}
                alt={trainer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 mb-1">
                  {trainer.name}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-neutral-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-warning-500 fill-current" />
                    <span>
                      {trainer.rating} ({trainer.reviewCount})
                    </span>
                  </div>
                  <span>•</span>
                  <span>{trainer.experience} godina iskustva</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {trainer.location}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600">
                  {formatPrice(getSessionPrice())}
                </div>
                <div className="text-sm text-neutral-600">po satu</div>
              </div>
            </div>

            {/* Session details */}
            <div className="border-t border-neutral-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-neutral-600">Datum:</div>
                    <div className="font-medium">
                      {formatDate(selectedDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-neutral-600">Vreme:</div>
                    <div className="font-medium">{selectedTime}</div>
                  </div>
                </div>

                <div>
                  <div className="text-neutral-600">Tip treninga:</div>
                  <div className="font-medium">{getSessionTypeLabel()}</div>
                </div>

                <div>
                  <div className="text-neutral-600">Trajanje:</div>
                  <div className="font-medium">
                    {sessionDuration} {sessionDuration === 1 ? "sat" : "sata"}
                  </div>
                </div>
              </div>

              {/* Focus areas */}
              {sessionFocus && sessionFocus.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      Fokus treninga:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sessionFocus.map((focus, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Total price */}
              <div className="border-t border-neutral-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-neutral-900">
                    Ukupno:
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player information */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Informacije o igraču
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <User className="w-4 h-4 inline mr-2" />
                  Ime i prezime *
                </label>
                <input
                  {...register("playerName")}
                  type="text"
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.playerName
                      ? "border-error-500"
                      : "border-neutral-300"
                  )}
                  placeholder="Unesite vaše ime i prezime"
                />
                {errors.playerName && (
                  <p className="text-sm text-error-600 mt-1">
                    {errors.playerName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nivo igre *
                </label>
                <select
                  {...register("playerLevel")}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.playerLevel
                      ? "border-error-500"
                      : "border-neutral-300"
                  )}
                >
                  <option value="beginner">Početnik</option>
                  <option value="intermediate">Srednji</option>
                  <option value="advanced">Napredni</option>
                  <option value="expert">Ekspert</option>
                </select>
                {errors.playerLevel && (
                  <p className="text-sm text-error-600 mt-1">
                    {errors.playerLevel.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Mail className="w-4 h-4 inline mr-2" />
                Email adresa *
              </label>
              <input
                {...register("playerEmail")}
                type="email"
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  errors.playerEmail ? "border-error-500" : "border-neutral-300"
                )}
                placeholder="vaš@email.com"
              />
              {errors.playerEmail && (
                <p className="text-sm text-error-600 mt-1">
                  {errors.playerEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Phone className="w-4 h-4 inline mr-2" />
                Broj telefona *
              </label>
              <input
                {...register("playerPhone")}
                type="tel"
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  errors.playerPhone ? "border-error-500" : "border-neutral-300"
                )}
                placeholder="+381 64 123-4567"
              />
              {errors.playerPhone && (
                <p className="text-sm text-error-600 mt-1">
                  {errors.playerPhone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Dodatne napomene (opciono)
              </label>
              <textarea
                {...register("specialRequests")}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Opišite vaše ciljeve, područja za poboljšanje ili bilo kakve specijalne zahteve..."
              />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Način plaćanja
          </h2>

          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value as "card")}
                className="w-4 h-4 mt-1 text-primary-600 border-neutral-300 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-neutral-600" />
                  <span className="font-medium text-neutral-900">
                    Kartično plaćanje
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Sigurno online plaćanje karticom
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value as "cash")}
                className="w-4 h-4 mt-1 text-primary-600 border-neutral-300 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-neutral-900">
                    Plaćanje na licu mesta
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Platite treneru gotovinom ili karticom kada dođete
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Cancellation policy */}
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
          <h3 className="font-semibold text-warning-800 mb-2">
            Politika otkazivanja
          </h3>
          <p className="text-sm text-warning-700">
            {trainer.cancellationPolicy}
          </p>
        </div>

        {/* Terms and conditions */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              {...register("agreeToTerms")}
              type="checkbox"
              className={cn(
                "w-4 h-4 mt-1 text-primary-600 border-neutral-300 rounded focus:ring-primary-500",
                errors.agreeToTerms && "border-error-500"
              )}
            />
            <div className="flex-1">
              <span className="text-sm text-neutral-700">
                Slažem se sa{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  uslovima korišćenja
                </a>{" "}
                i{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  politikom privatnosti
                </a>
              </span>
              {errors.agreeToTerms && (
                <p className="text-sm text-error-600 mt-1">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>
          </label>
        </div>

        {/* Error display */}
        {bookingError && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-error-600" />
              <span className="text-error-700 font-medium">
                Greška pri rezervaciji
              </span>
            </div>
            <p className="text-error-600 mt-1">{bookingError}</p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={!isValid || bookingLoading}
          loading={bookingLoading}
          className="w-full"
          size="lg"
        >
          {bookingLoading
            ? "Rezervišem..."
            : `Potvrdi rezervaciju - ${formatPrice(totalPrice)}`}
        </Button>
      </form>
    </div>
  );
}
