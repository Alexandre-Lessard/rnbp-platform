import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, and, desc, asc, sql, count, sum, inArray } from "drizzle-orm";
import os from "node:os";
import { getDb } from "../db/client.js";
import {
  orders,
  orderItems,
  items,
  users,
  products,
  theftReports,
  newsletterSubscribers,
} from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";
import { verifyToken } from "../utils/tokens.js";
import { getRequestsPerMinute } from "../utils/request-counter.js";
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
          unitPriceCents: orderItems.unitPriceCents,
          itemName: items.name,
          itemCategory: items.category,
          itemBrand: items.brand,
          itemModel: items.model,
          itemRnbpNumber: items.rnbpNumber,
          productSlug: products.slug,
          productNameFr: products.nameFr,
          productNameEn: products.nameEn,
          customMechanic: products.customMechanic,
        })
        .from(orderItems)
        .leftJoin(items, eq(orderItems.itemId, items.id))
        .leftJoin(products, eq(orderItems.productId, products.id))
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

      // Only items linked to a product with customMechanic = 'item-linked-stickers' need RNBP numbers.
      // Products without customMechanic (e.g., door stickers) ship without RNBP assignment.
      const oi = await db
        .select({
          rnbpNumber: orderItems.rnbpNumber,
          customMechanic: products.customMechanic,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, id));

      const unassigned = oi.filter(
        (i) => i.customMechanic === "item-linked-stickers" && !i.rnbpNumber,
      );
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

  // ── Aggregated stats ────────────────────────────────────────────

  app.get(
    "/admin/stats",
    { preHandler: requireAdmin },
    async (_request, reply) => {
      const db = getDb();

      const paidShipped = ["paid", "shipped"] as const;

      const [
        [{ totalUsers }],
        [{ verifiedUsers }],
        [{ totalItems }],
        [{ totalEstimatedValue }],
        [{ totalOrders }],
        [{ totalRevenue }],
        [{ activeTheftReports }],
        [{ newsletterCount }],
        itemsByCategory,
        itemsByStatus,
      ] = await Promise.all([
        db.select({ totalUsers: count() }).from(users),
        db
          .select({ verifiedUsers: count() })
          .from(users)
          .where(eq(users.emailVerified, true)),
        db.select({ totalItems: count() }).from(items),
        db
          .select({
            totalEstimatedValue: sum(items.estimatedValue),
          })
          .from(items),
        db
          .select({ totalOrders: count() })
          .from(orders)
          .where(inArray(orders.status, [...paidShipped])),
        db
          .select({ totalRevenue: sum(orders.totalAmountCents) })
          .from(orders)
          .where(inArray(orders.status, [...paidShipped])),
        db
          .select({ activeTheftReports: count() })
          .from(theftReports)
          .where(
            inArray(theftReports.status, ["pending", "confirmed"]),
          ),
        db.select({ newsletterCount: count() }).from(newsletterSubscribers),
        db
          .select({
            category: items.category,
            count: count(),
          })
          .from(items)
          .groupBy(items.category),
        db
          .select({
            status: items.status,
            count: count(),
          })
          .from(items)
          .groupBy(items.status),
      ]);

      return reply.send({
        totalUsers,
        verifiedUsers,
        totalItems,
        totalEstimatedValue: Number(totalEstimatedValue) || 0,
        totalOrders,
        totalRevenue: Number(totalRevenue) || 0,
        activeTheftReports,
        newsletterSubscribers: newsletterCount,
        itemsByCategory,
        itemsByStatus,
      });
    },
  );

  // ── Chart time series ───────────────────────────────────────────

  const periodSchema = z.enum(["day", "week", "month"]).default("day");

  app.get(
    "/admin/stats/charts",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { period } = request.query as { period?: string };
      const validPeriod = periodSchema.parse(period);

      const db = getDb();

      // Determine how far back to look
      const daysBack = validPeriod === "day" ? 30 : validPeriod === "week" ? 90 : 365;
      const since = new Date();
      since.setDate(since.getDate() - daysBack);

      const [registrations, itemSeries, revenue] = await Promise.all([
        db.execute(sql`
          SELECT date_trunc(${validPeriod}, created_at) AS date, COUNT(*)::int AS count
          FROM users
          WHERE created_at >= ${since}
          GROUP BY date
          ORDER BY date
        `),
        db.execute(sql`
          SELECT date_trunc(${validPeriod}, created_at) AS date, COUNT(*)::int AS count
          FROM items
          WHERE created_at >= ${since}
          GROUP BY date
          ORDER BY date
        `),
        db.execute(sql`
          SELECT date_trunc(${validPeriod}, created_at) AS date,
                 COALESCE(SUM(total_amount_cents), 0)::int AS amount
          FROM orders
          WHERE created_at >= ${since}
            AND status IN ('paid', 'shipped')
          GROUP BY date
          ORDER BY date
        `),
      ]);

      return reply.send({
        registrations,
        items: itemSeries,
        revenue,
      });
    },
  );

  // ── Live metrics (SSE) ──────────────────────────────────────────

  // Shared metrics cache — one collection interval for all connections
  let metricsCache: Record<string, unknown> = {};
  let metricsInterval: ReturnType<typeof setInterval> | null = null;
  let sseConnectionCount = 0;

  async function collectMetrics() {
    const db = getDb();

    let dbSize = 0;
    let dbConnections = 0;
    try {
      const [sizeResult, connResult] = await Promise.all([
        db.execute(sql`SELECT pg_database_size(current_database()) AS size`),
        db.execute(sql`SELECT COUNT(*)::int AS count FROM pg_stat_activity`),
      ]);
      dbSize = Number((sizeResult as any)[0]?.size) || 0;
      dbConnections = Number((connResult as any)[0]?.count) || 0;
    } catch {
      // DB queries may fail transiently; keep previous values
    }

    const mem = process.memoryUsage();

    metricsCache = {
      cpu: os.loadavg()[0],
      cpuCount: os.cpus().length,
      memTotal: os.totalmem(),
      memFree: os.freemem(),
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      rss: mem.rss,
      external: mem.external,
      uptime: process.uptime(),
      osUptime: os.uptime(),
      dbSize,
      dbConnections,
      reqPerMin: getRequestsPerMinute(),
    };
  }

  function startMetricsCollection() {
    if (metricsInterval) return;
    // Collect immediately, then every 2s
    collectMetrics();
    metricsInterval = setInterval(collectMetrics, 2000);
  }

  function stopMetricsCollection() {
    if (metricsInterval && sseConnectionCount <= 0) {
      clearInterval(metricsInterval);
      metricsInterval = null;
    }
  }

  app.get("/admin/metrics/live", async (request, reply) => {
    // Auth via query param
    const { token } = request.query as { token?: string };
    if (!token) {
      return reply.status(401).send({ error: "Missing token" });
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return reply.status(401).send({ error: "Invalid or expired token" });
    }

    if (payload.type !== "access") {
      return reply.status(401).send({ error: "Invalid token type" });
    }

    // Verify the user is admin
    const db = getDb();
    const [user] = await db
      .select({ id: users.id, isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || !user.isAdmin) {
      return reply.status(403).send({ error: "Admin access required" });
    }

    // SSE headers
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    sseConnectionCount++;
    startMetricsCollection();

    // Write cached metrics every 2 seconds to this connection
    const writeInterval = setInterval(() => {
      try {
        reply.raw.write(`data: ${JSON.stringify(metricsCache)}\n\n`);
      } catch {
        clearInterval(writeInterval);
      }
    }, 2000);

    // Clean up on disconnect
    request.raw.on("close", () => {
      clearInterval(writeInterval);
      sseConnectionCount--;
      stopMetricsCollection();
    });
  });

  // ── Activity feed ───────────────────────────────────────────────

  app.get(
    "/admin/activity",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { limit: limitParam } = request.query as { limit?: string };
      const feedLimit = Math.min(Math.max(Number(limitParam) || 20, 1), 100);

      const db = getDb();

      const [recentUsers, recentItems, recentOrders, recentThefts] =
        await Promise.all([
          db
            .select({
              id: users.id,
              firstName: users.firstName,
              lastName: users.lastName,
              createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(desc(users.createdAt))
            .limit(feedLimit),
          db
            .select({
              id: items.id,
              name: items.name,
              createdAt: items.createdAt,
            })
            .from(items)
            .orderBy(desc(items.createdAt))
            .limit(feedLimit),
          db
            .select({
              id: orders.id,
              email: orders.email,
              totalAmountCents: orders.totalAmountCents,
              updatedAt: orders.updatedAt,
            })
            .from(orders)
            .where(inArray(orders.status, ["paid", "shipped"]))
            .orderBy(desc(orders.updatedAt))
            .limit(feedLimit),
          db
            .select({
              id: theftReports.id,
              itemId: theftReports.itemId,
              createdAt: theftReports.createdAt,
            })
            .from(theftReports)
            .orderBy(desc(theftReports.createdAt))
            .limit(feedLimit),
        ]);

      // Merge into a single sorted array
      const activity = [
        ...recentUsers.map((u) => ({
          type: "user" as const,
          date: u.createdAt.toISOString(),
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
        })),
        ...recentItems.map((i) => ({
          type: "item" as const,
          date: i.createdAt.toISOString(),
          id: i.id,
          name: i.name,
        })),
        ...recentOrders.map((o) => ({
          type: "order" as const,
          date: o.updatedAt.toISOString(),
          id: o.id,
          email: o.email,
          totalAmountCents: o.totalAmountCents,
        })),
        ...recentThefts.map((t) => ({
          type: "theft" as const,
          date: t.createdAt.toISOString(),
          id: t.id,
          itemId: t.itemId,
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, feedLimit);

      return reply.send({ activity });
    },
  );
}
