import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MatchPreferencesForm } from "../../features/match-making/components/MatchPreferencesForm";
import { MatchResults } from "../../features/match-making/components/MatchResults";
import { MatchBooking } from "../../features/match-making/components/MatchBooking";
import {
  useMatchStore,
  Player,
} from "../../features/match-making/stores/matchStore";

type MatchFlowStep = "preferences" | "results" | "booking";

/**
 * Main Match Page Component
 *
 * Orchestrates the complete match-making flow:
 * 1. Preferences setup
 * 2. Search results
 * 3. Match booking
 * 4. Confirmation
 */
export default function MatchPage(): JSX.Element {
  const navigate = useNavigate();
  const { searchMatches, resetSearch, resetBooking } = useMatchStore();

  const [currentStep, setCurrentStep] = useState<MatchFlowStep>("preferences");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Reset state when component mounts
  useEffect(() => {
    resetSearch();
    resetBooking();
    setCurrentStep("preferences");
    setSelectedPlayer(null);
  }, [resetSearch, resetBooking]);

  // Handle moving to results after preferences are set
  const handlePreferencesNext = useCallback(async () => {
    setCurrentStep("results");
    await searchMatches();
  }, [searchMatches]);

  // Handle going back to preferences from results
  const handleResultsBack = useCallback(() => {
    setCurrentStep("preferences");
    resetSearch();
  }, [resetSearch]);

  // Handle player selection for booking
  const handlePlayerSelect = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setCurrentStep("booking");
  }, []);

  // Handle going back to results from booking
  const handleBookingBack = useCallback(() => {
    setCurrentStep("results");
    setSelectedPlayer(null);
  }, []);

  // Handle successful booking - go to home
  const handleBookingSuccess = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Render current step
  const renderCurrentStep = (): JSX.Element => {
    switch (currentStep) {
      case "preferences":
        return <MatchPreferencesForm onNext={handlePreferencesNext} />;

      case "results":
        return (
          <MatchResults
            onSelectPlayer={handlePlayerSelect}
            onBack={handleResultsBack}
          />
        );

      case "booking":
        if (!selectedPlayer) {
          // Fallback if no player selected
          setCurrentStep("results");
          return <div>Loading...</div>;
        }
        return (
          <MatchBooking
            player={selectedPlayer}
            onBack={handleBookingBack}
            onSuccess={handleBookingSuccess}
          />
        );

      default:
        return <MatchPreferencesForm onNext={handlePreferencesNext} />;
    }
  };

  return renderCurrentStep();
}
