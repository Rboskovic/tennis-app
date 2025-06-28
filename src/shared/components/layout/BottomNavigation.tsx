import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, MapPin, Trophy, Dumbbell } from "lucide-react";
import { cn } from "../../utils/cn";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

/**
 * Bottom Navigation Component
 *
 * Provides primary navigation for the main app sections.
 * Uses modern design with proper touch targets and visual feedback.
 */
export function BottomNavigation(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Početna",
      icon: <Home className="w-5 h-5" />,
      path: "/",
    },
    {
      id: "match",
      label: "Meč",
      icon: <Users className="w-5 h-5" />,
      path: "/match",
    },
    {
      id: "courts",
      label: "Tereni",
      icon: <MapPin className="w-5 h-5" />,
      path: "/courts",
    },
    {
      id: "training",
      label: "Trening",
      icon: <Dumbbell className="w-5 h-5" />,
      path: "/training",
    },
    {
      id: "tournaments",
      label: "Turniri",
      icon: <Trophy className="w-5 h-5" />,
      path: "/tournaments",
    },
  ];

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px]",
                  "transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  active
                    ? "text-primary-600"
                    : "text-neutral-500 hover:text-neutral-700"
                )}
                aria-label={item.label}
              >
                <div
                  className={cn(
                    "p-1 rounded-lg transition-colors duration-200",
                    active && "bg-primary-50"
                  )}
                >
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium mt-1 transition-colors duration-200",
                    active ? "text-primary-600" : "text-neutral-500"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
