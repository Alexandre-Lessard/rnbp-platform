import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createItemSchema, updateItemSchema } from "@rnbp/shared";
import { getDb } from "../db/client.js";
import { items, itemPhotos, itemDocuments } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { generateRnbpNumber } from "../utils/rnbp-number.js";
import { notFound, forbidden, badRequest } from "../utils/errors.js";

const uuidSchema = z.string().uuid("Identifiant invalide");

export async function itemRoutes(app: FastifyInstance) {
  // ── List user's items ────────────────────────────────────────────

  app.get(
    "/items",
    { preHandler: requireAuth },
    async (request, reply) => {
      const db = getDb();
      const userItems = await db
        .select()
        .from(items)
        .where(eq(items.ownerId, request.userId!))
        .orderBy(items.createdAt);

      return reply.send({ items: userItems });
    },
  );

  // ── Create item ──────────────────────────────────────────────────

  app.post(
    "/items",
    { preHandler: requireAuth },
    async (request, reply) => {
      const body = createItemSchema.parse(request.body);
      const db = getDb();

      const rnbpNumber = generateRnbpNumber();

      const [item] = await db
        .insert(items)
        .values({
          ownerId: request.userId!,
          name: body.name,
          description: body.description ?? null,
          category: body.category,
          brand: body.brand ?? null,
          model: body.model ?? null,
          serialNumber: body.serialNumber ?? null,
          estimatedValue: body.estimatedValue ?? null,
          purchaseDate: body.purchaseDate
            ? new Date(body.purchaseDate)
            : null,
          rnbpNumber,
        })
        .returning();

      return reply.status(201).send({ item });
    },
  );

  // ── Get item by ID ───────────────────────────────────────────────

  app.get(
    "/items/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      uuidSchema.parse(id);
      const db = getDb();

      const [item] = await db
        .select()
        .from(items)
        .where(eq(items.id, id))
        .limit(1);

      if (!item) throw notFound("Bien introuvable");
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
    { preHandler: requireAuth },
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

      if (!existing) throw notFound("Bien introuvable");
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

  // ── Delete item ──────────────────────────────────────────────────

  app.delete(
    "/items/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      uuidSchema.parse(id);
      const db = getDb();

      const [existing] = await db
        .select({ ownerId: items.ownerId })
        .from(items)
        .where(eq(items.id, id))
        .limit(1);

      if (!existing) throw notFound("Bien introuvable");
      if (existing.ownerId !== request.userId!) throw forbidden();

      await db.delete(items).where(eq(items.id, id));

      return reply.status(204).send();
    },
  );

  // ── Public lookup ────────────────────────────────────────────────

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
