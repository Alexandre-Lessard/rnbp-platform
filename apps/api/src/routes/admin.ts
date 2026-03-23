import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, and, desc, asc } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { orders, orderItems, items, users, products } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  INVALID_RNBP_FORMAT,
  ORDER_NOT_FOUND,
  ORDER_LINE_NOT_FOUND,
  ITEM_DELETED,
  RNBP_NUMBER_TAKEN,
  ORDER_NOT_PAID,
  UNASSIGNED_ITEMS,
  PRODUCT_NOT_FOUND,
} from "@rnbp/shared";
import { AppError } from "../utils/errors.js";

const rnbpNumberSchema = z
  .string()
  .regex(/^RNBP-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/, "Invalid format (RNBP-XXXXXXXX)");

export async function adminRoutes(app: FastifyInstance) {
  // ── List orders ────────────────────────────────────────────────

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

      // For each order, fetch order items with item info
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

  // ── Order detail ──────────────────────────────────────────────

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

      if (!order) throw new AppError(404, ORDER_NOT_FOUND, "Order not found");

      // Fetch the user if present
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

  // ── Assign an RNBP number ──────────────────────────────────────

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

      // Verify the orderItem exists and belongs to this order
      const [oi] = await db
        .select()
        .from(orderItems)
        .where(
          and(eq(orderItems.id, orderItemId), eq(orderItems.orderId, id)),
        )
        .limit(1);

      if (!oi) throw new AppError(404, ORDER_LINE_NOT_FOUND, "Order line not found");

      if (!oi.itemId) {
        throw new AppError(400, ITEM_DELETED, "Cannot assign RNBP number: associated item was deleted");
      }

      // Verify RNBP number uniqueness
      const [existingItem] = await db
        .select({ id: items.id })
        .from(items)
        .where(eq(items.rnbpNumber, rnbpNumber))
        .limit(1);

      if (existingItem) {
        throw new AppError(400, RNBP_NUMBER_TAKEN, "This RNBP number is already assigned to another item");
      }

      // Atomic transaction: update orderItem AND item
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

  // ── Mark as shipped ───────────────────────────────────────────

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

      if (!order) throw new AppError(404, ORDER_NOT_FOUND, "Order not found");
      if (order.status !== "paid") {
        throw new AppError(400, ORDER_NOT_PAID, "Only paid orders can be shipped");
      }

      // Verify all items have an RNBP number assigned
      const oi = await db
        .select({ rnbpNumber: orderItems.rnbpNumber })
        .from(orderItems)
        .where(eq(orderItems.orderId, id));

      const unassigned = oi.filter((i) => !i.rnbpNumber);
      if (unassigned.length > 0) {
        throw new AppError(
          400,
          UNASSIGNED_ITEMS,
          `${unassigned.length} item(s) do not have an RNBP number assigned`,
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

  // ── List all products ───────────────────────────────────────────

  app.get(
    "/admin/products",
    { preHandler: requireAdmin },
    async (_request, reply) => {
      const db = getDb();
      const allProducts = await db
        .select()
        .from(products)
        .orderBy(asc(products.sortOrder));

      return reply.send({ products: allProducts });
    },
  );

  // ── Product detail ──────────────────────────────────────────────

  app.get(
    "/admin/products/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const db = getDb();

      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);

      if (!product) {
        throw new AppError(404, PRODUCT_NOT_FOUND, "Product not found");
      }

      return reply.send({ product });
    },
  );

  // ── Create product ──────────────────────────────────────────────

  const createProductSchema = z.object({
    slug: z.string().min(1).max(100),
    nameFr: z.string().min(1).max(255),
    nameEn: z.string().min(1).max(255),
    descriptionFr: z.string().optional(),
    descriptionEn: z.string().optional(),
    featuresFr: z.array(z.string()).optional(),
    featuresEn: z.array(z.string()).optional(),
    priceCents: z.number().int().min(0),
    stripePriceId: z.string().optional(),
    imageUrl: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  });

  app.post(
    "/admin/products",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const body = createProductSchema.parse(request.body);
      const db = getDb();

      const [product] = await db
        .insert(products)
        .values({
          ...body,
          // Force these values — not user-configurable on creation
          customMechanic: null,
          requiresItem: false,
        })
        .returning();

      return reply.status(201).send({ product });
    },
  );

  // ── Update product ──────────────────────────────────────────────

  const updateProductSchema = z.object({
    slug: z.string().min(1).max(100).optional(),
    nameFr: z.string().min(1).max(255).optional(),
    nameEn: z.string().min(1).max(255).optional(),
    descriptionFr: z.string().nullable().optional(),
    descriptionEn: z.string().nullable().optional(),
    featuresFr: z.array(z.string()).nullable().optional(),
    featuresEn: z.array(z.string()).nullable().optional(),
    priceCents: z.number().int().min(0).optional(),
    stripePriceId: z.string().nullable().optional(),
    imageUrl: z.string().max(500).nullable().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  });

  app.patch(
    "/admin/products/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = updateProductSchema.parse(request.body);
      const db = getDb();

      // Verify product exists
      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.id, id))
        .limit(1);

      if (!existing) {
        throw new AppError(404, PRODUCT_NOT_FOUND, "Product not found");
      }

      // customMechanic and requiresItem are not modifiable
      const [updated] = await db
        .update(products)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      return reply.send({ product: updated });
    },
  );
}
