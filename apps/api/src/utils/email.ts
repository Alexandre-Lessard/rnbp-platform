import { createHmac, randomBytes } from "node:crypto";
import { getConfig } from "../config.js";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Send transactional email via Brevo (SendinBlue) HTTP API.
 * Falls back to console logging in dev if no API key is configured.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const config = getConfig();

  if (!config.BREVO_API_KEY) {
    console.log("[email] No BREVO_API_KEY — logging email instead:");
    console.log(`  To: ${payload.to}`);
    console.log(`  Subject: ${payload.subject}`);
    console.log(`  Body: ${payload.html}`);
    return;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": config.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: config.FROM_EMAIL, name: config.FROM_NAME },
      to: [{ email: payload.to }],
      subject: payload.subject,
      htmlContent: payload.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${text}`);
  }
}

// ── HMAC token helpers ────────────────────────────────────────────────

/**
 * Create an HMAC-signed token for email verification or password reset.
 * Format: `userId.expiresAt.randomNonce.signature`
 */
export function createSignedToken(
  userId: string,
  purpose: "verify-email" | "reset-password",
  expiresInMs: number,
): string {
  const config = getConfig();
  const expiresAt = Date.now() + expiresInMs;
  const nonce = randomBytes(16).toString("hex");
  const data = `${userId}.${expiresAt}.${nonce}.${purpose}`;
  const signature = createHmac("sha256", config.JWT_PRIVATE_KEY)
    .update(data)
    .digest("hex");
  return `${userId}.${expiresAt}.${nonce}.${signature}`;
}

/**
 * Verify an HMAC-signed token. Returns the userId if valid, null otherwise.
 */
export function verifySignedToken(
  token: string,
  purpose: "verify-email" | "reset-password",
): string | null {
  const config = getConfig();
  const parts = token.split(".");
  if (parts.length !== 4) return null;

  const [userId, expiresAtStr, nonce, signature] = parts;
  const expiresAt = Number(expiresAtStr);

  if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

  const data = `${userId}.${expiresAt}.${nonce}.${purpose}`;
  const expected = createHmac("sha256", config.JWT_PRIVATE_KEY)
    .update(data)
    .digest("hex");

  // Timing-safe comparison
  if (signature.length !== expected.length) return null;
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return null;

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  if (diff !== 0) return null;

  return userId;
}

// ── Email templates ───────────────────────────────────────────────────

export function buildVerificationEmail(
  firstName: string,
  to: string,
  verifyUrl: string,
): EmailPayload {
  return {
    to,
    subject: "Vérifiez votre adresse courriel — RCBP",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bonjour ${firstName},</h2>
        <p>Merci de vous être inscrit au RCBP. Veuillez vérifier votre adresse courriel en cliquant sur le lien ci-dessous :</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background-color: #1a2e44; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Vérifier mon courriel
          </a>
        </p>
        <p>Ce lien expire dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, ignorez ce courriel.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 12px;">RCBP — Registre canadien des biens personnels</p>
      </div>
    `,
  };
}

export function buildResetEmail(
  firstName: string,
  to: string,
  resetUrl: string,
): EmailPayload {
  return {
    to,
    subject: "Réinitialisation de mot de passe — RCBP",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bonjour ${firstName},</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour le changer :</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #1a2e44; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez ce courriel.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 12px;">RCBP — Registre canadien des biens personnels</p>
      </div>
    `,
  };
}
