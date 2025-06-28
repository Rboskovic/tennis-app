import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Mail,
  Printer,
} from "lucide-react";
import { ClubBrowser } from "../../features/court-booking/components/ClubBrowser";
import { CourtSelection } from "../../features/court-booking/components/CourtSelection";
import { DateTimeBooking } from "../../features/court-booking/components/DateTimeBooking";
import { BookingConfirmation } from "../../features/court-booking/components/BookingConfirmation";
import { Button } from "../../shared/components/ui/Button";
import {
  useCourtStore,
  Club,
  Court,
} from "../../features/court-booking/stores/courtStore";

type BookingFlowStep =
  | "clubs"
  | "courts"
  | "datetime"
  | "confirmation"
  | "success";

/**
 * Booking Success Screen Component
 *
 * Shows confirmation after successful court booking with all details
 * and actions for the user to take next.
 */
function BookingSuccessScreen({
  onGoHome,
}: {
  onGoHome: () => void;
}): JSX.Element {
  const { currentBooking, selectedClub, selectedCourt, resetBookingFlow } =
    useCourtStore();

  // If no booking data, redirect back
  if (!currentBooking || !selectedClub || !selectedCourt) {
    return (
      <div className="min-h-full bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Nema podataka o rezervaciji</p>
          <Button onClick={onGoHome}>Vrati se na početnu</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  const handleNewBooking = () => {
    resetBookingFlow();
    window.location.reload(); // Force reload to reset all state
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-success-600 to-success-700 text-white px-6 py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Rezervacija uspešna!</h1>
          <p className="text-success-100">
            Vaš teren je rezervisan. Potvrda je poslata na email.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Booking confirmation card */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                Potvrda rezervacije
              </h2>
              <span className="text-sm text-neutral-600">
                #{currentBooking.id.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Court and club info */}
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={selectedCourt.image}
                alt={selectedCourt.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                  {selectedCourt.name}
                </h3>
                <p className="text-neutral-600 mb-2">{selectedClub.name}</p>
                <p className="text-sm text-neutral-500">
                  {selectedClub.address}
                </p>

                {/* Court features */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                    {selectedCourt.surface === "clay"
                      ? "Šljaka"
                      : selectedCourt.surface === "hard"
                      ? "Tvrdo"
                      : selectedCourt.surface === "grass"
                      ? "Trava"
                      : "Zatvoreno"}
                  </span>
                  {selectedCourt.lighting && (
                    <span className="text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded-full">
                      Rasveta
                    </span>
                  )}
                  {selectedCourt.covered && (
                    <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                      Pokriveno
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Booking details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Datum</div>
                    <div className="font-semibold text-neutral-900">
                      {formatDate(currentBooking.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Vreme</div>
                    <div className="font-semibold text-neutral-900">
                      {currentBooking.startTime} - {currentBooking.endTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Trajanje</div>
                    <div className="font-semibold text-neutral-900">
                      {currentBooking.duration}{" "}
                      {currentBooking.duration === 1 ? "sat" : "sata"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                    <span className="text-warning-600 font-bold">₽</span>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Ukupna cena</div>
                    <div className="font-bold text-xl text-primary-600">
                      {formatPrice(currentBooking.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player info */}
            <div className="border-t border-neutral-200 pt-6 mt-6">
              <h4 className="font-semibold text-neutral-900 mb-3">
                Podaci o igraču
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-neutral-600">Ime:</span>
                  <span className="ml-2 font-medium">
                    {currentBooking.playerName}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Email:</span>
                  <span className="ml-2 font-medium">
                    {currentBooking.playerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Telefon:</span>
                  <span className="ml-2 font-medium">
                    {currentBooking.playerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Special requests */}
            {currentBooking.specialRequests && (
              <div className="border-t border-neutral-200 pt-6 mt-6">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Posebni zahtevi
                </h4>
                <p className="text-sm text-neutral-700 bg-neutral-50 rounded-lg p-3">
                  {currentBooking.specialRequests}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Club contact info */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">
            Kontakt informacije kluba
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-neutral-400" />
              <div>
                <div className="text-sm text-neutral-600">Telefon</div>
                <a
                  href={`tel:${selectedClub.phone}`}
                  className="font-medium text-primary-600 hover:underline"
                >
                  {selectedClub.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-neutral-400" />
              <div>
                <div className="text-sm text-neutral-600">Email</div>
                <a
                  href={`mailto:${selectedClub.email}`}
                  className="font-medium text-primary-600 hover:underline"
                >
                  {selectedClub.email}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-neutral-400" />
              <div>
                <div className="text-sm text-neutral-600">Adresa</div>
                <div className="font-medium text-neutral-900">
                  {selectedClub.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important notes */}
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-6">
          <h3 className="font-semibold text-warning-800 mb-3">
            Važne napomene
          </h3>
          <ul className="space-y-2 text-sm text-warning-700">
            <li>
              • Molimo budite na terenu 10 minuta pre rezervisanog vremena
            </li>
            <li>
              • U slučaju kašnjenja od više od 15 minuta, rezervacija se
              poništava
            </li>
            <li>• Otkazivanje je moguće najkasnije 2 sata pre rezervacije</li>
            <li>• Ponesete ličnu kartu za potvrdu identiteta</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button onClick={onGoHome} className="w-full" size="lg">
            Vrati se na početnu
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={handlePrintReceipt}
              className="flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Odštampaj</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleNewBooking}
              className="flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Nova rezervacija</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Courts Page Component
 *
 * Orchestrates the complete court booking flow with proper state management
 * and navigation between different steps of the booking process.
 */
export default function CourtsPage(): JSX.Element {
  const navigate = useNavigate();
  const { selectedClub, selectedCourt, currentBooking, resetBookingFlow } =
    useCourtStore();

  const [currentStep, setCurrentStep] = useState<BookingFlowStep>("clubs");

  // Reset booking flow when component mounts
  useEffect(() => {
    // Only reset if we're not coming back from a completed booking
    if (!currentBooking) {
      resetBookingFlow();
      setCurrentStep("clubs");
    }
  }, [resetBookingFlow, currentBooking]);

  // Navigate to success screen when booking is completed
  useEffect(() => {
    if (currentBooking && currentStep !== "success") {
      setCurrentStep("success");
    }
  }, [currentBooking, currentStep]);

  // Handle club selection from browser
  const handleClubSelect = useCallback((club: Club) => {
    setCurrentStep("courts");
  }, []);

  // Handle court selection
  const handleCourtSelect = useCallback((court: Court) => {
    setCurrentStep("datetime");
  }, []);

  // Handle date/time selection completion
  const handleDateTimeNext = useCallback(() => {
    setCurrentStep("confirmation");
  }, []);

  // Handle navigation back through the flow
  const handleBack = useCallback(() => {
    switch (currentStep) {
      case "courts":
        setCurrentStep("clubs");
        break;
      case "datetime":
        setCurrentStep("courts");
        break;
      case "confirmation":
        setCurrentStep("datetime");
        break;
      case "success":
        // Don't allow back from success screen
        break;
      default:
        setCurrentStep("clubs");
    }
  }, [currentStep]);

  // Handle booking confirmation success
  const handleBookingSuccess = useCallback(() => {
    setCurrentStep("success");
  }, []);

  // Handle going home from success screen
  const handleGoHome = useCallback(() => {
    resetBookingFlow();
    navigate("/");
  }, [resetBookingFlow, navigate]);

  // Render the current step of the booking flow
  const renderCurrentStep = (): JSX.Element => {
    switch (currentStep) {
      case "clubs":
        return <ClubBrowser onSelectClub={handleClubSelect} />;

      case "courts":
        if (!selectedClub) {
          // Fallback if no club selected
          setCurrentStep("clubs");
          return (
            <div className="min-h-full bg-neutral-50 flex items-center justify-center">
              <span>Loading...</span>
            </div>
          );
        }
        return (
          <CourtSelection
            club={selectedClub}
            onBack={handleBack}
            onSelectCourt={handleCourtSelect}
          />
        );

      case "datetime":
        if (!selectedClub || !selectedCourt) {
          // Fallback if missing data
          setCurrentStep("clubs");
          return (
            <div className="min-h-full bg-neutral-50 flex items-center justify-center">
              <span>Loading...</span>
            </div>
          );
        }
        return (
          <DateTimeBooking
            club={selectedClub}
            court={selectedCourt}
            onBack={handleBack}
            onContinue={handleDateTimeNext}
          />
        );

      case "confirmation":
        if (!selectedClub || !selectedCourt) {
          // Fallback if missing data
          setCurrentStep("clubs");
          return (
            <div className="min-h-full bg-neutral-50 flex items-center justify-center">
              <span>Loading...</span>
            </div>
          );
        }
        return (
          <BookingConfirmation
            club={selectedClub}
            court={selectedCourt}
            onBack={handleBack}
            onSuccess={handleBookingSuccess}
          />
        );

      case "success":
        return <BookingSuccessScreen onGoHome={handleGoHome} />;

      default:
        return <ClubBrowser onSelectClub={handleClubSelect} />;
    }
  };

  return renderCurrentStep();
}
