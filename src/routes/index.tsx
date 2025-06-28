import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../shared/components/layout/AppLayout";
import { LoadingSpinner } from "../shared/components/ui/LoadingSpinner";

// Lazy load pages for better performance
const HomePage = lazy(() => import("../pages/Home/HomePage"));
const MatchPage = lazy(() => import("../pages/Match/MatchPage"));
const TrainingPage = lazy(() => import("../pages/Training/TrainingPage"));
const CourtsPage = lazy(() => import("../pages/Courts/CourtsPage"));
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const TournamentsPage = lazy(
  () => import("../pages/Tournaments/TournamentsPage")
);

// 404 Not Found page
const NotFoundPage = lazy(() => import("../pages/NotFound/NotFoundPage"));

/**
 * Application Router
 *
 * Defines all application routes with lazy loading for better performance.
 * Uses Suspense for loading states during route transitions.
 */
export function AppRouter(): JSX.Element {
  return (
    <AppLayout>
      <Suspense fallback={<LoadingSpinner className="mt-20" />}>
        <Routes>
          {/* Main application routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/match/*" element={<MatchPage />} />
          <Route path="/training/*" element={<TrainingPage />} />
          <Route path="/courts/*" element={<CourtsPage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/tournaments/*" element={<TournamentsPage />} />

          {/* 404 catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}
