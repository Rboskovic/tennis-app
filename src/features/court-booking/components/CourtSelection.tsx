import React, { useCallback } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Check,
  Sun,
  Moon,
  Umbrella,
  Zap,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { useCourtStore, Club, Court } from "../stores/courtStore";
import { cn } from "../../../shared/utils/cn";

interface CourtSelectionProps {
  club: Club;
  onBack: () => void;
  onSelectCourt: (court: Court) => void;
}

interface CourtCardProps {
  court: Court;
  club: Club;
  onSelect: (court: Court) => void;
  isSelected?: boolean;
}

function CourtCard({
  court,
  club,
  onSelect,
  isSelected = false,
}: CourtCardProps): JSX.Element {
  const handleSelect = useCallback(() => {
    onSelect(court);
  }, [court, onSelect]);

  const getSurfaceInfo = (surface: string) => {
    switch (surface) {
      case "clay":
        return {
          label: "Crven šljak",
          color: "bg-orange-100 text-orange-800",
          icon: "🟤",
        };
      case "hard":
        return {
          label: "Tvrda podloga",
          color: "bg-blue-100 text-blue-800",
          icon: "🔵",
        };
      case "grass":
        return {
          label: "Trava",
          color: "bg-green-100 text-green-800",
          icon: "🟢",
        };
      case "indoor":
        return {
          label: "Zatvoreno",
          color: "bg-purple-100 text-purple-800",
          icon: "🏢",
        };
      default:
        return {
          label: surface,
          color: "bg-neutral-100 text-neutral-800",
          icon: "⚪",
        };
    }
  };

  const surfaceInfo = getSurfaceInfo(court.surface);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md",
        isSelected
          ? "border-primary-500 ring-2 ring-primary-200"
          : "border-neutral-200 hover:border-neutral-300"
      )}
      onClick={handleSelect}
    >
      {/* Court image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={court.image}
          alt={court.name}
          className="w-full h-full object-cover"
        />

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Surface type badge */}
        <div
          className={cn(
            "absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium",
            surfaceInfo.color
          )}
        >
          <span className="mr-1">{surfaceInfo.icon}</span>
          {surfaceInfo.label}
        </div>
      </div>

      {/* Court info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {court.name}
            </h3>
            <div className="text-sm text-neutral-600">{club.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary-600">
              {formatPrice(court.hourlyRate)}
            </div>
            <div className="text-sm text-neutral-600">po satu</div>
          </div>
        </div>

        {/* Court features */}
        <div className="flex items-center space-x-4 mb-4">
          {court.lighting && (
            <div className="flex items-center space-x-1 text-warning-600">
              {new Date().getHours() > 18 ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="text-sm">Rasveta</span>
            </div>
          )}

          {court.covered && (
            <div className="flex items-center space-x-1 text-primary-600">
              <Umbrella className="w-4 h-4" />
              <span className="text-sm">Pokriveno</span>
            </div>
          )}

          {court.features.includes("Klima") && (
            <div className="flex items-center space-x-1 text-success-600">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Klima</span>
            </div>
          )}
        </div>

        {/* Features list */}
        {court.features.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-neutral-700 mb-2">
              Dodatne karakteristike:
            </div>
            <div className="flex flex-wrap gap-1">
              {court.features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Selection feedback */}
        {isSelected && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center space-x-2 text-primary-700">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Teren je odabran</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CourtSelection({
  club,
  onBack,
  onSelectCourt,
}: CourtSelectionProps): JSX.Element {
  const { selectedCourt, selectCourt } = useCourtStore();

  const handleCourtSelect = useCallback(
    (court: Court) => {
      selectCourt(court);
      onSelectCourt(court);
    },
    [selectCourt, onSelectCourt]
  );

  const getClubOpeningHours = () => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "lowercase",
    }) as keyof typeof club.openingHours;
    const hours = club.openingHours[today];

    if (hours.closed) {
      return "Zatvoreno danas";
    }

    return `${hours.open} - ${hours.close}`;
  };

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        {/* Navigation */}
        <div className="flex items-center px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 -ml-2 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-neutral-900">
            Odaberite teren
          </h1>
        </div>

        {/* Club info */}
        <div className="px-6 pb-4">
          <div className="flex items-start space-x-4">
            <img
              src={club.images[0]}
              alt={club.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-900 mb-1">
                {club.name}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{club.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning-500 fill-current" />
                  <span>
                    {club.rating} ({club.reviewCount})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{getClubOpeningHours()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Court selection info */}
      <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
        <div className="text-sm text-primary-800">
          <div className="font-medium mb-1">Korak 1 od 3: Odaberite teren</div>
          <div>Izaberite teren koji odgovara vašim potrebama</div>
        </div>
      </div>

      {/* Courts grid */}
      <div className="p-6">
        {club.courts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Nema dostupnih terena
            </h3>
            <p className="text-neutral-600">
              Ovaj klub trenutno nema dostupne terene za rezervaciju.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Dostupni tereni ({club.courts.length})
              </h3>

              {selectedCourt && (
                <div className="text-sm text-primary-600 font-medium">
                  Odabran: {selectedCourt.name}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {club.courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  club={club}
                  onSelect={handleCourtSelect}
                  isSelected={selectedCourt?.id === court.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue button */}
      {selectedCourt && (
        <div className="bg-white border-t border-neutral-200 p-6">
          <div className="max-w-md mx-auto">
            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-primary-800">
                <div className="font-medium">Sledeći korak:</div>
                <div>Odaberite datum i vreme</div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => onSelectCourt(selectedCourt)}
            >
              Nastavi sa {selectedCourt.name}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
