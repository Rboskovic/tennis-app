import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to error reporting service
    console.error("Error Boundary caught an error:", error, errorInfo);

    // TODO: Send to error tracking service (Sentry, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-error-600" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Nešto je pošlo po zlu
            </h2>

            <p className="text-neutral-600 mb-6">
              Došlo je do neočekivane greške. Molimo vas pokušajte ponovo.
            </p>

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Pokušaj ponovo
              </Button>

              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Idi na početnu
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700">
                  Detalji greške (dev mode)
                </summary>
                <pre className="mt-2 text-xs bg-neutral-100 p-3 rounded-lg overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
