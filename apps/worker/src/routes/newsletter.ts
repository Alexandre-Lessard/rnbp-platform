import { Hono } from "hono";
import { eq } from "drizzle-orm";
import {
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
  SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_OPTED_OUT,
  UNSUBSCRIBE_SUCCESS,
  UNSUBSCRIBE_LINK_INVALID,
} from "@badge/shared";
import { getDb } from "../db/client.js";
import { newsletterSubscribers } from "../db/schema.js";
import { authRateLimit } from "../middleware/auth.js";
import { verifySignedToken } from "../utils/email.js";
import { AppError } from "../utils/errors.js";
import type { AppEnv } from "../context.js";

export const newsletterRoutes = new Hono<AppEnv>();

newsletterRoutes.post("/newsletter/subscribe", authRateLimit, async (c) => {
  const body = newsletterSubscribeSchema.parse(await c.req.json());
  const db = getDb();
  const now = new Date();

  // onConflictDoNothing rather than select-then-insert: two simultaneous
  // submissions of the same address used to race and surface the unique
  // constraint as a 500.
  await db
    .insert(newsletterSubscribers)
    .values({
      email: body.email,
      consentSource: body.source ?? "website",
      consentAt: now,
    })
    .onConflictDoNothing();

  const [row] = await db
    .select({ unsubscribedAt: newsletterSubscribers.unsubscribedAt })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, body.email))
    .limit(1);

  // An address that opted out is never silently brought back by a form
  // submission — under CASL, withdrawn consent has to be given again knowingly.
  if (row?.unsubscribedAt) {
    return c.json({
      code: SUBSCRIPTION_OPTED_OUT,
      message:
        "This address previously unsubscribed. Please contact us to opt back in.",
    });
  }

  return c.json({
    code: SUBSCRIPTION_SUCCESS,
    message: "Subscription successful. Thank you!",
  });
});

/**
 * Unsubscribe. POST rather than GET so a mail-client prefetch cannot silently
 * opt someone out, and so the same endpoint serves RFC 8058 one-click
 * unsubscription, where Gmail POSTs the URL from the List-Unsubscribe header.
 * The token travels in the query string for that reason.
 */
newsletterRoutes.post("/newsletter/unsubscribe", async (c) => {
  const token =
    c.req.query("token") ??
    newsletterUnsubscribeSchema.parse(await c.req.json().catch(() => ({}))).token;

  const subscriberId = verifySignedToken(token, "newsletter-unsubscribe");
  if (!subscriberId) {
    throw new AppError(400, UNSUBSCRIBE_LINK_INVALID, "Invalid unsubscribe link");
  }

  const db = getDb();
  // Idempotent on purpose: clicking twice, or a client retrying the one-click
  // POST, must not look like a failure.
  await db
    .update(newsletterSubscribers)
    .set({ unsubscribedAt: new Date() })
    .where(eq(newsletterSubscribers.id, subscriberId));

  return c.json({
    code: UNSUBSCRIBE_SUCCESS,
    message: "You have been unsubscribed.",
  });
});
