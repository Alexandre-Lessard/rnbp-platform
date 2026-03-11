import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { orders, orderItems, items, users } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";
import { notFound, badRequest } from "../utils/errors.js";

const rnbpNumberSchema = z
  .string()
  .regex(/^RNBP-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/, "Format invalide (RNBP-XXXXXXXX)");

export async function adminRoutes(app: FastifyInstance) {
  // ── Liste des commandes ────────────────────────────────────────

  app.get(
    "/admin/orders",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const db = getDb();
      const { status } = request.query as { status?: string };

      const allOrders = await db
        .select()
        .from(orders)
        .where(
          status
            ? eq(orders.status, status as "pending" | "paid" | "shipped" | "cancelled")
            : undefined,
        )
        .orderBy(desc(orders.createdAt));

      // Pour chaque commande, récupérer les order items avec infos item
      const result = await Promise.all(
        allOrders.map(async (order) => {
          const oi = await db
            .select({
              id: orderItems.id,
              itemId: orderItems.itemId,
              rnbpNumber: orderItems.rnbpNumber,
              productType: orderItems.productType,
              quantity: orderItems.quantity,
              itemName: items.name,
              itemCategory: items.category,
              itemBrand: items.brand,
              itemModel: items.model,
            })
            .from(orderItems)
            .leftJoin(items, eq(orderItems.itemId, items.id))
            .where(eq(orderItems.orderId, order.id));

          return { ...order, items: oi };
        }),
      );

      return reply.send({ orders: result });
    },
  );

  // ── Détail d'une commande ──────────────────────────────────────

  app.get(
    "/admin/orders/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const db = getDb();

      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id))
        .limit(1);

      if (!order) throw notFound("Commande introuvable");

      // Récupérer le user si présent
      let customer = null;
      if (order.userId) {
        const [u] = await db
          .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            clientNumber: users.clientNumber,
          })
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);
        customer = u || null;
      }

      const oi = await db
        .select({
          id: orderItems.id,
          itemId: orderItems.itemId,
          rnbpNumber: orderItems.rnbpNumber,
          productType: orderItems.productType,
          quantity: orderItems.quantity,
          itemName: items.name,
          itemCategory: items.category,
          itemBrand: items.brand,
          itemModel: items.model,
          itemRnbpNumber: items.rnbpNumber,
        })
        .from(orderItems)
        .leftJoin(items, eq(orderItems.itemId, items.id))
        .where(eq(orderItems.orderId, id));

      return reply.send({ order: { ...order, customer, items: oi } });
    },
  );

  // ── Assigner un numéro RNBP ────────────────────────────────────

  app.patch(
    "/admin/orders/:id/items/:orderItemId/assign",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id, orderItemId } = request.params as {
        id: string;
        orderItemId: string;
      };
      const { rnbpNumber } = z
        .object({ rnbpNumber: rnbpNumberSchema })
        .parse(request.body);

      const db = getDb();

      // Vérifier que l'orderItem existe et appartient à cette commande
      const [oi] = await db
        .select()
        .from(orderItems)
        .where(
          and(eq(orderItems.id, orderItemId), eq(orderItems.orderId, id)),
        )
        .limit(1);

      if (!oi) throw notFound("Ligne de commande introuvable");

      if (!oi.itemId) {
        throw badRequest("Impossible d'assigner un numéro RNBP : le bien associé a été supprimé");
      }

      // Vérifier unicité du numéro RNBP
      const [existingItem] = await db
        .select({ id: items.id })
        .from(items)
        .where(eq(items.rnbpNumber, rnbpNumber))
        .limit(1);

      if (existingItem) {
        throw badRequest("Ce numéro RNBP est déjà assigné à un autre bien");
      }

      // Transaction atomique : mettre à jour orderItem ET item
      await db.transaction(async (tx) => {
        await tx
          .update(orderItems)
          .set({ rnbpNumber })
          .where(eq(orderItems.id, orderItemId));

        await tx
          .update(items)
          .set({ rnbpNumber, updatedAt: new Date() })
          .where(eq(items.id, oi.itemId!));
      });

      return reply.send({ success: true, rnbpNumber });
    },
  );

  // ── Marquer comme expédié ──────────────────────────────────────

  app.patch(
    "/admin/orders/:id/ship",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const db = getDb();

      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id))
        .limit(1);

      if (!order) throw notFound("Commande introuvable");
      if (order.status !== "paid") {
        throw badRequest("Seules les commandes payées peuvent être expédiées");
      }

      // Vérifier que tous les items ont un numéro RNBP assigné
      const oi = await db
        .select({ rnbpNumber: orderItems.rnbpNumber })
        .from(orderItems)
        .where(eq(orderItems.orderId, id));

      const unassigned = oi.filter((i) => !i.rnbpNumber);
      if (unassigned.length > 0) {
        throw badRequest(
          `${unassigned.length} article(s) n'ont pas de numéro RNBP assigné`,
        );
      }

      const [updated] = await db
        .update(orders)
        .set({ status: "shipped", updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();

      return reply.send({ order: updated });
    },
  );
}
