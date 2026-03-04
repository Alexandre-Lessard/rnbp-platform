import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; retried: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retried: false };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);

    // In dev, auto-retry once after HMR has time to apply new modules
    if (import.meta.env.DEV && !this.state.retried) {
      setTimeout(() => this.setState({ hasError: false, retried: true }), 300);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, retried: false });
  };

  render() {
    if (this.state.hasError) {
      const isFr = document.documentElement.lang?.startsWith("fr");
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--rcb-bg)] px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--rcb-text)]">
              {isFr ? "Une erreur est survenue" : "Something went wrong"}
            </h1>
            <p className="mt-4 text-lg text-[var(--rcb-text-muted)]">
              {isFr
                ? "Veuillez réessayer ou rafraîchir la page."
                : "Please try again or refresh the page."}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={this.handleRetry}
                className="rounded-lg bg-[var(--rcb-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
              >
                {isFr ? "Réessayer" : "Try again"}
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg border border-[var(--rcb-border-muted)] px-6 py-3 text-sm font-semibold text-[var(--rcb-text)] transition-colors hover:bg-[var(--rcb-surface)]"
              >
                {isFr ? "Rafraîchir" : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
