import React, { useState, useCallback } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Wifi,
  WifiOff,
  X,
  Award,
  MessageCircle,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import {
  useTrainingStore,
  Trainer,
  TrainingFilters,
} from "../stores/trainingStore";
import { cn } from "../../../shared/utils/cn";

interface TrainerBrowserProps {
  onSelectTrainer: (trainer: Trainer) => void;
}

interface TrainerCardProps {
  trainer: Trainer;
  onSelect: (trainer: Trainer) => void;
}

function TrainerCard({ trainer, onSelect }: TrainerCardProps): JSX.Element {
  const handleSelect = useCallback(() => {
    onSelect(trainer);
  }, [trainer, onSelect]);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  const getExperienceText = (years: number): string => {
    if (years === 1) return "1 godina";
    if (years < 5) return `${years} godine`;
    return `${years} godina`;
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start space-x-4">
        {/* Trainer avatar */}
        <div className="relative">
          <img
            src={trainer.avatar}
            alt={trainer.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {/* Online status */}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
              trainer.isOnline ? "bg-success-500" : "bg-neutral-400"
            )}
          >
            {trainer.isOnline ? (
              <Wifi className="w-3 h-3 text-white" />
            ) : (
              <WifiOff className="w-3 h-3 text-white" />
            )}
          </div>
        </div>

        {/* Trainer info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">
                {trainer.name}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning-500 fill-current" />
                  <span>{trainer.rating}</span>
                  <span>({trainer.reviewCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{getExperienceText(trainer.experience)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">
                {formatPrice(trainer.hourlyRate)}
              </div>
              <div className="text-sm text-neutral-600">po satu</div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
            {trainer.bio}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-3">
            {trainer.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full"
              >
                {specialty}
              </span>
            ))}
            {trainer.specialties.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{trainer.specialties.length - 3} više
              </span>
            )}
          </div>

          {/* Location and response time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{trainer.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{trainer.responseTime}</span>
              </div>
            </div>

            <Button
              onClick={handleSelect}
              size="sm"
              variant={trainer.isOnline ? "primary" : "secondary"}
            >
              {trainer.isOnline ? "Rezerviši" : "Pogledaj profil"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TrainingFilters;
  onFiltersChange: (filters: Partial<TrainingFilters>) => void;
}

function FiltersModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FiltersModalProps): JSX.Element {
  const { availableSpecialties, availableClubs } = useTrainingStore();
  const [localFilters, setLocalFilters] = useState<TrainingFilters>(filters);

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

  const handleSpecialtyToggle = (specialty: string) => {
    const currentSpecialties = localFilters.specialties || [];
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter((s) => s !== specialty)
      : [...currentSpecialties, specialty];

    setLocalFilters({
      ...localFilters,
      specialties: newSpecialties.length > 0 ? newSpecialties : undefined,
    });
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-black/25 transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md transform rounded-xl bg-white p-6 text-left shadow-xl transition-all max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Filteri</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Specialties filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Specialnosti
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableSpecialties.map((specialty) => (
                  <label
                    key={specialty}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      checked={
                        localFilters.specialties?.includes(specialty) || false
                      }
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      {specialty}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Cena po satu
              </h4>
              <div className="space-y-2">
                {[
                  { min: 0, max: 3000, label: "Do 3.000 RSD" },
                  { min: 3000, max: 4500, label: "3.000 - 4.500 RSD" },
                  { min: 4500, max: 6000, label: "4.500 - 6.000 RSD" },
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

            {/* Rating filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Ocena
              </h4>
              <div className="space-y-2">
                {[
                  { rating: 4.5, label: "4.5+ ⭐" },
                  { rating: 4.0, label: "4.0+ ⭐" },
                  { rating: 3.5, label: "3.5+ ⭐" },
                ].map((item) => (
                  <label
                    key={item.rating}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={localFilters.rating === item.rating}
                      onChange={() =>
                        setLocalFilters({
                          ...localFilters,
                          rating: item.rating,
                        })
                      }
                      className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Iskustvo
              </h4>
              <div className="space-y-2">
                {[
                  { experience: 5, label: "5+ godina" },
                  { experience: 8, label: "8+ godina" },
                  { experience: 10, label: "10+ godina" },
                ].map((item) => (
                  <label
                    key={item.experience}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name="experience"
                      checked={localFilters.experience === item.experience}
                      onChange={() =>
                        setLocalFilters({
                          ...localFilters,
                          experience: item.experience,
                        })
                      }
                      className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-3">
                Lokacija
              </h4>
              <div className="space-y-2">
                {[...new Set(availableClubs.map((club) => club.location))].map(
                  (location) => (
                    <label
                      key={location}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="radio"
                        name="location"
                        checked={localFilters.location === location}
                        onChange={() =>
                          setLocalFilters({
                            ...localFilters,
                            location: location,
                          })
                        }
                        className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">
                        {location}
                      </span>
                    </label>
                  )
                )}
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

function EmptyState(): JSX.Element {
  const { setFilters } = useTrainingStore();

  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Award className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        Nema dostupnih trenera
      </h3>
      <p className="text-neutral-600 mb-6">
        Pokušajte da promenite filtere ili pretražite drugačije.
      </p>
      <Button variant="secondary" onClick={() => setFilters({})}>
        Obriši filtere
      </Button>
    </div>
  );
}

export function TrainerBrowser({
  onSelectTrainer,
}: TrainerBrowserProps): JSX.Element {
  const { filteredTrainers, searchQuery, filters, setSearchQuery, setFilters } =
    useTrainingStore();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  const handleSelectTrainer = useCallback(
    (trainer: Trainer) => {
      onSelectTrainer(trainer);
    },
    [onSelectTrainer]
  );

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-900 mb-4">
          Pronađi Trenera
        </h1>

        {/* Search and filters */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Pretraži trenere ili specialnosti..."
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

      {/* Results count and sort */}
      <div className="px-6 py-3 bg-neutral-100 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            {filteredTrainers.length === 0
              ? "Nema rezultata"
              : `${filteredTrainers.length} ${
                  filteredTrainers.length === 1
                    ? "trener pronađen"
                    : filteredTrainers.length < 5
                    ? "trenera pronađeno"
                    : "trenera pronađeno"
                }`}
          </p>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-neutral-600">Sortiranje:</span>
            <select className="border border-neutral-300 rounded px-2 py-1 text-sm">
              <option>Najbolja ocena</option>
              <option>Najniža cena</option>
              <option>Najviše iskustva</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trainer listings */}
      <div className="p-6">
        {filteredTrainers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {/* Online trainers first */}
            {filteredTrainers.filter((trainer) => trainer.isOnline).length >
              0 && (
              <div>
                <h2 className="text-base font-medium text-neutral-900 mb-3">
                  Dostupni sada (
                  {filteredTrainers.filter((t) => t.isOnline).length})
                </h2>
                <div className="space-y-4">
                  {filteredTrainers
                    .filter((trainer) => trainer.isOnline)
                    .map((trainer) => (
                      <TrainerCard
                        key={trainer.id}
                        trainer={trainer}
                        onSelect={handleSelectTrainer}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Offline trainers */}
            {filteredTrainers.filter((trainer) => !trainer.isOnline).length >
              0 && (
              <div>
                <h2 className="text-base font-medium text-neutral-900 mb-3">
                  Ostali treneri (
                  {filteredTrainers.filter((t) => !t.isOnline).length})
                </h2>
                <div className="space-y-4">
                  {filteredTrainers
                    .filter((trainer) => !trainer.isOnline)
                    .map((trainer) => (
                      <TrainerCard
                        key={trainer.id}
                        trainer={trainer}
                        onSelect={handleSelectTrainer}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="bg-primary-50 border-t border-primary-100 p-6">
        <h3 className="font-medium text-primary-900 mb-2">
          Saveti za izbor trenera
        </h3>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>• Odaberite trenera prema vašem nivou igre</li>
          <li>• Pogledajte ocene i komentare drugih igrača</li>
          <li>• Proverite da li trener radi u vašem omiljenom klubu</li>
        </ul>
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
