import { useEffect, useState, useRef, type FormEvent } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/i18n/context";
import { verifyState, getCodeVerifier, getOAuthRedirect, type OAuthProvider } from "@/lib/oauth";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/routes";

export function OAuthCallbackPage() {
  const { loginWithOAuth, completeOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [error, setError] = useState("");
  const [needsEmail, setNeedsEmail] = useState(false);
  const [pendingToken, setPendingToken] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const processed = useRef(false);
  const redirectTo = useRef(ROUTES.dashboard);

  // Determine provider from pathname
  const provider: OAuthProvider = location.pathname.includes("/google/")
    ? "google"
    : location.pathname.includes("/facebook/")
      ? "facebook"
      : "microsoft";

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const urlError = searchParams.get("error");

    if (urlError) {
      setError(t.auth?.oauthError ?? "Login error. Please try again.");
      return;
    }

    if (!code || !state) {
      setError(t.auth?.oauthError ?? "Login error. Please try again.");
      return;
    }

    if (!verifyState(provider, state)) {
      setError(t.auth?.oauthError ?? "Login error. Please try again.");
      return;
    }

    // Facebook doesn't use PKCE, so codeVerifier is optional
    const codeVerifier = getCodeVerifier(provider);
    if (!codeVerifier && provider !== "facebook") {
      setError(t.auth?.oauthError ?? "Login error. Please try again.");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/${provider}/callback`;

    redirectTo.current = (getOAuthRedirect() || ROUTES.dashboard) as typeof ROUTES.dashboard;

    loginWithOAuth(provider, code, redirectUri, codeVerifier)
      .then((result) => {
        if ("needsEmail" in result && result.needsEmail) {
          setNeedsEmail(true);
          setPendingToken(result.pendingToken);
        } else {
          navigate(redirectTo.current, { replace: true });
        }
      })
      .catch((err) => {
        setError(getErrorMessage(err, t));
      });
  }, [searchParams, provider, loginWithOAuth, navigate, t]);

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await completeOAuth(pendingToken, email);
      navigate(redirectTo.current, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : (t.auth?.oauthError ?? "Login error. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Email input form (provider without email case)
  if (needsEmail) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[var(--rcb-white)] px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
            {t.auth?.oauthEmailPrompt ?? "Please enter your email address to complete login."}
          </h1>

          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="oauth-email"
                className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]"
              >
                {t.auth?.emailLabel ?? "Email"}
              </label>
              <input
                id="oauth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? (t.auth?.oauthLoading ?? "Logging in...")
                : (t.auth?.loginButton ?? "Log in")}
            </Button>
          </form>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[var(--rcb-white)] px-4 py-16">
        <div className="text-center">
          <div className="rounded-lg bg-red-50 px-6 py-4 text-sm text-red-700">
            {error}
          </div>
          <Link
            to={ROUTES.login}
            className="mt-4 inline-block font-medium text-[var(--rcb-primary)] hover:underline"
          >
            {t.auth?.loginLink ?? "Log in"}
          </Link>
        </div>
      </section>
    );
  }

  // Loading
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[var(--rcb-white)] px-4 py-16">
      <Helmet>
        <title>{t.auth?.oauthLoading ?? "Logging in..."}</title>
      </Helmet>
      <p className="text-[var(--rcb-text-muted)]">
        {t.auth?.oauthLoading ?? "Logging in..."}
      </p>
    </section>
  );
}
