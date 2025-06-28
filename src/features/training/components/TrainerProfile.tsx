import React, { useState, useCallback } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Award,
  Clock,
  MessageCircle,
  Calendar,
  Users,
  Target,
  Globe,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import {
  useTrainingStore,
  Trainer,
  SessionType,
} from "../stores/trainingStore";
import { cn } from "../../../shared/utils/cn";

interface TrainerProfileProps {
  trainer: Trainer;
  onBack: () => void;
  onBookSession: () => void;
}

interface SessionTypeCardProps {
  type: { type: SessionType; label: string; description: string };
  trainer: Trainer;
  isSelected: boolean;
  onSelect: (type: SessionType) => void;
}

function SessionTypeCard({
  type,
  trainer,
  isSelected,
  onSelect,
}: SessionTypeCardProps): JSX.Element {
  const handleSelect = useCallback(() => {
    onSelect(type.type);
  }, [type.type, onSelect]);

  const getSessionIcon = (sessionType: SessionType) => {
    switch (sessionType) {
      case "individual":
        return <Users className="w-5 h-5" />;
      case "group":
        return <Users className="w-5 h-5" />;
      case "assessment":
        return <Target className="w-5 h-5" />;
      case "match-play":
        return <Award className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getSessionPrice = (sessionType: SessionType): number => {
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

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  return (
    <button
      onClick={handleSelect}
      className={cn(
        "w-full p-4 rounded-lg border-2 text-left transition-all",
        isSelected
          ? "border-primary-500 bg-primary-50"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              isSelected ? "bg-primary-100" : "bg-neutral-100"
            )}
          >
            {getSessionIcon(type.type)}
          </div>
          <div>
            <h3
              className={cn(
                "font-semibold mb-1",
                isSelected ? "text-primary-900" : "text-neutral-900"
              )}
            >
              {type.label}
            </h3>
            <p
              className={cn(
                "text-sm",
                isSelected ? "text-primary-700" : "text-neutral-600"
              )}
            >
              {type.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "font-bold",
              isSelected ? "text-primary-900" : "text-neutral-900"
            )}
          >
            {formatPrice(getSessionPrice(type.type))}
          </div>
          <div
            className={cn(
              "text-sm",
              isSelected ? "text-primary-600" : "text-neutral-500"
            )}
          >
            po satu
          </div>
        </div>
      </div>
    </button>
  );
}

interface ReviewCardProps {
  review: any;
}

function ReviewCard({ review }: ReviewCardProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-neutral-50 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <img
          src={review.playerAvatar}
          alt={review.playerName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-neutral-900">
                {review.playerName}
              </div>
              <div className="text-sm text-neutral-600">
                {formatDate(review.date)}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < review.rating
                      ? "text-warning-500 fill-current"
                      : "text-neutral-300"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-neutral-700">{review.comment}</p>
          {review.verified && (
            <div className="flex items-center space-x-1 mt-2">
              <Shield className="w-4 h-4 text-success-600" />
              <span className="text-xs text-success-600">
                Verifikovan igrač
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TrainerProfile({
  trainer,
  onBack,
  onBookSession,
}: TrainerProfileProps): JSX.Element {
  const { sessionTypes, setSessionType, sessionType } = useTrainingStore();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleSessionTypeSelect = useCallback(
    (type: SessionType) => {
      setSessionType(type);
    },
    [setSessionType]
  );

  const handleBookSession = useCallback(() => {
    onBookSession();
  }, [onBookSession]);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString("sr-RS")} RSD`;
  };

  const getExperienceText = (years: number): string => {
    if (years === 1) return "1 godina";
    if (years < 5) return `${years} godine`;
    return `${years} godina`;
  };

  const getAvailabilityText = (): string => {
    const availableDays = Object.entries(trainer.availability)
      .filter(([_, availability]) => availability.available)
      .map(([day, _]) => {
        const dayNames: { [key: string]: string } = {
          monday: "Pon",
          tuesday: "Uto",
          wednesday: "Sre",
          thursday: "Čet",
          friday: "Pet",
          saturday: "Sub",
          sunday: "Ned",
        };
        return dayNames[day];
      });

    return availableDays.join(", ");
  };

  const reviewsToShow = showAllReviews
    ? trainer.reviews
    : trainer.reviews.slice(0, 2);

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
          <h1 className="text-xl font-semibold text-neutral-900">
            Profil trenera
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Trainer header */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-start space-x-4">
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                    {trainer.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-warning-500 fill-current" />
                      <span className="font-medium">{trainer.rating}</span>
                      <span>({trainer.reviewCount} ocena)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{getExperienceText(trainer.experience)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{trainer.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatPrice(trainer.hourlyRate)}
                  </div>
                  <div className="text-sm text-neutral-600">po satu</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-neutral-700 mb-4">{trainer.bio}</p>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600">
                    {trainer.responseTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600">
                    Dostupan: {getAvailabilityText()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Specialnosti
          </h3>
          <div className="flex flex-wrap gap-2">
            {trainer.specialties.map((specialty, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications and Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Sertifikati
            </h3>
            <div className="space-y-2">
              {trainer.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-success-600" />
                  <span className="text-sm text-neutral-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Jezici
            </h3>
            <div className="space-y-2">
              {trainer.languages.map((language, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-neutral-700">{language}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session types */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Tipovi treninga
          </h3>
          <div className="space-y-3">
            {sessionTypes.map((type) => (
              <SessionTypeCard
                key={type.type}
                type={type}
                trainer={trainer}
                isSelected={sessionType === type.type}
                onSelect={handleSessionTypeSelect}
              />
            ))}
          </div>
        </div>

        {/* Working hours */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Radno vreme
          </h3>
          <div className="space-y-2">
            {Object.entries(trainer.availability).map(([day, availability]) => {
              const dayNames: { [key: string]: string } = {
                monday: "Ponedeljak",
                tuesday: "Utorak",
                wednesday: "Sreda",
                thursday: "Četvrtak",
                friday: "Petak",
                saturday: "Subota",
                sunday: "Nedelja",
              };

              return (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-700">
                    {dayNames[day]}
                  </span>
                  {availability.available ? (
                    <span className="text-sm text-neutral-600">
                      {availability.start} - {availability.end}
                    </span>
                  ) : (
                    <span className="text-sm text-neutral-400">Zatvoreno</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cancellation policy */}
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-warning-800 mb-2">
            Politika otkazivanja
          </h3>
          <p className="text-sm text-warning-700">
            {trainer.cancellationPolicy}
          </p>
        </div>

        {/* Reviews */}
        {trainer.reviews.length > 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Ocene igrača ({trainer.reviewCount})
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <span className="font-bold text-lg">{trainer.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {reviewsToShow.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {trainer.reviews.length > 2 && (
              <Button
                variant="ghost"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full mt-4"
              >
                {showAllReviews
                  ? "Prikaži manje"
                  : `Prikaži sve (${trainer.reviews.length})`}
                <ChevronRight
                  className={cn(
                    "w-4 h-4 ml-2 transition-transform",
                    showAllReviews && "rotate-90"
                  )}
                />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-white border-t border-neutral-200 p-6">
        <div className="max-w-md mx-auto">
          <Button onClick={handleBookSession} className="w-full" size="lg">
            Rezerviši trening - {formatPrice(trainer.hourlyRate)}
          </Button>
          <p className="text-center text-sm text-neutral-600 mt-2">
            {trainer.responseTime}
          </p>
        </div>
      </div>
    </div>
  );
}
