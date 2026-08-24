/**
 * Meta Conversions API — the server-side copy of a purchase.
 *
 * The browser pixel is the unreliable half: ad blockers, tracking protection
 * and a customer who closes the tab on Stripe's success page all lose the
 * sale. The Stripe webhook loses none of them, which is why the number that
 * matters travels from here.
 *
 * Two things this file exists to get right:
 *
 * **Deduplication.** The same purchase is reported twice on purpose — once by
 * the browser, once by us. Meta collapses the pair only when both carry the
 * same `event_id`. Without it every sale counts double and the cost per
 * acquisition we read is half the real one, which is the kind of error that
 * looks like good news.
 *
 * **Consent.** The webhook arrives from Stripe with no idea what the visitor
 * agreed to, so the answer is frozen on the order at checkout. Sending from
 * the server while the browser is silenced would route around a refusal, which
 * is precisely what Law 25 forbids. `adConsent` must be an explicit `true`;
 * null and false both mean no.
 */

import { getConfig } from "../config.js";

const API_VERSION = "v21.0";

/** Same pixel as the browser — the two halves must land on one dataset. */
const PIXEL_ID = "1048612014825465";

export type PurchaseEvent = {
  orderId: string;
  /** The id shared with the browser event. No id, no deduplication, no send. */
  eventId: string | null;
  /** Frozen at checkout. Anything but `true` means we stay quiet. */
  adConsent: boolean | null;
  email: string | null;
  valueCents: number;
  currency?: string;
  /** Meta's click id, when the visit came from one of its ads. */
  fbclid?: string | null;
  /** Where the purchase happened, required by Meta for a website event. */
  sourceUrl: string;
};

/** Meta matches on hashed identifiers only; the raw email never leaves here. */
async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Reports one purchase. Returns whether the event was actually sent, so the
 * caller can record it and avoid a second attempt.
 *
 * Never throws: a measurement failure must not turn a paid order into a failed
 * webhook, which Stripe would then retry.
 */
export async function sendPurchaseEvent(event: PurchaseEvent): Promise<boolean> {
  const config = getConfig();
  const token = config.META_CAPI_TOKEN;

  if (!token) return false;

  if (event.adConsent !== true) {
    console.log(`[capi] Order ${event.orderId}: no advertising consent, not reported.`);
    return false;
  }

  // An event with no id would be counted a second time next to the browser's
  // copy. Reporting nothing is better than reporting double.
  if (!event.eventId) {
    console.warn(`[capi] Order ${event.orderId}: no event id, skipped to avoid double counting.`);
    return false;
  }

  const userData: Record<string, unknown> = {};
  if (event.email) userData.em = [await sha256Hex(event.email)];
  if (event.fbclid) {
    // Meta expects the click id repackaged as fbc: version.subdomain.timestamp.
    userData.fbc = `fb.1.${Date.now()}.${event.fbclid}`;
  }

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.sourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: event.currency ?? "CAD",
          value: event.valueCents / 100,
          order_id: event.orderId,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      // The body carries Meta's reason; the token itself is in the URL, not
      // the response, so this is safe to log.
      console.error(`[capi] Order ${event.orderId}: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[capi] Order ${event.orderId} failed:`, err);
    return false;
  }
}
