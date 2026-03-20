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
import {
  EMAIL_ALREADY_EXISTS,
  INVALID_CREDENTIALS,
  REFRESH_TOKEN_REQUIRED,
  TOKEN_INVALID,
  SESSION_NOT_FOUND,
  USER_NOT_FOUND,
  TOKEN_REVOKED,
  LOGOUT_SUCCESS,
  PASSWORD_RESET_SENT,
  RESET_LINK_INVALID,
  PASSWORD_RESET_SUCCESS,
  TOKEN_REQUIRED,
  VERIFY_LINK_INVALID,
  EMAIL_VERIFIED,
  EMAIL_ALREADY_VERIFIED,
  VERIFICATION_SENT,
} from "@rnbp/shared";
import { AppError } from "../utils/errors.js";
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
        throw new AppError(409, EMAIL_ALREADY_EXISTS, "An account with this email already exists");
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
          preferredLanguage: body.preferredLanguage ?? "fr",
          termsAcceptedAt: new Date(),
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
          preferredLanguage: users.preferredLanguage,
          termsAcceptedAt: users.termsAcceptedAt,
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
    const lang = (user.preferredLanguage as "fr" | "en") ?? "fr";
    const verifyTokenStr = createSignedToken(user.id, "verify-email", TOKEN_EXPIRY.EMAIL_VERIFICATION);
    const verifyUrl = `${config.FRONTEND_URL}/verify-email?token=${verifyTokenStr}`;
    sendEmail(buildVerificationEmail(user.firstName, user.email, verifyUrl, lang)).catch((err) => {
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
        preferredLanguage: user.preferredLanguage,
        termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
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
      throw new AppError(401, INVALID_CREDENTIALS, "Invalid email or password");
    }

    if (!user.passwordHash) {
      throw new AppError(401, "SOCIAL_ACCOUNT", "This account uses social login");
    }

    const valid = await verifyPassword(user.passwordHash, body.password);
    if (!valid) {
      throw new AppError(401, INVALID_CREDENTIALS, "Invalid email or password");
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
        preferredLanguage: user.preferredLanguage,
        termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
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
      throw new AppError(400, REFRESH_TOKEN_REQUIRED, "Refresh token required");
    }

    let payload;
    try {
      payload = await verifyToken(refreshToken);
    } catch {
      throw new AppError(401, TOKEN_INVALID, "Invalid or expired refresh token");
    }

    if (payload.type !== "refresh") {
      throw new AppError(401, TOKEN_INVALID, "Invalid token type");
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
      throw new AppError(401, SESSION_NOT_FOUND, "Session not found or expired");
    }

    await db.delete(sessions).where(eq(sessions.id, session.id));

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND, "User not found");
    }

    if (user.tokenRevokedBefore) {
      const tokenIssuedAt = new Date(payload.iat * 1000);
      if (tokenIssuedAt < user.tokenRevokedBefore) {
        throw new AppError(401, TOKEN_REVOKED, "Token revoked. Please sign in again.");
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

      return reply.send({ code: LOGOUT_SUCCESS, message: "Logged out successfully" });
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
          preferredLanguage: users.preferredLanguage,
          termsAcceptedAt: users.termsAcceptedAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, request.userId!))
        .limit(1);

      if (!user) {
        throw new AppError(401, USER_NOT_FOUND, "User not found");
      }

      return reply.send({
        user: {
          ...user,
          termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
          createdAt: user.createdAt.toISOString(),
        },
      });
    },
  );

  // ── Update Profile ─────────────────────────────────────────────────

  app.patch(
    "/auth/profile",
    { preHandler: requireAuth },
    async (request, reply) => {
      const body = request.body as { preferredLanguage?: string };
      const db = getDb();

      const updates: Record<string, unknown> = { updatedAt: new Date() };

      if (body.preferredLanguage && ["fr", "en"].includes(body.preferredLanguage)) {
        updates.preferredLanguage = body.preferredLanguage;
      }

      await db
        .update(users)
        .set(updates)
        .where(eq(users.id, request.userId!));

      return reply.send({ success: true });
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
      .select({ id: users.id, firstName: users.firstName, preferredLanguage: users.preferredLanguage })
      .from(users)
      .where(eq(users.email, body.email.toLowerCase()))
      .limit(1);

    if (user) {
      const lang = (user.preferredLanguage as "fr" | "en") ?? "fr";
      const token = createSignedToken(user.id, "reset-password", TOKEN_EXPIRY.PASSWORD_RESET);
      const resetUrl = `${config.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
      sendEmail(buildResetEmail(user.firstName, body.email.toLowerCase(), resetUrl, lang)).catch((err) => {
        app.log.error(err, "Failed to send password reset email");
      });
    }

    return reply.send({
      code: PASSWORD_RESET_SENT,
      message: "If an account exists with this email, a reset email has been sent.",
    });
  });

  // ── Reset Password ─────────────────────────────────────────────────

  app.post("/auth/reset-password", {
    config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const body = resetPasswordSchema.parse(request.body);

    const userId = verifySignedToken(body.token, "reset-password");
    if (!userId) {
      throw new AppError(400, RESET_LINK_INVALID, "Invalid or expired reset link");
    }

    const db = getDb();
    const passwordHash = await hashPassword(body.password);

    await db
      .update(users)
      .set({ passwordHash, tokenRevokedBefore: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));

    await db.delete(sessions).where(eq(sessions.userId, userId));

    return reply.send({
      code: PASSWORD_RESET_SUCCESS,
      message: "Password reset successfully. Please sign in again.",
    });
  });

  // ── Verify Email ──────────────────────────────────────────────────

  app.post("/auth/verify-email", {
    config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const { token } = request.body as { token?: string };
    if (!token) {
      throw new AppError(400, TOKEN_REQUIRED, "Token required");
    }

    const userId = verifySignedToken(token, "verify-email");
    if (!userId) {
      throw new AppError(400, VERIFY_LINK_INVALID, "Invalid or expired verification link");
    }

    const db = getDb();
    await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return reply.send({ code: EMAIL_VERIFIED, message: "Email verified successfully." });
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
          preferredLanguage: users.preferredLanguage,
        })
        .from(users)
        .where(eq(users.id, request.userId!))
        .limit(1);

      if (!user) {
        throw new AppError(401, USER_NOT_FOUND, "User not found");
      }

      if (user.emailVerified) {
        return reply.send({ code: EMAIL_ALREADY_VERIFIED, message: "Email already verified." });
      }

      const lang = (user.preferredLanguage as "fr" | "en") ?? "fr";
      const token = createSignedToken(user.id, "verify-email", TOKEN_EXPIRY.EMAIL_VERIFICATION);
      const verifyUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;
      await sendEmail(buildVerificationEmail(user.firstName, user.email, verifyUrl, lang));

      return reply.send({ code: VERIFICATION_SENT, message: "Verification email sent." });
    },
  );
}
