import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { registerSchema, createItemSchema } from "@rnbp/shared";
import { getDb } from "../db/client.js";
import { users, items, sessions } from "../db/schema.js";
import { hashPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, hashToken } from "../utils/tokens.js";
import { generateRnbpNumber } from "../utils/rnbp-number.js";
import { conflict } from "../utils/errors.js";
import {
  sendEmail,
  createSignedToken,
  buildVerificationEmail,
} from "../utils/email.js";
import { getConfig } from "../config.js";
import { TOKEN_EXPIRY } from "../constants/time.js";

const registerWithItemSchema = z.object({
  account: registerSchema,
  item: createItemSchema,
});

export async function registerWithItemRoutes(app: FastifyInstance) {
  app.post("/auth/register-with-item", async (request, reply) => {
    const body = registerWithItemSchema.parse(request.body);
    const db = getDb();

    const passwordHash = await hashPassword(body.account.password);
    const rnbpNumber = generateRnbpNumber();

    // Atomic transaction: check uniqueness + create user + item (prevents TOCTOU)
    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, body.account.email.toLowerCase()))
        .limit(1);

      if (existing) {
        throw conflict("Un compte avec cette adresse courriel existe déjà");
      }

      const [user] = await tx
        .insert(users)
        .values({
          email: body.account.email.toLowerCase(),
          passwordHash,
          firstName: body.account.firstName,
          lastName: body.account.lastName,
          phone: body.account.phone ?? null,
        })
        .returning({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          emailVerified: users.emailVerified,
          createdAt: users.createdAt,
        });

      const [item] = await tx
        .insert(items)
        .values({
          ownerId: user.id,
          name: body.item.name,
          description: body.item.description ?? null,
          category: body.item.category,
          brand: body.item.brand ?? null,
          model: body.item.model ?? null,
          year: body.item.year ?? null,
          serialNumber: body.item.serialNumber ?? null,
          estimatedValue: body.item.estimatedValue ?? null,
          purchaseDate: body.item.purchaseDate
            ? new Date(body.item.purchaseDate)
            : null,
          rnbpNumber,
        })
        .returning();

      return { user, item };
    });

    const accessToken = await signAccessToken(result.user.id);
    const refreshToken = await signRefreshToken(result.user.id);

    await db.insert(sessions).values({
      userId: result.user.id,
      tokenHash: hashToken(refreshToken),
      deviceInfo: request.headers["user-agent"] || null,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY.SESSION),
    });

    // Send verification email (fire & forget)
    const config = getConfig();
    const verifyToken = createSignedToken(result.user.id, "verify-email", TOKEN_EXPIRY.EMAIL_VERIFICATION);
    const verifyUrl = `${config.FRONTEND_URL}/verifier-courriel?token=${verifyToken}`;
    sendEmail(buildVerificationEmail(result.user.firstName, result.user.email, verifyUrl)).catch((err) => {
      app.log.error(err, "Failed to send verification email");
    });

    return reply.status(201).send({
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        phone: result.user.phone,
        emailVerified: result.user.emailVerified,
        createdAt: result.user.createdAt.toISOString(),
      },
      item: result.item,
      accessToken,
      refreshToken,
    });
  });
}
