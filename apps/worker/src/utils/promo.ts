// Whether the pre-launch promo is shown right now. Pure, so it is tested
// without a database; the public GET /promo and the admin page both rely on it.

export const PROMO_TIME_ZONE = "America/Toronto";

export type PromoVisibilityInput = {
  active: boolean;
  autoHide: boolean;
  /** Last day of the offer, YYYY-MM-DD, inclusive. */
  endsOn: string;
};

/** Today's date in Montreal, as YYYY-MM-DD. */
export function montrealToday(now: Date): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PROMO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isPromoVisible(settings: PromoVisibilityInput, now: Date): boolean {
  if (!settings.active) return false;
  if (!settings.autoHide) return true;
  // "Valid until January 1" includes January 1: hidden from the next day on.
  // YYYY-MM-DD strings compare correctly as strings.
  return montrealToday(now) <= settings.endsOn;
}
