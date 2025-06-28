import React from "react";
import { useLocation } from "react-router-dom";
import { TopNavigation } from "./TopNavigation";
import { BottomNavigation } from "./BottomNavigation";
import { cn } from "../../utils/cn";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout component
 *
 * Provides consistent layout structure with top and bottom navigation.
 * Handles responsive design and safe area insets for mobile devices.
 */
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  const location = useLocation();

  // Hide bottom navigation on certain pages
  const hideBottomNav = ["/profile/edit", "/match/preferences"].includes(
    location.pathname
  );

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-auto",
          // Add bottom padding when bottom nav is visible
          !hideBottomNav && "pb-20"
        )}
      >
        <div className="max-w-md mx-auto bg-white min-h-full shadow-sm">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}
