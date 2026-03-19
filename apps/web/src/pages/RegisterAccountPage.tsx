import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/i18n/context";
import { isNetworkError } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/Button";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { ServiceUnavailable } from "@/components/auth/ServiceUnavailable";
import { ROUTES } from "@/routes/routes";

export function RegisterAccountPage() {
  const { register, backendAvailable } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendDown, setBackendDown] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
      });
      navigate(ROUTES.dashboard, { replace: true });
    } catch (err) {
      if (isNetworkError(err)) {
        setBackendDown(true);
        return;
      }
      setError(getErrorMessage(err, t));
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
        <title>{t.pages.register.title}</title>
        <meta name="description" content={t.pages.register.description} />
      </Helmet>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
          {t.auth?.registerHeading ?? "Créer un compte"}
        </h1>
        <p className="mt-2 text-[var(--rcb-text-muted)]">
          {t.auth?.registerDescription ??
            "Inscrivez-vous pour enregistrer vos biens"}
        </p>

        <div className="mt-8">
          <OAuthButtons />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
              >
                {t.auth?.firstNameLabel ?? "Prénom"}
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
              >
                {t.auth?.lastNameLabel ?? "Nom"}
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
              />
            </div>
          </div>

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
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
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
              minLength={8}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
            <p className="mt-1 text-xs text-[var(--rcb-text-muted)]">
              {t.auth?.passwordHint ??
                "8 caractères minimum, 1 majuscule, 1 chiffre"}
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
            >
              {t.auth?.phoneLabel ?? "Téléphone"}{" "}
              <span className="text-[var(--rcb-text-muted)]">
                ({t.auth?.optional ?? "optionnel"})
              </span>
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer disabled:opacity-50"
          >
            {loading
              ? (t.auth?.registering ?? "Inscription...")
              : (t.auth?.registerButton ?? "Créer mon compte")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--rcb-text-muted)]">
          {t.auth?.hasAccount ?? "Déjà un compte?"}{" "}
          <Link
            to={ROUTES.login}
            className="font-medium text-[var(--rcb-primary)] hover:underline"
          >
            {t.auth?.loginLink ?? "Se connecter"}
          </Link>
        </p>
      </div>
    </section>
  );
}
