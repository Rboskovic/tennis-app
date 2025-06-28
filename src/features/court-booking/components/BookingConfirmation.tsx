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
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { useCourtStore, Club, Court } from "../stores/courtStore";
import { cn } from "../../../shared/utils/cn";

interface BookingConfirmationProps {
  club: Club;
  court: Court;
  onBack: () => void;
  onSuccess: () => void;
}

// Validation schema
const bookingSchema = z.object({
  playerName: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  playerEmail: z.string().email("Unesite validnu email adresu"),
  playerPhone: z.string().min(9, "Unesite validan broj telefona"),
  specialRequests: z.string().optional(),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "Morate prihvatiti uslove korišćenja"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingConfirmation({
  club,
  court,
  onBack,
  onSuccess,
}: BookingConfirmationProps): JSX.Element {
  const {
    selectedDate,
    selectedTimeSlot,
    duration,
    bookingLoading,
    bookingError,
    bookCourt,
    clearError,
  } = useCourtStore();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      playerName: "Marko Petrović",
      playerEmail: "marko@example.com",
      playerPhone: "+381 64 123-4567",
      specialRequests: "",
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  const watchedName = watch("playerName");
  const watchedEmail = watch("playerEmail");
  const watchedPhone = watch("playerPhone");

  const onSubmit = useCallback(
    async (data: BookingFormData) => {
      if (!selectedTimeSlot) return;

      clearError();
      await bookCourt({
        playerName: data.playerName,
        playerEmail: data.playerEmail,
        playerPhone: data.playerPhone,
        specialRequests: data.specialRequests,
      });

      // If no error, navigate to success
      if (!bookingError) {
        onSuccess();
      }
    },
    [selectedTimeSlot, clearError, bookCourt, bookingError, onSuccess]
  );

  if (!selectedDate || !selectedTimeSlot) {
    return (
      <div className="min-h-full bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">
            Podaci o rezervaciji nisu kompletni
          </p>
          <Button onClick={onBack}>Vrati se nazad</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  const totalPrice = selectedTimeSlot.price * duration;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              Finalizujte vašu rezervaciju
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
        <div className="text-sm text-primary-800">
          <div className="font-medium mb-1">
            Korak 3 od 3: Potvrda rezervacije
          </div>
          <div>Unesite vaše podatke i potvrdite rezervaciju</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Booking summary */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
            <h2 className="text-lg font-semibold text-primary-900">
              Pregled rezervacije
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={court.image}
                alt={court.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 mb-1">
                  {court.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {club.name} • {club.location}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      court.surface === "clay"
                        ? "bg-orange-100 text-orange-800"
                        : court.surface === "hard"
                        ? "bg-blue-100 text-blue-800"
                        : court.surface === "grass"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    )}
                  >
                    {court.surface === "clay"
                      ? "Šljaka"
                      : court.surface === "hard"
                      ? "Tvrdo"
                      : court.surface === "grass"
                      ? "Trava"
                      : "Zatvoreno"}
                  </span>
                  {court.lighting && (
                    <span className="text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded-full">
                      Rasveta
                    </span>
                  )}
                  {court.covered && (
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      Pokriveno
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Datum:</span>
                  <div className="font-medium">{formatDate(selectedDate)}</div>
                </div>
                <div>
                  <span className="text-neutral-600">Vreme:</span>
                  <div className="font-medium">{selectedTimeSlot.time}</div>
                </div>
                <div>
                  <span className="text-neutral-600">Trajanje:</span>
                  <div className="font-medium">
                    {duration} {duration === 1 ? "sat" : "sata"}
                  </div>
                </div>
                <div>
                  <span className="text-neutral-600">Cena po satu:</span>
                  <div className="font-medium">
                    {formatPrice(selectedTimeSlot.price)}
                  </div>
                </div>
              </div>

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

        {/* Contact information */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Kontakt informacije
          </h2>

          <div className="space-y-4">
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
                  errors.playerName ? "border-error-500" : "border-neutral-300"
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
                Posebni zahtevi (opciono)
              </label>
              <textarea
                {...register("specialRequests")}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Unesite dodatne zahteve ili napomene..."
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
                  Platite gotovinom ili karticom kada dođete
                </p>
              </div>
            </label>
          </div>
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
                  pravilima kluba
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
