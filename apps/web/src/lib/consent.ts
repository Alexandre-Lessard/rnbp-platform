/**
 * Consent state for trackers, as Quebec's Law 25 requires it: explicit,
 * granular, and as easy to withdraw as it was to give.
 *
 * Nothing that tracks may load before a choice exists. `null` means "not asked
 * yet" and must be treated as refusal by every caller — never as permission.
 */

export type ConsentCategories = {
  /** Session, language, cart. Cannot be refused; the site breaks without them. */
  necessary: true;
  /** Audience measurement. */
  measurement: boolean;
  /** Advertising trackers — the Meta pixel and its server-side twin. */
  advertising: boolean;
};

const STORAGE_KEY = "badge-consent-v1";

/** Bumped when the categories change meaning; an old record stops counting. */
const VERSION = 1;

type StoredConsent = {
  version: number;
  measurement: boolean;
  advertising: boolean;
  /** When the choice was made — Law 25 expects consent to be demonstrable. */
  decidedAt: string;
};

const listeners = new Set<(c: ConsentCategories | null) => void>();

function read(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    // A record from an older set of categories says nothing about the current
    // ones, so we ask again rather than assume.
    if (parsed.version !== VERSION) return null;
    return parsed;
  } catch {
    // Private browsing, disabled storage, corrupted value — all mean "no
    // usable consent", which is the safe answer.
    return null;
  }
}

/** The current choice, or `null` if the person has not answered yet. */
export function getConsent(): ConsentCategories | null {
  const stored = read();
  if (!stored) return null;
  return {
    necessary: true,
    measurement: stored.measurement,
    advertising: stored.advertising,
  };
}

/** True only for an explicit yes. Absence of a choice is a no. */
export function hasConsent(category: "measurement" | "advertising"): boolean {
  return getConsent()?.[category] === true;
}

export function setConsent(choice: { measurement: boolean; advertising: boolean }): void {
  const record: StoredConsent = {
    version: VERSION,
    measurement: choice.measurement,
    advertising: choice.advertising,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage refused. The choice still applies to this page view through the
    // listeners below; it just will not survive a reload.
  }
  const current = getConsent() ?? { necessary: true as const, ...choice };
  listeners.forEach((fn) => fn(current));
}

/** Withdrawing has to be as easy as consenting — this is the same one click. */
export function withdrawConsent(): void {
  setConsent({ measurement: false, advertising: false });
}

/** Forget the decision entirely so the banner asks again. */
export function resetConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage was never available.
  }
  listeners.forEach((fn) => fn(null));
}

export function onConsentChange(fn: (c: ConsentCategories | null) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** True once a choice exists. Stable primitive, safe for useSyncExternalStore. */
export function hasDecided(): boolean {
  return read() !== null;
}

/**
 * Reopening the preferences from anywhere (the footer, a link in the privacy
 * policy) without threading state through a provider.
 */
const OPEN_EVENT = "badge:open-cookie-preferences";

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenPreferences(fn: () => void): () => void {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
}
