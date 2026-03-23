import type { FastifyInstance } from "fastify";
import { eq, and, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { createItemSchema, updateItemSchema, archiveItemSchema } from "@rnbp/shared";
import { getDb } from "../db/client.js";
import { items, itemPhotos, itemDocuments } from "../db/schema.js";
import { requireVerifiedEmail } from "../middleware/auth.js";
import { INVALID_ID, ITEM_NOT_FOUND, ITEM_ALREADY_STOLEN } from "@rnbp/shared";
import { AppError, forbidden } from "../utils/errors.js";

const uuidSchema = z.string().uuid("Invalid identifier");

export async function itemRoutes(app: FastifyInstance) {
  // ── List user's items ────────────────────────────────────────────

  app.get(
    "/items",
    { preHandler: requireVerifiedEmail },
    async (request, reply) => {
      const db = getDb();
      const { archived } = request.query as { archived?: string };

      const conditions = archived === "true"
        ? eq(items.ownerId, request.userId!)
        : and(eq(items.ownerId, request.userId!), isNull(items.archivedAt));

      const userItems = await db
        .select()
        .from(items)
        .where(conditions)
        .orderBy(items.createdAt);

      return reply.send({ items: userItems });
    },
  );

  // ── Create item ──────────────────────────────────────────────────

  app.post(
    "/items",
    { preHandler: requireVerifiedEmail },
    async (request, reply) => {
      const body = createItemSchema.parse(request.body);
      const db = getDb();

      const [item] = await db
        .insert(items)
        .values({
          ownerId: request.userId!,
          name: body.name,
          description: body.description ?? null,
          category: body.category,
          brand: body.brand ?? null,
          model: body.model ?? null,
          year: body.year ?? null,
          serialNumber: body.serialNumber ?? null,
          estimatedValue: body.estimatedValue ?? null,
          purchaseDate: body.purchaseDate
            ? new Date(body.purchaseDate)
            : null,
        })
        .returning();

      return reply.status(201).send({ item });
    },
  );

  // ── Get item by ID ───────────────────────────────────────────────

  app.get(
    "/items/:id",
    { preHandler: requireVerifiedEmail },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      uuidSchema.parse(id);
      const db = getDb();

      const [item] = await db
        .select()
        .from(items)
        .where(eq(items.id, id))
        .limit(1);

      if (!item) throw new AppError(404, ITEM_NOT_FOUND, "Item not found");
      if (item.ownerId !== request.userId!) throw forbidden();

      const photos = await db
        .select()
        .from(itemPhotos)
        .where(eq(itemPhotos.itemId, id));

      const documents = await db
        .select()
        .from(itemDocuments)
        .where(eq(itemDocuments.itemId, id));

      return reply.send({ item: { ...item, photos, documents } });
    },
  );

  // ── Update item ──────────────────────────────────────────────────

  app.patch(
    "/items/:id",
    { preHandler: requireVerifiedEmail },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      uuidSchema.parse(id);
      const body = updateItemSchema.parse(request.body);
      const db = getDb();

      const [existing] = await db
        .select({ ownerId: items.ownerId })
        .from(items)
        .where(eq(items.id, id))
        .limit(1);

      if (!existing) throw new AppError(404, ITEM_NOT_FOUND, "Item not found");
      if (existing.ownerId !== request.userId!) throw forbidden();

      const [updated] = await db
        .update(items)
        .set({
          ...body,
          purchaseDate: body.purchaseDate
            ? new Date(body.purchaseDate)
            : undefined,
          updatedAt: new Date(),
        })
        .where(eq(items.id, id))
        .returning();

      return reply.send({ item: updated });
    },
  );

  // ── Archive item ─────────────────────────────────────────────────

  app.post(
    "/items/:id/archive",
    { preHandler: requireVerifiedEmail },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      uuidSchema.parse(id);
      const body = archiveItemSchema.parse(request.body);
      const db = getDb();

      const [existing] = await db
        .select({ ownerId: items.ownerId, status: items.status, archivedAt: items.archivedAt })
        .from(items)
        .where(eq(items.id, id))
        .limit(1);

      if (!existing) throw new AppError(404, ITEM_NOT_FOUND, "Item not found");
      if (existing.ownerId !== request.userId!) throw forbidden();
      if (existing.status === "stolen") {
        throw new AppError(400, ITEM_ALREADY_STOLEN, "Cannot archive a stolen item");
      }
      if (existing.archivedAt) {
        throw new AppError(400, "ITEM_ALREADY_ARCHIVED", "Item is already archived");
      }

      const [updated] = await db
        .update(items)
        .set({
          archivedAt: new Date(),
          archiveReason: body.reason,
          archiveReasonCustom: body.reason === "other" ? body.customReason ?? null : null,
          updatedAt: new Date(),
        })
        .where(eq(items.id, id))
        .returning();

      return reply.send({ item: updated });
    },
  );

  // ── Delete item ──────────────────────────────────────────────────

  app.delete(
    "/items/:id",
    { preHandler: requireVerifiedEmail },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      uuidSchema.parse(id);
      const db = getDb();

      const [existing] = await db
        .select({ ownerId: items.ownerId })
        .from(items)
        .where(eq(items.id, id))
        .limit(1);

      if (!existing) throw new AppError(404, ITEM_NOT_FOUND, "Item not found");
      if (existing.ownerId !== request.userId!) throw forbidden();

      await db.delete(items).where(eq(items.id, id));

      return reply.status(204).send();
    },
  );

  // ── Public unified lookup (RNBP number or serial number) ─────────

  app.get("/lookup", {
    config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const { q } = request.query as { q?: string };
    if (!q || !q.trim()) {
      return reply.send({ found: false });
    }

    const db = getDb();
    const query = q.trim().toUpperCase();
    // Normalize: strip spaces, dashes, underscores for serial number comparison
    const normalized = query.replace(/[\s\-_]/g, "");

    const [item] = await db
      .select({
        status: items.status,
        category: items.category,
        brand: items.brand,
        model: items.model,
      })
      .from(items)
      .where(
        or(
          eq(items.rnbpNumber, query),
          sql`upper(replace(replace(replace(${items.serialNumber}, ' ', ''), '-', ''), '_', '')) = ${normalized}`,
        ),
      )
      .limit(1);

    if (!item) {
      return reply.send({ found: false });
    }

    return reply.send({
      found: true,
      status: item.status,
      category: item.category,
      brand: item.brand,
      model: item.model,
    });
  });

  // ── Public lookup by RNBP number (backward compat) ────────────

  app.get("/lookup/:rnbpNumber", {
    config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const { rnbpNumber } = request.params as { rnbpNumber: string };
    const db = getDb();

    const [item] = await db
      .select({
        status: items.status,
        category: items.category,
        brand: items.brand,
        model: items.model,
      })
      .from(items)
      .where(eq(items.rnbpNumber, rnbpNumber.toUpperCase()))
      .limit(1);

    if (!item) {
      return reply.send({ found: false });
    }

    return reply.send({
      found: true,
      status: item.status,
      category: item.category,
      brand: item.brand,
      model: item.model,
    });
  });
}
