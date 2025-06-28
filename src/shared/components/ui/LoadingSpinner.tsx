import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

/**
 * Loading Spinner Component
 *
 * A reusable loading spinner with optional text and size variants.
 * Uses Lucide React icons for consistency.
 */
export function LoadingSpinner({
  className,
  size = "md",
  text,
}: LoadingSpinnerProps): JSX.Element {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2
        className={cn("animate-spin text-primary-600", sizeClasses[size])}
      />
      {text && <p className="mt-2 text-sm text-neutral-600">{text}</p>}
    </div>
  );
}
