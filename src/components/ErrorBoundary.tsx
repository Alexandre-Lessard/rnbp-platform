import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

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
                ? "Veuillez rafraîchir la page ou réessayer plus tard."
                : "Please refresh the page or try again later."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 rounded-lg bg-[var(--rcb-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
            >
              {isFr ? "Rafraîchir" : "Refresh"}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
