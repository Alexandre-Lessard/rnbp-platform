import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import type { SupportedLocale } from "@/i18n/locales";

/**
 * The pre-launch promo, as set in /admin/promo. null while loading, when the
 * promo is off or over, and when the request fails: better no promo than a
 * wrong one. The banner, the callouts and the footer line all read this, so
 * they appear and disappear together.
 */
export type Promo = { textFr: string; textEn: string; endsOn: string };

let pending: Promise<Promo | null> | null = null;
// Set after an admin save so the next read skips the browser's 60 s cache.
let cacheBust = "";

function loadPromo(): Promise<Promo | null> {
  if (!pending) {
    pending = apiRequest<{ promo: Promo | null }>(`/promo${cacheBust}`)
      .then((data) => data.promo)
      .catch(() => null);
  }
  return pending;
}

/** Forget the cached promo, so the next reader fetches it again. */
export function invalidatePromo() {
  pending = null;
  cacheBust = `?v=${Date.now()}`;
}

export function usePromo(): Promo | null {
  const [promo, setPromo] = useState<Promo | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPromo().then((value) => {
      if (!cancelled) setPromo(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return promo;
}

/** "1er janvier 2027" / "January 1, 2027", from a YYYY-MM-DD date. */
export function formatPromoDate(endsOn: string, locale: SupportedLocale): string {
  const [y, m, d] = endsOn.split("-").map(Number);
  // Noon UTC keeps the day the same in every time zone.
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  const formatted = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  // French writes the first of the month as "1er".
  return locale === "fr" ? formatted.replace(/^1 /, "1er ") : formatted;
}

/**
 * The full banner sentence: the admin's text, then the "valid until" line from
 * the locale file (`promo.validUntil`, with a `{date}` placeholder).
 */
export function promoSentence(promo: Promo, locale: SupportedLocale, validUntil: string): string {
  const text = locale === "fr" ? promo.textFr : promo.textEn;
  return `${text} ${validUntil.replace("{date}", formatPromoDate(promo.endsOn, locale))}`;
}
