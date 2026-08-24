/**
 * Meta pixel, loaded only after an explicit yes to the advertising category.
 *
 * The script is never in the HTML. It is injected the moment consent arrives
 * and never before — so someone who refuses, or who has not answered, never
 * sees a request leave for Meta. Refusing later stops further events; the
 * script itself cannot be unloaded, which is exactly why it must not load
 * speculatively in the first place.
 */

import { hasConsent, onConsentChange } from "@/lib/consent";

const PIXEL_ID = "1048612014825465";

type FbqFn = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

let injected = false;

function inject(): void {
  if (injected || typeof window === "undefined" || window.fbq) return;
  injected = true;

  // The stub queues calls until the real script replaces it — Meta's own
  // snippet, written out rather than pasted as an opaque blob.
  const fbq: FbqFn = function (...args: unknown[]) {
    (fbq.queue = fbq.queue || []).push(args);
  } as FbqFn;
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", PIXEL_ID);
}

/** Consent-gated: every event goes through here, never straight to fbq. */
export function track(event: string, params?: Record<string, unknown>, eventId?: string): void {
  if (!hasConsent("advertising")) return;
  inject();
  // eventID is what lets the server-side copy of the same action be recognised
  // as a duplicate rather than counted twice.
  window.fbq?.("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}

/**
 * Called once from the app root. Sends the first PageView if consent already
 * exists, and starts listening so a later yes takes effect without a reload.
 */
export function initPixel(): () => void {
  if (hasConsent("advertising")) track("PageView");
  return onConsentChange((c) => {
    if (c?.advertising) track("PageView");
  });
}

/**
 * A shared id for one action, so the browser event and the server event
 * describe the same thing. Generated client-side and handed to the API, which
 * forwards it to the Conversions API.
 */
export function newEventId(): string {
  return crypto.randomUUID();
}
