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
  const [termsAccepted, setTermsAccepted] = useState(false);
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
          {t.auth?.registerHeading ?? "Create an account"}
        </h1>
        <p className="mt-2 text-[var(--rcb-text-muted)]">
          {t.auth?.registerDescription ??
            "Sign up to register your belongings"}
        </p>

        <div className="mt-6 flex items-start gap-3">
          <input
            id="reg-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--rcb-border)] accent-[var(--rcb-primary)]"
          />
          <label htmlFor="reg-terms" className="text-sm text-[var(--rcb-text-body)]">
            {t.auth?.termsLabel ?? "I accept the"}{" "}
            <Link to={ROUTES.terms} className="text-[var(--rcb-primary)] hover:underline" target="_blank">
              {t.auth?.termsLink ?? "terms of use"}
            </Link>{" "}
            {t.auth?.termsAnd ?? "and the"}{" "}
            <Link to={ROUTES.privacy} className="text-[var(--rcb-primary)] hover:underline" target="_blank">
              {t.auth?.privacyLink ?? "privacy policy"}
            </Link>
          </label>
        </div>

        <div className="mt-4">
          <OAuthButtons disabled={!termsAccepted} />
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
                {t.auth?.firstNameLabel ?? "First name"}
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
                {t.auth?.lastNameLabel ?? "Last name"}
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
              {t.auth?.emailLabel ?? "Email"}
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
              {t.auth?.passwordLabel ?? "Password"}
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
                "8 characters minimum, 1 uppercase, 1 number"}
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
            >
              {t.auth?.phoneLabel ?? "Phone"}{" "}
              <span className="text-[var(--rcb-text-muted)]">
                ({t.auth?.optional ?? "optional"})
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
            disabled={loading || !termsAccepted}
            className="w-full cursor-pointer disabled:opacity-50"
          >
            {loading
              ? (t.auth?.registering ?? "Signing up...")
              : (t.auth?.registerButton ?? "Create my account")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--rcb-text-muted)]">
          {t.auth?.hasAccount ?? "Already have an account?"}{" "}
          <Link
            to={ROUTES.login}
            className="font-medium text-[var(--rcb-primary)] hover:underline"
          >
            {t.auth?.loginLink ?? "Log in"}
          </Link>
        </p>
      </div>
    </section>
  );
}
