import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/i18n/context";
import { isNetworkError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { ServiceUnavailable } from "@/components/auth/ServiceUnavailable";
import { ROUTES } from "@/routes/routes";

export function LoginPage() {
  const { login, backendAvailable } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || ROUTES.dashboard;
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendDown, setBackendDown] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirect, { replace: true });
    } catch (err) {
      if (isNetworkError(err)) {
        setBackendDown(true);
        return;
      }
      const code = (err as { code?: string })?.code;
      if (code === "SOCIAL_ACCOUNT") {
        setError(t.auth?.socialAccountError ?? "Ce compte utilise une connexion Google ou Microsoft.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : (t.errors?.loginError ?? "Erreur de connexion"),
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (backendDown || !backendAvailable) {
    return (
      <section className="min-h-[70vh] bg-[var(--rcb-white)]">
        <ServiceUnavailable />
      </section>
    );
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[var(--rcb-white)] px-4 py-16">
      <Helmet>
        <title>{t.pages.login.title}</title>
        <meta name="description" content={t.pages.login.description} />
      </Helmet>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
          {t.auth?.loginHeading ?? "Connexion"}
        </h1>
        <p className="mt-2 text-[var(--rcb-text-muted)]">
          {t.auth?.loginDescription ??
            "Connectez-vous à votre compte RNBP"}
        </p>

        <div className="mt-8">
          <OAuthButtons redirect={redirect} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
            >
              {t.auth?.emailLabel ?? "Courriel"}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
            >
              {t.auth?.passwordLabel ?? "Mot de passe"}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer disabled:opacity-50"
          >
            {loading
              ? (t.auth?.loggingIn ?? "Connexion...")
              : (t.auth?.loginButton ?? "Se connecter")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--rcb-text-muted)]">
          {t.auth?.noAccount ?? "Pas encore de compte?"}{" "}
          <Link
            to={ROUTES.register}
            className="font-medium text-[var(--rcb-primary)] hover:underline"
          >
            {t.auth?.registerLink ?? "Créer un compte"}
          </Link>
        </p>
      </div>
    </section>
  );
}
