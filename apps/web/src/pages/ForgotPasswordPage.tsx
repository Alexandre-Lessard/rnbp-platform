import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/routes";

export function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email: email.trim().toLowerCase() },
      });
      // The endpoint answers the same way whether or not the account exists,
      // so the confirmation must stay just as neutral: showing anything else
      // would turn this form into an account-enumeration oracle.
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[var(--rcb-white)] px-4 py-16">
      <title>{t.pages.forgotPassword.title}</title>
      <meta name="description" content={t.pages.forgotPassword.description} />

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
          {t.auth!.forgotHeading}
        </h1>

        {sent ? (
          <div className="mt-6 rounded-lg bg-[var(--rcb-primary)]/8 px-4 py-4 text-sm leading-relaxed text-[var(--rcb-text-body)]">
            {t.auth!.forgotSentBody}
          </div>
        ) : (
          <>
            <p className="mt-2 text-[var(--rcb-text-muted)]">
              {t.auth!.forgotDescription}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                  {t.auth!.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer disabled:opacity-50"
                style={{ minWidth: 260 }}
              >
                {loading ? t.auth!.forgotSending : t.auth!.forgotSubmit}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-[var(--rcb-text-muted)]">
          <Link
            to={ROUTES.login}
            className="font-medium text-[var(--rcb-primary)] hover:underline"
          >
            {t.auth!.backToLogin}
          </Link>
        </p>
      </div>
    </section>
  );
}
export default ForgotPasswordPage;
