import { useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { ROUTES } from "@/routes/routes";

const STORAGE_KEY = "rnbp-promo-dismissed";

export function PromoBanner() {
  const { t } = useLanguage();
  const promo = t.promo;
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );

  if (!promo || dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  return (
    <div className="bg-[var(--rcb-white)]">
      <div className="section-shell py-3">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--rcb-primary)]/30 bg-[var(--rcb-primary)]/[0.06] px-5 py-3.5 shadow-md">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-3">
            <span className="relative shrink-0 rounded-full bg-[var(--rcb-primary)] px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--rcb-primary)] opacity-30" />
              {promo.badge}
            </span>
            <p className="text-sm font-medium text-[var(--rcb-text-strong)] sm:text-base">
              {promo.text}
            </p>
          </div>
          <Link
            to={ROUTES.shop}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--rcb-primary)] transition-colors hover:underline"
          >
            {promo.cta}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 cursor-pointer rounded-lg p-1.5 text-[var(--rcb-text-muted)] transition-colors hover:bg-[var(--rcb-primary)]/10 hover:text-[var(--rcb-text-strong)]"
          aria-label={promo.dismiss}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      </div>
    </div>
  );
}
