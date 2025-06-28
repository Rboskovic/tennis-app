import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 *
 * A flexible, accessible button component with multiple variants and states.
 * Follows design system tokens and supports loading states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg font-medium",
          "transition-all duration-200 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",

          // Variant styles
          {
            "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500":
              variant === "primary",
            "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 focus-visible:ring-primary-500":
              variant === "secondary",
            "text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500":
              variant === "ghost",
            "bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500":
              variant === "danger",
          },

          // Size styles
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-base": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },

          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {/* Left icon or loading spinner */}
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}

        {/* Button content */}
        {children}

        {/* Right icon */}
        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
