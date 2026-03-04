import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/tokens.js";
import { getDb } from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { unauthorized } from "../utils/errors.js";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function requireAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw unauthorized("Token manquant");
  }

  const token = header.slice(7);

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    throw unauthorized("Token invalide ou expiré");
  }

  if (payload.type !== "access") {
    throw unauthorized("Type de token invalide");
  }

  // Check user exists and token wasn't globally revoked
  const db = getDb();
  const [user] = await db
    .select({
      id: users.id,
      tokenRevokedBefore: users.tokenRevokedBefore,
    })
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

  request.userId = user.id;
}
