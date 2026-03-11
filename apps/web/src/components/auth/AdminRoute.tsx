import { Navigate } from "react-router";
import { useAuth } from "@/lib/auth-context";
import { ServiceUnavailable } from "./ServiceUnavailable";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, backendAvailable } = useAuth();

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

  if (!user || !user.isAdmin) {
    return <Navigate to="/tableau-de-bord" replace />;
  }

  return <>{children}</>;
}
