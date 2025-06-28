import React, { useState, useCallback } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Wifi,
  Car,
  Coffee,
  Waves,
  Filter,
  X,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { useCourtStore, Club, BookingFilters } from "../stores/courtStore";
import { cn } from "../../../shared/utils/cn";

interface ClubBrowserProps {
  onSelectClub: (club: Club) => void;
}

interface ClubCardProps {
  club: Club;
  onSelect: (club: Club) => void;
}

function ClubCard({ club, onSelect }: ClubCardProps): JSX.Element {
  const handleSelect = useCallback(() => {
    onSelect(club);
  }, [club, onSelect]);

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("parking")) return <Car className="w-4 h-4" />;
    if (amenityLower.includes("kafić") || amenityLower.includes("restoran"))
      return <Coffee className="w-4 h-4" />;
    if (amenityLower.includes("wi-fi")) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes("sauna") || amenityLower.includes("spa"))
      return <Waves className="w-4 h-4" />;
    return null;
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Club image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={club.images[0]}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-warning-500 fill-current" />
            <span className="text-sm font-medium text-neutral-900">
              {club.rating}
            </span>
            <span className="text-xs text-neutral-600">
              ({club.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Club info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {club.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-neutral-600">
              <MapPin className="w-4 h-4" />
              <span>{club.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600">Od</div>
            <div className="font-bold text-primary-600">
              {formatPrice(club.priceRange.min)}
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {club.description}
        </p>

        {/* Courts info */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-neutral-600">
            {club.courts.length} {club.courts.length === 1 ? "teren" : "terena"}
          </div>
          <div className="flex space-x-1">
            {[...new Set(club.courts.map((court) => court.surface))].map(
              (surface) => (
                <span
                  key={surface}
                  className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full"
                >
                  {surface === "clay"
                    ? "Šljaka"
                    : surface === "hard"
                    ? "Tvrdo"
                    : surface === "grass"
                    ? "Trava"
                    : "Zatvoreno"}
                </span>
              )
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-2 mb-4">
          {club.amenities.slice(0, 4).map((amenity, index) => {
            const icon = getAmenityIcon(amenity);
            return icon ? (
              <div
                key={index}
                className="flex items-center space-x-1 text-neutral-500"
                title={amenity}
              >
                {icon}
              </div>
            ) : null;
          })}
          {club.amenities.length > 4 && (
            <span className="text-xs text-neutral-500">
              +{club.amenities.length - 4} više
            </span>
          )}
        </div>

        {/* Opening hours */}
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-600">
            Danas: {club.openingHours.monday.open} -{" "}
            {club.openingHours.monday.close}
          </span>
        </div>

        {/* Action button */}
        <Button onClick={handleSelect} className="w-full" variant="primary">
          Pogledaj terene
        </Button>
      </div>
    </div>
  );
}

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: BookingFilters;
  onFiltersChange: (filters: Partial<BookingFilters>) => void;
}

function FiltersModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FiltersModalProps): JSX.Element {
  const [localFilters, setLocalFilters] = useState<BookingFilters>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClose();
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-black/25 transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md transform rounded-xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Filteri</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Surface filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Tip terena
              </h4>
              <div className="space-y-2">
                {[
                  { value: "clay", label: "Šljaka" },
                  { value: "hard", label: "Tvrda podloga" },
                  { value: "grass", label: "Trava" },
                  { value: "indoor", label: "Zatvoreno" },
                ].map((surface) => (
                  <label
                    key={surface.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name="surface"
                      value={surface.value}
                      checked={localFilters.surface === surface.value}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          surface: e.target.value as any,
                        })
                      }
                      className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      {surface.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Features filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Karakteristike
              </h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localFilters.lighting || false}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        lighting: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">Rasveta</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localFilters.covered || false}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        covered: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">Pokriveno</span>
                </label>
              </div>
            </div>

            {/* Price range filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Cena po satu
              </h4>
              <div className="space-y-2">
                {[
                  { min: 0, max: 2500, label: "Do 2.500 RSD" },
                  { min: 2500, max: 4000, label: "2.500 - 4.000 RSD" },
                  { min: 4000, max: 6000, label: "4.000 - 6.000 RSD" },
                  { min: 6000, max: 10000, label: "Preko 6.000 RSD" },
                ].map((range) => (
                  <label
                    key={`${range.min}-${range.max}`}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        localFilters.priceRange?.[0] === range.min &&
                        localFilters.priceRange?.[1] === range.max
                      }
                      onChange={() =>
                        setLocalFilters({
                          ...localFilters,
                          priceRange: [range.min, range.max],
                        })
                      }
                      className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <Button
              variant="secondary"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Obriši filtere
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              Primeni
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClubBrowser({ onSelectClub }: ClubBrowserProps): JSX.Element {
  const { filteredClubs, searchQuery, filters, setSearchQuery, setFilters } =
    useCourtStore();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  const handleSelectClub = useCallback(
    (club: Club) => {
      onSelectClub(club);
    },
    [onSelectClub]
  );

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-900 mb-4">
          Rezerviši Teren
        </h1>

        {/* Search and filters */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Pretraži klubove..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsFiltersOpen(true)}
            className="px-4 py-2 relative"
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="px-6 py-3 bg-neutral-100">
        <p className="text-sm text-neutral-600">
          {filteredClubs.length === 0
            ? "Nema rezultata"
            : `${filteredClubs.length} ${
                filteredClubs.length === 1
                  ? "klub pronađen"
                  : filteredClubs.length < 5
                  ? "kluba pronađeno"
                  : "klubova pronađeno"
              }`}
        </p>
      </div>

      {/* Club listings */}
      <div className="p-6">
        {filteredClubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Nema dostupnih klubova
            </h3>
            <p className="text-neutral-600 mb-6">
              Pokušajte da promenite filtere ili pretražite drugačije.
            </p>
            <Button variant="secondary" onClick={() => setFilters({})}>
              Obriši filtere
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredClubs.map((club) => (
              <ClubCard key={club.id} club={club} onSelect={handleSelectClub} />
            ))}
          </div>
        )}
      </div>

      {/* Filters modal */}
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
