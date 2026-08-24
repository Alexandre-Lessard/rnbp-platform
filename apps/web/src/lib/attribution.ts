/**
 * First-touch attribution — which campaign brought someone here.
 *
 * Meta's own numbers cannot be checked against anything unless we keep our own
 * record, so the campaign tags are read off the landing URL and carried to the
 * sign-up and to the order.
 *
 * Two rules shape the whole file:
 *
 * 1. **Consent first.** Writing a campaign identifier into the browser to
 *    recognise someone later is an advertising tracker under Law 25, and our
 *    own privacy policy promises the advertising category is what tells us
 *    "quelles annonces mènent à une inscription". So nothing is persisted
 *    before an explicit yes. Until then the tags live in memory only, which
 *    dies with the tab and identifies nobody across visits.
 * 2. **First touch wins.** The campaign that earned the visit is the one that
 *    brought the person in, not the last URL they happened to reload. An
 *    existing record is never overwritten.
 */

import { hasConsent, onConsentChange } from "@/lib/consent";

export type Attribution = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  /** Meta's click identifier, the only tag Meta itself can match back. */
  fbclid: string | null;
};

const STORAGE_KEY = "badge-attribution-v1";

/** Long enough for a slow decision, short enough not to be a durable profile. */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type StoredAttribution = Attribution & { capturedAt: string };

/**
 * What the landing URL carried, held in memory until consent allows storing it.
 * A visitor who arrives on `?fbclid=…`, browses, then accepts the banner three
 * pages later would otherwise lose the tag: the URL is long gone by then.
 */
let pending: Attribution | null = null;

function clean(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().slice(0, 255);
  return trimmed.length > 0 ? trimmed : null;
}

function readUrl(): Attribution | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
    fbclid: clean(params.get("fbclid")),
  };
  const hasAny = Object.values(found).some((v) => v !== null);
  return hasAny ? found : null;
}

function read(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (Date.now() - new Date(parsed.capturedAt).getTime() > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    // Private browsing, disabled storage, a corrupted value — all mean we have
    // no attribution, which is a legitimate answer rather than an error.
    return null;
  }
}

function persist(attribution: Attribution): void {
  // First touch: an existing record is the earlier one, so it stays.
  if (read()) return;
  try {
    const record: StoredAttribution = { ...attribution, capturedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage refused. The tags stay in `pending` for this page view, so a
    // checkout started right now still carries them.
  }
}

/** The stored campaign, or the in-memory one, or nothing. Never throws. */
export function getAttribution(): Attribution | null {
  if (!hasConsent("advertising")) return null;
  const stored = read();
  if (!stored) return pending;
  return {
    utmSource: stored.utmSource,
    utmMedium: stored.utmMedium,
    utmCampaign: stored.utmCampaign,
    fbclid: stored.fbclid,
  };
}

/** Dropped along with the rest when consent is withdrawn. */
export function clearAttribution(): void {
  pending = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage was never available.
  }
}

/**
 * Called once from the app root, next to the pixel. Reads the landing URL and
 * keeps listening, so a yes given later still captures the campaign that is
 * waiting in memory.
 */
export function initAttribution(): () => void {
  pending = readUrl() ?? pending;

  if (pending && hasConsent("advertising")) persist(pending);

  return onConsentChange((consent) => {
    if (consent?.advertising) {
      // The URL may still be the landing one — re-read it before falling back.
      const current = readUrl() ?? pending;
      if (current) persist(current);
    } else {
      clearAttribution();
    }
  });
}
