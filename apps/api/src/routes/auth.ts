import type { FastifyInstance } from "fastify";
import { eq, and, gt } from "drizzle-orm";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@rnbp/shared";
import { getDb } from "../db/client.js";
import { users, sessions } from "../db/schema.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  hashToken,
} from "../utils/tokens.js";
import { conflict, unauthorized, badRequest } from "../utils/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { generateClientNumber } from "../utils/client-number.js";
import {
  sendEmail,
  createSignedToken,
  verifySignedToken,
  buildVerificationEmail,
  buildResetEmail,
} from "../utils/email.js";
import { getConfig } from "../config.js";
import { TOKEN_EXPIRY } from "../constants/time.js";

export async function authRoutes(app: FastifyInstance) {
  // ── Register ───────────────────────────────────────────────────────

  app.post("/auth/register", {
    config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const db = getDb();
    const passwordHash = await hashPassword(body.password);

    // Atomic check-and-insert to prevent TOCTOU race condition
    const user = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, body.email.toLowerCase()))
        .limit(1);

      if (existing) {
        throw conflict("Un compte avec cette adresse courriel existe déjà");
      }

      const clientNumber = await generateClientNumber(tx);

      const [created] = await tx
        .insert(users)
        .values({
          email: body.email.toLowerCase(),
          passwordHash,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone ?? null,
          clientNumber,
        })
        .returning({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          emailVerified: users.emailVerified,
          isAdmin: users.isAdmin,
          clientNumber: users.clientNumber,
          createdAt: users.createdAt,
        });

      return created;
    });

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    await db.insert(sessions).values({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      deviceInfo: request.headers["user-agent"] || null,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY.SESSION),
    });

    // Send verification email (fire & forget)
    const config = getConfig();
    const verifyTokenStr = createSignedToken(user.id, "verify-email", TOKEN_EXPIRY.EMAIL_VERIFICATION);
    const verifyUrl = `${config.FRONTEND_URL}/verify-email?token=${verifyTokenStr}`;
    sendEmail(buildVerificationEmail(user.firstName, user.email, verifyUrl)).catch((err) => {
      app.log.error(err, "Failed to send verification email");
    });

    return reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isAdmin: user.isAdmin,
        clientNumber: user.clientNumber,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken,
      refreshToken,
    });
  });

  // ── Login ──────────────────────────────────────────────────────────

  app.post("/auth/login", {
    config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const db = getDb();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email.toLowerCase()))
      .limit(1);

    if (!user) {
      throw unauthorized("Courriel ou mot de passe incorrect");
    }

    const valid = await verifyPassword(user.passwordHash, body.password);
    if (!valid) {
      throw unauthorized("Courriel ou mot de passe incorrect");
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    await db.insert(sessions).values({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      deviceInfo: request.headers["user-agent"] || null,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY.SESSION),
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isAdmin: user.isAdmin,
        clientNumber: user.clientNumber,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken,
      refreshToken,
    });
  });

  // ── Refresh ────────────────────────────────────────────────────────

  app.post("/auth/refresh", {
    config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken?: string };
    if (!refreshToken) {
      throw badRequest("Refresh token requis");
    }

    let payload;
    try {
      payload = await verifyToken(refreshToken);
    } catch {
      throw unauthorized("Refresh token invalide ou expiré");
    }

    if (payload.type !== "refresh") {
      throw unauthorized("Type de token invalide");
    }

    const db = getDb();
    const tokenH = hashToken(refreshToken);

    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.tokenHash, tokenH),
          eq(sessions.userId, payload.sub),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!session) {
      throw unauthorized("Session introuvable ou expirée");
    }

    await db.delete(sessions).where(eq(sessions.id, session.id));

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user) {
      throw unauthorized("Utilisateur introuvable");
    }

    if (user.tokenRevokedBefore) {
      const tokenIssuedAt = new Date(payload.iat * 1000);
      if (tokenIssuedAt < user.tokenRevokedBefore) {
        throw unauthorized("Token révoqué. Veuillez vous reconnecter.");
      }
    }

    const newAccessToken = await signAccessToken(user.id);
    const newRefreshToken = await signRefreshToken(user.id);

    await db.insert(sessions).values({
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
      deviceInfo: request.headers["user-agent"] || null,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY.SESSION),
    });

    return reply.send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  // ── Logout ─────────────────────────────────────────────────────────

  app.post(
    "/auth/logout",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { refreshToken } = request.body as { refreshToken?: string };
      const db = getDb();

      if (refreshToken) {
        await db
          .delete(sessions)
          .where(eq(sessions.tokenHash, hashToken(refreshToken)));
      } else {
        await db
          .delete(sessions)
          .where(eq(sessions.userId, request.userId!));
      }

      return reply.send({ message: "Déconnexion réussie" });
    },
  );

  // ── Me ─────────────────────────────────────────────────────────────

  app.get(
    "/auth/me",
    { preHandler: requireAuth },
    async (request, reply) => {
      const db = getDb();
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          emailVerified: users.emailVerified,
          isAdmin: users.isAdmin,
          clientNumber: users.clientNumber,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, request.userId!))
        .limit(1);

      if (!user) {
        throw unauthorized("Utilisateur introuvable");
      }

      return reply.send({
        user: { ...user, createdAt: user.createdAt.toISOString() },
      });
    },
  );

  // ── Forgot Password ────────────────────────────────────────────────

  app.post("/auth/forgot-password", {
    config: { rateLimit: { max: 3, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const body = forgotPasswordSchema.parse(request.body);
    const db = getDb();
    const config = getConfig();

    const [user] = await db
      .select({ id: users.id, firstName: users.firstName })
      .from(users)
      .where(eq(users.email, body.email.toLowerCase()))
      .limit(1);

    if (user) {
      const token = createSignedToken(user.id, "reset-password", TOKEN_EXPIRY.PASSWORD_RESET);
      const resetUrl = `${config.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
      sendEmail(buildResetEmail(user.firstName, body.email.toLowerCase(), resetUrl)).catch((err) => {
        app.log.error(err, "Failed to send password reset email");
      });
    }

    return reply.send({
      message:
        "Si un compte existe avec cette adresse, un courriel de réinitialisation a été envoyé.",
    });
  });

  // ── Reset Password ─────────────────────────────────────────────────

  app.post("/auth/reset-password", {
    config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const body = resetPasswordSchema.parse(request.body);

    const userId = verifySignedToken(body.token, "reset-password");
    if (!userId) {
      throw badRequest("Lien de réinitialisation invalide ou expiré");
    }

    const db = getDb();
    const passwordHash = await hashPassword(body.password);

    await db
      .update(users)
      .set({ passwordHash, tokenRevokedBefore: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));

    await db.delete(sessions).where(eq(sessions.userId, userId));

    return reply.send({
      message: "Mot de passe réinitialisé avec succès. Veuillez vous reconnecter.",
    });
  });

  // ── Verify Email ──────────────────────────────────────────────────

  app.post("/auth/verify-email", {
    config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const { token } = request.body as { token?: string };
    if (!token) {
      throw badRequest("Token requis");
    }

    const userId = verifySignedToken(token, "verify-email");
    if (!userId) {
      throw badRequest("Lien de vérification invalide ou expiré");
    }

    const db = getDb();
    await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return reply.send({ message: "Adresse courriel vérifiée avec succès." });
  });

  // ── Resend Verification Email ─────────────────────────────────────

  app.post(
    "/auth/resend-verification",
    { preHandler: requireAuth, config: { rateLimit: { max: 3, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const db = getDb();
      const config = getConfig();

      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          emailVerified: users.emailVerified,
        })
        .from(users)
        .where(eq(users.id, request.userId!))
        .limit(1);

      if (!user) {
        throw unauthorized("Utilisateur introuvable");
      }

      if (user.emailVerified) {
        return reply.send({ message: "Courriel déjà vérifié." });
      }

      const token = createSignedToken(user.id, "verify-email", TOKEN_EXPIRY.EMAIL_VERIFICATION);
      const verifyUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;
      await sendEmail(buildVerificationEmail(user.firstName, user.email, verifyUrl));

      return reply.send({ message: "Courriel de vérification envoyé." });
    },
  );
}
