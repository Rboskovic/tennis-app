import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Menu, X, User } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

/**
 * Top Navigation Component
 *
 * Provides consistent top navigation with user info, notifications,
 * and optional back button for nested routes.
 */
export function TopNavigation(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine if we should show back button
  const showBackButton = location.pathname !== "/";

  // Get page title based on current route
  const getPageTitle = (): string => {
    const path = location.pathname;

    if (path.startsWith("/match")) return "Pronađi Meč";
    if (path.startsWith("/training")) return "Trening";
    if (path.startsWith("/courts")) return "Tereni";
    if (path.startsWith("/tournaments")) return "Turniri";
    if (path.startsWith("/profile")) return "Profil";

    return "Tennis App";
  };

  const handleBackClick = (): void => {
    navigate(-1);
  };

  const handleProfileClick = (): void => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  const handleNotificationsClick = (): void => {
    // TODO: Open notifications modal
    console.log("Open notifications");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Back button or menu */}
            <div className="flex items-center">
              {showBackButton ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  className="p-2 -ml-2"
                  aria-label="Go back"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 -ml-2"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Center - Page title */}
            <h1 className="text-lg font-semibold text-neutral-900 truncate">
              {getPageTitle()}
            </h1>

            {/* Right side - Notifications and profile */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotificationsClick}
                className="p-2 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="p-2"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
              >
                Profil
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate("/profile/settings");
                  setIsMenuOpen(false);
                }}
              >
                Podešavanja
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
