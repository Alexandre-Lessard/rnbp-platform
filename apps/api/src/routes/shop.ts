import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";
import { getDb } from "../db/client.js";
import { orders, orderItems, users } from "../db/schema.js";
import { getConfig } from "../config.js";
import { tryAuth } from "../middleware/auth.js";
import { sendEmail, buildOrderNotificationEmail } from "../utils/email.js";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        rnbpNumber: z.string().optional(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(20),
  email: z.string().email().optional(),
});

function getStripe(): Stripe {
  const config = getConfig();
  if (!config.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }
  return new Stripe(config.STRIPE_SECRET_KEY);
}

export async function shopRoutes(app: FastifyInstance) {
  // ── Create checkout session ──────────────────────────────────────

  app.post(
    "/shop/checkout",
    { preHandler: tryAuth },
    async (request, reply) => {
      const body = checkoutSchema.parse(request.body);
      const config = getConfig();
      const stripe = getStripe();
      const db = getDb();

      // Somme des quantités pour Stripe (un seul Price ID)
      const totalQuantity = body.items.reduce((sum, i) => sum + i.quantity, 0);

      // Email : body > JWT user > null
      let email = body.email;
      if (!email && request.userId) {
        const [user] = await db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.id, request.userId))
          .limit(1);
        email = user?.email;
      }

      // Créer l'order en DB d'abord
      const [order] = await db
        .insert(orders)
        .values({
          email: email || "pending@checkout.stripe.com",
          userId: request.userId || null,
          totalAmountCents: 0, // Mis à jour par le webhook
          status: "pending",
        })
        .returning();

      // Insérer les order_items
      await db.insert(orderItems).values(
        body.items.map((item) => ({
          orderId: order.id,
          rnbpNumber: item.rnbpNumber || null,
          productType: "sticker_sheet",
          quantity: item.quantity,
          unitPriceCents: 0, // Le prix réel vient de Stripe
        })),
      );

      // Créer la session Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: config.STRIPE_PRICE_STICKER_SHEET!,
            quantity: totalQuantity,
          },
        ],
        automatic_tax: { enabled: true },
        shipping_address_collection: {
          allowed_countries: ["CA"],
        },
        ...(email ? { customer_email: email } : {}),
        success_url: `${config.FRONTEND_URL}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.FRONTEND_URL}/boutique`,
        metadata: {
          orderId: order.id,
        },
      });

      // Stocker le session ID
      await db
        .update(orders)
        .set({ stripeSessionId: session.id })
        .where(eq(orders.id, order.id));

      return reply.send({ url: session.url });
    },
  );

  // ── Stripe webhook ───────────────────────────────────────────────

  app.post(
    "/shop/webhook",
    {
      config: {
        rawBody: true,
        rateLimit: { max: 200, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      const config = getConfig();
      if (!config.STRIPE_WEBHOOK_SECRET || !config.STRIPE_SECRET_KEY) {
        return reply.status(503).send({ error: "Stripe not configured" });
      }

      const stripe = getStripe();
      const signature = request.headers["stripe-signature"] as string;

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          (request as any).rawBody,
          signature,
          config.STRIPE_WEBHOOK_SECRET,
        );
      } catch {
        return reply.status(400).send({ error: "Invalid signature" });
      }

      const db = getDb();

      if (event.type === "checkout.session.completed") {
        const eventSession = event.data.object as Stripe.Checkout.Session;
        const orderId = eventSession.metadata?.orderId;

        if (orderId) {
          // Re-fetch la session complète depuis l'API pour avoir shipping_details + line_items
          const session = await stripe.checkout.sessions.retrieve(eventSession.id, {
            expand: ["line_items", "total_details.breakdown"],
          });

          const collected = (session as any).collected_information as
            | { shipping_details?: { name?: string; address?: Record<string, unknown> } }
            | undefined;
          const shipping = collected?.shipping_details;
          const shippingAddr = shipping?.address
            ? JSON.stringify(shipping.address)
            : null;

          // Récupérer les détails des line items pour l'email
          const lineItems = session.line_items?.data ?? [];
          const productLines = lineItems.map((li) => ({
            name: li.description || "Produit",
            quantity: li.quantity || 0,
            amountCents: li.amount_subtotal || 0,
          }));

          // Taxes
          const taxAmountCents = session.total_details?.amount_tax || 0;

          // Idempotent : ne met à jour que si pending
          const updated = await db
            .update(orders)
            .set({
              status: "paid",
              stripePaymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
              email: session.customer_details?.email || undefined,
              totalAmountCents: session.amount_total || 0,
              shippingName: shipping?.name || null,
              shippingAddress: shippingAddr,
              updatedAt: new Date(),
            })
            .where(and(eq(orders.id, orderId), eq(orders.status, "pending")))
            .returning({ id: orders.id });

          // Envoyer notification admin seulement si l'order a été mis à jour (pas un doublon)
          if (updated.length > 0) {
            const items = await db
              .select({ quantity: orderItems.quantity })
              .from(orderItems)
              .where(eq(orderItems.orderId, orderId));
            const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

            sendEmail(
              buildOrderNotificationEmail({
                orderId,
                email: session.customer_details?.email || "inconnu",
                totalAmountCents: session.amount_total || 0,
                taxAmountCents,
                quantity: totalQty,
                productLines,
                shippingName: shipping?.name || null,
                shippingAddress: shippingAddr,
              }),
            ).catch((err) => console.error("[shop] Admin notification failed:", err));
          }
        }
      }

      if (event.type === "checkout.session.expired") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await db
            .update(orders)
            .set({ status: "cancelled", updatedAt: new Date() })
            .where(and(eq(orders.id, orderId), eq(orders.status, "pending")));
        }
      }

      return reply.send({ received: true });
    },
  );
}
