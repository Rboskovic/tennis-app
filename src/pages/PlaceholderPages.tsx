import React from "react";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h1>
        <p className="text-neutral-600 mb-6">{description}</p>
        <div className="bg-neutral-100 rounded-lg p-4">
          <p className="text-sm text-neutral-700">
            Ova stranica je u razvoju i biće dostupna uskoro.
          </p>
        </div>
      </div>
    </div>
  );
}

// Match Page
export function MatchPage() {
  return (
    <PlaceholderPage
      title="Pronađi Meč"
      description="Ovde ćete moći da pronađete protivnike i zakažete mečeve."
    />
  );
}

// Training Page
export function TrainingPage() {
  return (
    <PlaceholderPage
      title="Trening"
      description="Ovde ćete moći da pronađete trenere i zakažete treninge."
    />
  );
}

// Courts Page
export function CourtsPage() {
  return (
    <PlaceholderPage
      title="Tereni"
      description="Ovde ćete moći da rezervišete terene u različitim klubovima."
    />
  );
}

// Profile Page
export function ProfilePage() {
  return (
    <PlaceholderPage
      title="Profil"
      description="Ovde ćete moći da upravljate vašim profilom i podešavanjima."
    />
  );
}

// Tournaments Page
export function TournamentsPage() {
  return (
    <PlaceholderPage
      title="Turniri i Lige"
      description="Ovde ćete moći da se prijavite na turnire i lige."
    />
  );
}

// 404 Not Found Page
export function NotFoundPage() {
  return (
    <PlaceholderPage
      title="Stranica nije pronađena"
      description="Stranica koju tražite ne postoji ili je promenjena."
    />
  );
}
