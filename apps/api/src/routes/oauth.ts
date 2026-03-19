import type { FastifyInstance } from "fastify";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { users, sessions } from "../db/schema.js";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
} from "../utils/tokens.js";
import { badRequest } from "../utils/errors.js";
import { generateClientNumber } from "../utils/client-number.js";
import { getConfig } from "../config.js";
import { TOKEN_EXPIRY } from "../constants/time.js";
import {
  sendEmail,
  buildVerificationEmail,
  createSignedToken as createEmailToken,
} from "../utils/email.js";
import {
  exchangeGoogleCode,
  exchangeMicrosoftCode,
  type OAuthProfile,
} from "../utils/oauth.js";

// ── Schemas Zod ──────────────────────────────────────────────────────

const oauthCodeSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().url(),
  codeVerifier: z.string().min(43),
});

const oauthCompleteSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
});

// ── HMAC token pour le flow "email manquant" ─────────────────────────

const OAUTH_PENDING_EXPIRY = 5 * 60 * 1000; // 5 minutes

function createOAuthPendingToken(data: {
  provider: string;
  providerId: string;
  firstName: string;
  lastName: string;
}): string {
  const config = getConfig();
  const expiresAt = Date.now() + OAUTH_PENDING_EXPIRY;
  const nonce = randomBytes(16).toString("hex");
  const payload = JSON.stringify(data);
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sigData = `${payloadB64}.${expiresAt}.${nonce}.oauth-pending`;
  const signature = createHmac("sha256", config.JWT_PRIVATE_KEY)
    .update(sigData)
    .digest("hex");
  return `${payloadB64}.${expiresAt}.${nonce}.${signature}`;
}

function verifyOAuthPendingToken(token: string): {
  provider: string;
  providerId: string;
  firstName: string;
  lastName: string;
} | null {
  const config = getConfig();
  const parts = token.split(".");
  if (parts.length !== 4) return null;

  const [payloadB64, expiresAtStr, nonce, signature] = parts;
  const expiresAt = Number(expiresAtStr);

  if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

  const sigData = `${payloadB64}.${expiresAt}.${nonce}.oauth-pending`;
  const expected = createHmac("sha256", config.JWT_PRIVATE_KEY)
    .update(sigData)
    .digest("hex");

  // Timing-safe comparison
  const a = Buffer.from(signature!, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(payloadB64!, "base64url").toString());
  } catch {
    return null;
  }
}

// ── Logique commune OAuth ────────────────────────────────────────────

type OAuthProvider = "google" | "microsoft";

const providerIdColumn = {
  google: "googleId",
  microsoft: "microsoftId",
} as const;

async function handleOAuthLogin(
  provider: OAuthProvider,
  profile: OAuthProfile,
  deviceInfo: string | null,
) {
  const db = getDb();
  const idCol = providerIdColumn[provider];

  // Si pas d'email, retourner un token pending
  if (!profile.email) {
    const pendingToken = createOAuthPendingToken({
      provider,
      providerId: profile.providerId,
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
    return {
      needsEmail: true as const,
      pendingToken,
    };
  }

  const email = profile.email.toLowerCase();

  // Chercher par providerId
  const [byProvider] = await db
    .select()
    .from(users)
    .where(eq(users[idCol], profile.providerId))
    .limit(1);

  let user = byProvider;

  if (!user) {
    // Chercher par email
    const [byEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (byEmail) {
      // Lier le provider au compte existant
      await db
        .update(users)
        .set({
          [idCol]: profile.providerId,
          emailVerified: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, byEmail.id));
      user = { ...byEmail, [idCol]: profile.providerId, emailVerified: true };
    } else {
      // Créer un nouveau compte
      const clientNumber = await generateClientNumber();
      const [created] = await db
        .insert(users)
        .values({
          email,
          passwordHash: null,
          firstName: profile.firstName,
          lastName: profile.lastName,
          emailVerified: profile.emailVerified,
          clientNumber,
          [idCol]: profile.providerId,
        })
        .returning();
      user = created;
    }
  }

  // Émettre les tokens
  const accessToken = await signAccessToken(user!.id);
  const refreshToken = await signRefreshToken(user!.id);

  await db.insert(sessions).values({
    userId: user!.id,
    tokenHash: hashToken(refreshToken),
    deviceInfo,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY.SESSION),
  });

  return {
    needsEmail: false as const,
    user: {
      id: user!.id,
      email: user!.email,
      firstName: user!.firstName,
      lastName: user!.lastName,
      phone: user!.phone,
      emailVerified: user!.emailVerified,
      isAdmin: user!.isAdmin,
      clientNumber: user!.clientNumber,
      createdAt: user!.createdAt.toISOString(),
    },
    accessToken,
    refreshToken,
  };
}

// ── Routes ───────────────────────────────────────────────────────────

export async function oauthRoutes(app: FastifyInstance) {
  // POST /auth/google
  app.post(
    "/auth/google",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const body = oauthCodeSchema.parse(request.body);
      const profile = await exchangeGoogleCode(
        body.code,
        body.redirectUri,
        body.codeVerifier,
      );

      const result = await handleOAuthLogin(
        "google",
        profile,
        request.headers["user-agent"] || null,
      );

      if (result.needsEmail) {
        return reply.send({
          needsEmail: true,
          pendingToken: result.pendingToken,
        });
      }

      return reply.send({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    },
  );

  // POST /auth/microsoft
  app.post(
    "/auth/microsoft",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const body = oauthCodeSchema.parse(request.body);
      const profile = await exchangeMicrosoftCode(
        body.code,
        body.redirectUri,
        body.codeVerifier,
      );

      const result = await handleOAuthLogin(
        "microsoft",
        profile,
        request.headers["user-agent"] || null,
      );

      if (result.needsEmail) {
        return reply.send({
          needsEmail: true,
          pendingToken: result.pendingToken,
        });
      }

      return reply.send({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    },
  );

  // POST /auth/oauth-complete (email manquant)
  app.post(
    "/auth/oauth-complete",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const body = oauthCompleteSchema.parse(request.body);

      const pending = verifyOAuthPendingToken(body.token);
      if (!pending) {
        throw badRequest("Token OAuth invalide ou expiré");
      }

      const provider = pending.provider as OAuthProvider;
      const profile: OAuthProfile = {
        providerId: pending.providerId,
        email: body.email,
        firstName: pending.firstName,
        lastName: pending.lastName,
        emailVerified: false, // Email saisi manuellement → pas vérifié
      };

      const result = await handleOAuthLogin(
        provider,
        profile,
        request.headers["user-agent"] || null,
      );

      if (result.needsEmail) {
        throw badRequest("Erreur inattendue");
      }

      // Envoyer un courriel de vérification (email saisi manuellement)
      const config = getConfig();
      const verifyTokenStr = createEmailToken(
        result.user.id,
        "verify-email",
        TOKEN_EXPIRY.EMAIL_VERIFICATION,
      );
      const verifyUrl = `${config.FRONTEND_URL}/verify-email?token=${verifyTokenStr}`;
      sendEmail(
        buildVerificationEmail(result.user.firstName, result.user.email, verifyUrl),
      ).catch((err) => {
        app.log.error(err, "Failed to send verification email after OAuth complete");
      });

      return reply.send({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    },
  );
}
