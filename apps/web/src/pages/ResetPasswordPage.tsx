import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { resetPasswordSchema, RESET_LINK_INVALID } from "@badge/shared";
import { useLanguage } from "@/i18n/context";
import { apiRequest, type ApiError } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { getButtonClasses } from "@/lib/button-styles";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/routes";

export function ResetPasswordPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [linkDead, setLinkDead] = useState(!token);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(t.auth!.resetMismatch);
      return;
    }

    // Same rule as the server, from the shared schema — the wording shown is
    // ours and localized, but the rule itself has a single source of truth.
    if (!resetPasswordSchema.safeParse({ token, password }).success) {
      setError(t.auth!.passwordHint);
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: { token, password },
      });
      setDone(true);
    } catch (err) {
      if ((err as ApiError)?.code === RESET_LINK_INVALID) {
        setLinkDead(true);
        return;
      }
      setError(getErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[var(--rcb-white)] px-4 py-16">
      <title>{t.pages.resetPassword.title}</title>
      <meta name="description" content={t.pages.resetPassword.description} />

      <div className="w-full max-w-md">
        {done ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
              {t.auth!.resetSuccessHeading}
            </h1>
            <p className="mt-3 leading-relaxed text-[var(--rcb-text-body)]">
              {t.auth!.resetSuccessBody}
            </p>
            <Link to={ROUTES.login} className={getButtonClasses("primary", "sm") + " mt-6"}>
              {t.auth!.loginButton}
            </Link>
          </div>
        ) : linkDead ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
              {t.auth!.resetLinkDeadHeading}
            </h1>
            <p className="mt-3 leading-relaxed text-[var(--rcb-text-body)]">
              {t.auth!.resetLinkDeadBody}
            </p>
            <Link
              to={ROUTES.forgotPassword}
              className={getButtonClasses("primary", "sm") + " mt-6"}
            >
              {t.auth!.resetRequestNew}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
              {t.auth!.resetHeading}
            </h1>
            <p className="mt-2 text-[var(--rcb-text-muted)]">
              {t.auth!.resetDescription}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
                >
                  {t.auth!.resetNewPasswordLabel}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[var(--rcb-text-muted)]">
                  {t.auth!.passwordHint}
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
                >
                  {t.auth!.resetConfirmLabel}
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer disabled:opacity-50"
                style={{ minWidth: 260 }}
              >
                {loading ? t.auth!.resetting : t.auth!.resetSubmit}
              </Button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
export default ResetPasswordPage;
