import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { apiRequest, isNetworkError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/routes";

export function Footer() {
  const { t, locale } = useLanguage();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "unavailable">("idle");

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      await apiRequest("/newsletter/subscribe", {
        method: "POST",
        body: { email },
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus(isNetworkError(err) ? "unavailable" : "error");
    }
  }

  return (
    <footer className="bg-[var(--rcb-header)]">
      <div className="section-shell py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Link to="/" className="inline-block">
              <img src={`/assets/logo-acronyme-${locale}.png`} alt={t.a11y.logoAlt} className="h-10" />
            </Link>
            <nav aria-label={t.a11y.mainNav} className="mt-8 flex flex-wrap gap-8 text-sm font-medium text-[var(--rcb-text-strong)]">
              {t.nav.items
                .filter((item) => !item.withChevron)
                .map((item) =>
                  item.href.startsWith("/") ? (
                    <Link key={item.href} to={item.href}>
                      {item.label}
                    </Link>
                  ) : (
                    <a key={item.href} href={item.href}>
                      {item.label}
                    </a>
                  ),
                )}
            </nav>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[var(--rcb-text-strong)]">{t.footer.subscribeHeading}</h3>
            <form
              className="mt-5 flex flex-col gap-4 sm:flex-row"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                required
                placeholder={t.footer.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className="h-11 w-full border-b border-[var(--rcb-border-muted)] bg-transparent px-1 text-lg text-[var(--rcb-text-body)] placeholder:text-[var(--rcb-text-light)] focus:outline-none"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={status === "loading"}
                className="shrink-0 cursor-pointer disabled:opacity-50"
              >
                {status === "loading" ? "..." : t.footer.sendButton}
              </Button>
            </form>
            {status === "success" && (
              <p className="mt-3 text-sm font-medium text-green-600">Merci !</p>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm text-red-600">Une erreur est survenue.</p>
            )}
            {status === "unavailable" && (
              <p className="mt-3 text-sm text-red-600">Service temporairement indisponible. Réessayez plus tard.</p>
            )}
            <p className="mt-4 text-sm text-[var(--rcb-text-muted)]">
              {t.footer.disclaimer}
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--rcb-border)] pt-8 text-sm text-[var(--rcb-text-body)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              <Link to={ROUTES.privacy} className="transition-colors hover:text-[var(--rcb-primary)]">{t.footer.privacyPolicy}</Link>
              <Link to={ROUTES.terms} className="transition-colors hover:text-[var(--rcb-primary)]">{t.footer.termsOfUse}</Link>
              <span className="cursor-not-allowed opacity-50">{t.footer.cookieSettings}</span>
            </div>
            <p>{t.footer.copyright.replace("{{year}}", String(year))}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
