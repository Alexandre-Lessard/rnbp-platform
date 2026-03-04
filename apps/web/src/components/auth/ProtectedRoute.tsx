import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/lib/auth-context";
import { ServiceUnavailable } from "./ServiceUnavailable";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, backendAvailable } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rcb-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!backendAvailable) {
    return <ServiceUnavailable />;
  }

  if (!user) {
    return (
      <Navigate
        to={`/connexion?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
