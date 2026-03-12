import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { apiRequest } from "@/lib/api-client";
import { getButtonClasses } from "@/lib/button-styles";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/routes/routes";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Lien de vérification invalide.");

  useEffect(() => {
    if (!token) return;

    apiRequest<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: { token },
    })
      .then(async (data) => {
        setStatus("success");
        setMessage(data.message);
        // Refresh user state so ProtectedRoute knows emailVerified=true
        await refreshUser();
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Erreur lors de la vérification.");
      });
  }, [token, refreshUser]);

  return (
    <section className="min-h-[80vh] bg-[var(--rcb-white)]">
      <div className="section-shell flex flex-col items-center justify-center py-16">
        {status === "loading" && (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rcb-primary)] border-t-transparent" />
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">{message}</h1>
            {user ? (
              <Link to={ROUTES.dashboard} className={getButtonClasses("primary", "sm") + " mt-6"}>
                Tableau de bord
              </Link>
            ) : (
              <Link to={ROUTES.login} className={getButtonClasses("primary", "sm") + " mt-6"}>
                Se connecter
              </Link>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">{message}</h1>
            <Link to="/" className={getButtonClasses("primary", "sm") + " mt-6"}>
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
