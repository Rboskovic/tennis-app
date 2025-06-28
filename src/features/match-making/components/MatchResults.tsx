import React, { useCallback } from "react";
import { Clock, MapPin, Star, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { LoadingSpinner } from "../../../shared/components/ui/LoadingSpinner";
import { useMatchStore, Player } from "../stores/matchStore";
import { cn } from "../../../shared/utils/cn";

interface MatchResultsProps {
  onSelectPlayer: (player: Player) => void;
  onBack: () => void;
}

interface PlayerCardProps {
  player: Player;
  onSelect: (player: Player) => void;
}

function PlayerCard({ player, onSelect }: PlayerCardProps): JSX.Element {
  const handleSelect = useCallback(() => {
    onSelect(player);
  }, [player, onSelect]);

  const getRatingColor = (rating: number): string => {
    if (rating >= 1800) return "text-purple-600";
    if (rating >= 1600) return "text-primary-600";
    if (rating >= 1400) return "text-success-600";
    if (rating >= 1200) return "text-warning-600";
    return "text-neutral-600";
  };

  const getSkillLevelLabel = (level: string): string => {
    const labels = {
      beginner: "Početnik",
      intermediate: "Srednji",
      advanced: "Napredni",
      expert: "Ekspert",
      pro: "Profesionalac",
    };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {/* Online status indicator */}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
              player.isOnline ? "bg-success-500" : "bg-neutral-400"
            )}
          >
            {player.isOnline ? (
              <Wifi className="w-3 h-3 text-white" />
            ) : (
              <WifiOff className="w-3 h-3 text-white" />
            )}
          </div>
        </div>

        {/* Player info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-neutral-900 truncate">
              {player.name}
            </h3>
            <div
              className={cn("text-sm font-bold", getRatingColor(player.rating))}
            >
              {player.rating}
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-2">
            <span className="text-sm text-neutral-600">
              {getSkillLevelLabel(player.skillLevel)}
            </span>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              <span className="text-sm text-neutral-600">
                {player.location}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-warning-500" />
              <span className="text-sm text-neutral-600">
                {Math.round(player.winRate * 100)}% pobeda
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-primary-500" />
              <span className="text-sm text-neutral-600">
                {player.matchesPlayed} mečeva
              </span>
            </div>
          </div>

          {/* Last active */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span className="text-xs text-neutral-500">
                {player.isOnline
                  ? "Aktivan sada"
                  : `Aktivan ${player.lastActive}`}
              </span>
            </div>

            <Button
              onClick={handleSelect}
              size="sm"
              variant={player.isOnline ? "primary" : "secondary"}
            >
              {player.isOnline ? "Pozovi na meč" : "Pošalji poruku"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState(): JSX.Element {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        Nema dostupnih protivnika
      </h3>
      <p className="text-neutral-600 mb-6">
        Pokušajte da promenite svoje preference ili dodajte više klubova.
      </p>
      <Button variant="secondary" onClick={() => window.history.back()}>
        Promeni preference
      </Button>
    </div>
  );
}

export function MatchResults({
  onSelectPlayer,
  onBack,
}: MatchResultsProps): JSX.Element {
  const { availableMatches, searchLoading, searchError, preferences } =
    useMatchStore();

  const handleSelectPlayer = useCallback(
    (player: Player) => {
      onSelectPlayer(player);
    },
    [onSelectPlayer]
  );

  if (searchLoading) {
    return (
      <div className="min-h-full bg-neutral-50">
        <div className="bg-white px-6 py-4 border-b border-neutral-200">
          <h1 className="text-xl font-semibold text-neutral-900">
            Pretraga protivnika
          </h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Tražimo odgovarajuće protivnike..." />
        </div>
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="min-h-full bg-neutral-50">
        <div className="bg-white px-6 py-4 border-b border-neutral-200">
          <h1 className="text-xl font-semibold text-neutral-900">Greška</h1>
        </div>
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-error-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Greška prilikom pretrage
          </h3>
          <p className="text-neutral-600 mb-6">{searchError}</p>
          <div className="space-x-3">
            <Button variant="secondary" onClick={onBack}>
              Nazad
            </Button>
            <Button onClick={() => window.location.reload()}>
              Pokušaj ponovo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-900">
          Dostupni protivnici
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          {availableMatches.length === 0
            ? "Nema rezultata"
            : `${availableMatches.length} ${
                availableMatches.length === 1
                  ? "igrač pronađen"
                  : availableMatches.length < 5
                  ? "igrača pronađeno"
                  : "igrača pronađeno"
              }`}
        </p>
      </div>

      {/* Filters summary */}
      {preferences && (
        <div className="bg-primary-50 px-6 py-3 border-b border-primary-100">
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-medium text-primary-800">Filteri:</span>
            <span className="text-primary-700">
              {preferences.clubs.length}{" "}
              {preferences.clubs.length === 1 ? "klub" : "klubova"}
            </span>
            <span className="text-primary-700">•</span>
            <span className="text-primary-700">
              {preferences.skillLevels.length}{" "}
              {preferences.skillLevels.length === 1 ? "nivo" : "nivoa"}
            </span>
            <span className="text-primary-700">•</span>
            <span className="text-primary-700">
              {preferences.timeSlots.length}{" "}
              {preferences.timeSlots.length === 1 ? "termin" : "termina"}
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-6">
        {availableMatches.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {/* Online players first */}
            {availableMatches.filter((player) => player.isOnline).length >
              0 && (
              <div>
                <h2 className="text-base font-medium text-neutral-900 mb-3">
                  Aktivni sada (
                  {availableMatches.filter((p) => p.isOnline).length})
                </h2>
                <div className="space-y-3">
                  {availableMatches
                    .filter((player) => player.isOnline)
                    .map((player) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        onSelect={handleSelectPlayer}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Offline players */}
            {availableMatches.filter((player) => !player.isOnline).length >
              0 && (
              <div>
                <h2 className="text-base font-medium text-neutral-900 mb-3">
                  Nedavno aktivni (
                  {availableMatches.filter((p) => !p.isOnline).length})
                </h2>
                <div className="space-y-3">
                  {availableMatches
                    .filter((player) => !player.isOnline)
                    .map((player) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        onSelect={handleSelectPlayer}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="bg-white border-t border-neutral-200 p-6">
        <Button variant="secondary" onClick={onBack} className="w-full">
          Promeni preference
        </Button>
      </div>
    </div>
  );
}
