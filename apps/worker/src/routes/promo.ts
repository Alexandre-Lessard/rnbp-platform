import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { promoSettings, PROMO_SETTINGS_ID } from "../db/schema.js";
import { isPromoVisible } from "../utils/promo.js";
import type { AppEnv } from "../context.js";

export const promoRoutes = new Hono<AppEnv>();

// ── Current promo (public) ─────────────────────────────────────

// null when the promo is off or over: the banner, the callouts and the footer
// line all disappear together.
promoRoutes.get("/promo", async (c) => {
  const db = getDb();
  const [row] = await db
    .select()
    .from(promoSettings)
    .where(eq(promoSettings.id, PROMO_SETTINGS_ID));

  // Short cache: an admin change shows up within a minute.
  c.header("Cache-Control", "public, max-age=60");

  if (!row || !isPromoVisible(row, new Date())) return c.json({ promo: null });

  return c.json({
    promo: { textFr: row.textFr, textEn: row.textEn, endsOn: row.endsOn },
  });
});
