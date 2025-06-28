import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  Dumbbell,
  Trophy,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Calendar,
  Award,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "../../shared/components/ui/Button";
import { cn } from "../../shared/utils/cn";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  primary?: boolean;
  gradient: string;
  iconColor: string;
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
  primary = false,
  gradient,
  iconColor,
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden w-full p-6 rounded-2xl text-left transition-all duration-300",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "shadow-lg hover:shadow-2xl",
        "border border-white/20",
        primary
          ? "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700"
          : `bg-gradient-to-br ${gradient}`
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] opacity-60" />

      {/* Floating Orbs */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg" />

      <div className="relative flex items-start space-x-4">
        <div
          className={cn(
            "flex-shrink-0 p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            "bg-white/20 backdrop-blur-sm",
            "shadow-lg group-hover:shadow-xl"
          )}
        >
          <div className={cn("w-6 h-6", iconColor)}>{icon}</div>
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-bold text-lg mb-2 transition-all duration-300",
              primary ? "text-white" : "text-white"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm leading-relaxed transition-all duration-300",
              primary ? "text-primary-100" : "text-white/80"
            )}
          >
            {description}
          </p>

          {/* Action Indicator */}
          <div className="flex items-center mt-3 space-x-2">
            <span className="text-xs font-medium text-white/90">
              {primary ? "Počni odmah" : "Pogledaj sve"}
            </span>
            <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </button>
  );
}

function StatCard({
  icon,
  value,
  label,
  trend,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-primary-100 rounded-lg">
          <div className="w-4 h-4 text-primary-600">{icon}</div>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center space-x-1 text-xs font-medium",
              trend.positive ? "text-success-600" : "text-error-600"
            )}
          >
            <TrendingUp
              className={cn(
                "w-3 h-3",
                trend.positive ? "rotate-0" : "rotate-180"
              )}
            />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-neutral-900 mb-1">{value}</div>
      <div className="text-sm text-neutral-600">{label}</div>
    </div>
  );
}

function UpcomingMatchCard({ match }: { match: any }) {
  return (
    <div className="relative bg-gradient-to-br from-white via-white to-primary-50/50 rounded-2xl p-6 border border-primary-200/50 shadow-xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.1),transparent)]" />

      {/* Content */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Clock className="w-4 h-4 text-primary-600" />
            </div>
            <span className="text-sm font-semibold text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
              Sledeći meč
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-600 hover:bg-primary-100"
          >
            <Play className="w-4 h-4 mr-1" />
            Pripremi se
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 mb-1">
                vs {match.opponent}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{match.court}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center mb-2">
                <span className="font-bold text-neutral-700">VS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentActivityCard({ activity }: { activity: any }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              activity.type === "win" ? "bg-success-100" : "bg-primary-100"
            )}
          >
            <div
              className={cn(
                "w-5 h-5",
                activity.type === "win"
                  ? "text-success-600"
                  : "text-primary-600"
              )}
            >
              {activity.type === "win" ? <Star /> : <Dumbbell />}
            </div>
          </div>
          <div>
            <div className="font-medium text-neutral-900">{activity.title}</div>
            <div className="text-sm text-neutral-600">{activity.subtitle}</div>
          </div>
        </div>
        {activity.points && (
          <div
            className={cn(
              "font-bold text-lg",
              activity.type === "win" ? "text-success-600" : "text-primary-600"
            )}
          >
            +{activity.points}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Premium Home Page Component
 *
 * Redesigned with state-of-the-art mobile app aesthetics:
 * - Rich hero section with tennis court imagery
 * - Premium quick action cards with gradients and animations
 * - Sophisticated visual hierarchy and typography
 * - Tennis-themed design elements and micro-interactions
 */
export default function HomePage(): JSX.Element {
  const navigate = useNavigate();

  // Mock user data - in real app this would come from API
  const user = {
    name: "Marko Petrović",
    credits: 12,
    level: "Napredni",
    weeklyMatches: 3,
    winRate: 68,
    upcomingMatch: {
      opponent: "Ana Jovanović",
      time: "Danas u 18:00",
      court: "Teren 2, Baseline Club",
    },
  };

  const quickActions = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Pronađi Meč",
      description: "Brzo pronađi protivnika za sledeću partiju i zakaži meč",
      onClick: () => navigate("/match"),
      primary: true,
      gradient: "from-primary-500 via-primary-600 to-primary-700",
      iconColor: "text-white",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Rezerviši Teren",
      description: "Rezerviši teren u omiljenom klubu sa najboljim cenama",
      onClick: () => navigate("/courts"),
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      iconColor: "text-white",
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Zakaži Trening",
      description: "Nađi trenera i zakaži sesiju za poboljšanje igre",
      onClick: () => navigate("/training"),
      gradient: "from-orange-500 via-orange-600 to-red-600",
      iconColor: "text-white",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Turniri i Lige",
      description: "Prijaviti se na nadolazeće takmičenja i rang liste",
      onClick: () => navigate("/tournaments"),
      gradient: "from-purple-500 via-purple-600 to-indigo-600",
      iconColor: "text-white",
    },
  ];

  const recentActivities = [
    {
      type: "win",
      title: "Pobeda protiv Mila Nikolića",
      subtitle: "6-4, 6-2 • Pre 2 dana",
      points: "15",
    },
    {
      type: "training",
      title: "Trening sa trenerom Aleksom",
      subtitle: "Fokus na bekhendu • Pre 3 dana",
      points: null,
    },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with tennis court pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.03) 10px,
            rgba(255, 255, 255, 0.03) 20px
          )`,
          }}
        />

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary-300/20 rounded-full blur-xl" />

        <div className="relative px-6 pt-8 pb-12">
          {/* Welcome Card */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 mb-8 shadow-2xl border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                    Dobrodošli, {user.name.split(" ")[0]}!
                  </h1>
                  <p className="text-neutral-600 font-medium">
                    {user.level} igrač • {user.weeklyMatches} meča ove nedelje
                  </p>
                </div>
              </div>

              {/* Credits Display */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-warning-400 to-warning-600 text-white text-2xl font-bold w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                  {user.credits}
                </div>
                <div className="text-xs font-medium text-neutral-600">
                  kredita
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                icon={<Trophy />}
                value={`${user.winRate}%`}
                label="Pobede"
                trend={{ value: "+5%", positive: true }}
              />
              <StatCard
                icon={<Zap />}
                value="1,420"
                label="Rating"
                trend={{ value: "+12", positive: true }}
              />
              <StatCard icon={<Calendar />} value="23" label="Mečevi" />
            </div>
          </div>

          {/* Upcoming Match */}
          {user.upcomingMatch && (
            <UpcomingMatchCard match={user.upcomingMatch} />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Brze akcije
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
        </div>

        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={action.onClick}
              primary={action.primary}
              gradient={action.gradient}
              iconColor={action.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Nedavna aktivnost
          </h2>
          <Button variant="ghost" size="sm" className="text-primary-600">
            Pogledaj sve
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <RecentActivityCard key={index} activity={activity} />
          ))}
        </div>
      </div>

      {/* Motivational Section */}
      <div className="mx-6 mb-8 bg-gradient-to-br from-success-500 via-success-600 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.2),transparent)]" />
        <div className="relative">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Danas je dobar dan za tenis!</span>
          </div>
          <p className="text-success-100 text-sm leading-relaxed mb-4">
            Imate {user.credits} kredita dostupno. Zakažite meč ili trening i
            nastavite sa napredovanjem!
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/match")}
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            Pronađi protivnika
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
