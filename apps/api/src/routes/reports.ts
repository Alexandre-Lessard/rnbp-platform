import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { createReportSchema } from "@rcbp/shared";
import { getDb } from "../db/client.js";
import { theftReports, items } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { notFound, forbidden, badRequest } from "../utils/errors.js";

export async function reportRoutes(app: FastifyInstance) {
  // ── Create theft report ──────────────────────────────────────────

  app.post(
    "/reports",
    { preHandler: requireAuth },
    async (request, reply) => {
      const body = createReportSchema.parse(request.body);
      const db = getDb();

      // Verify item exists and belongs to user
      const [item] = await db
        .select({ ownerId: items.ownerId, status: items.status })
        .from(items)
        .where(eq(items.id, body.itemId))
        .limit(1);

      if (!item) throw notFound("Bien introuvable");
      if (item.ownerId !== request.userId!) throw forbidden();
      if (item.status === "stolen") {
        throw badRequest("Ce bien est déjà déclaré volé");
      }

      // Create report and update item status atomically
      const result = await db.transaction(async (tx) => {
        const [report] = await tx
          .insert(theftReports)
          .values({
            itemId: body.itemId,
            reporterId: request.userId!,
            policeReportNumber: body.policeReportNumber ?? null,
            theftDate: body.theftDate ? new Date(body.theftDate) : null,
            theftLocation: body.theftLocation ?? null,
            description: body.description ?? null,
          })
          .returning();

        await tx
          .update(items)
          .set({ status: "stolen", updatedAt: new Date() })
          .where(eq(items.id, body.itemId));

        return report;
      });

      return reply.status(201).send({ report: result });
    },
  );

  // ── List user's reports ──────────────────────────────────────────

  app.get(
    "/reports",
    { preHandler: requireAuth },
    async (request, reply) => {
      const db = getDb();

      const reports = await db
        .select()
        .from(theftReports)
        .where(eq(theftReports.reporterId, request.userId!))
        .orderBy(theftReports.createdAt);

      return reply.send({ reports });
    },
  );
}
