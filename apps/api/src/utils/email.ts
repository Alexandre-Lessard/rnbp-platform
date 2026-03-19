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

// ── HTML sanitization ─────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Contact notification ──────────────────────────────────────────────

export function buildContactNotificationEmail(
  name: string,
  email: string,
  company: string | undefined,
  type: string,
  message: string,
): EmailPayload {
  const config = getConfig();
  const adminEmail =
    config.ADMIN_CONTACT_EMAIL ||
    (config.NODE_ENV === "production" ? "info@rnbp.ca" : "dev@rnbp.ca");

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : "—";
  const safeType = escapeHtml(type);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return {
    to: adminEmail,
    subject: `Nouveau message partenaire — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nouveau message de contact partenaire</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold;">Nom</td><td style="padding: 8px 0;">${safeName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Courriel</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Entreprise</td><td style="padding: 8px 0;">${safeCompany}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Type</td><td style="padding: 8px 0;">${safeType}</td></tr>
        </table>
        <h3 style="margin-top: 24px;">Message</h3>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${safeMessage}</div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 12px;">RNBP — Formulaire de contact partenaires</p>
      </div>
    `,
  };
}

// ── Order admin notification ──────────────────────────────────────────

export function buildOrderNotificationEmail(opts: {
  orderId: string;
  email: string;
  totalAmountCents: number;
  taxAmountCents: number;
  quantity: number;
  productLines: { name: string; quantity: number; amountCents: number }[];
  shippingName: string | null;
  shippingAddress: string | null;
}): EmailPayload {
  const config = getConfig();
  const adminEmail =
    config.ADMIN_ORDER_EMAIL ||
    (config.NODE_ENV === "production" ? "commandes@rnbp.ca" : "dev@rnbp.ca");

  const total = (opts.totalAmountCents / 100).toFixed(2);
  const tax = (opts.taxAmountCents / 100).toFixed(2);
  const subtotal = ((opts.totalAmountCents - opts.taxAmountCents) / 100).toFixed(2);
  const safeEmail = escapeHtml(opts.email);
  const safeName = opts.shippingName ? escapeHtml(opts.shippingName) : "—";

  let addressHtml = "—";
  if (opts.shippingAddress) {
    try {
      const addr = JSON.parse(opts.shippingAddress);
      addressHtml = escapeHtml(
        [addr.line1, addr.line2, `${addr.city}, ${addr.state} ${addr.postal_code}`, addr.country]
          .filter(Boolean)
          .join(", "),
      );
    } catch {
      addressHtml = escapeHtml(opts.shippingAddress);
    }
  }

  // Product line items
  const productRowsHtml = opts.productLines
    .map(
      (p) =>
        `<tr><td style="padding: 6px 0;">${escapeHtml(p.name)}</td><td style="padding: 6px 0; text-align: center;">×${p.quantity}</td><td style="padding: 6px 0; text-align: right;">${(p.amountCents / 100).toFixed(2)} $</td></tr>`,
    )
    .join("");

  // Tax numbers (placeholders — replace when available)
  const TPS_NUMBER = "XXXXX XXXX RT0001"; // TODO: replace with actual GST number
  const TVQ_NUMBER = "XXXX XXXX XXXX TQ0001"; // TODO: replace with actual QST number

  return {
    to: adminEmail,
    subject: `Nouvelle commande #${opts.orderId.slice(0, 8)} — ${total} $ CAD`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2e44;">Nouvelle commande reçue</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold;">Commande</td><td style="padding: 8px 0;">${escapeHtml(opts.orderId)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Client</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        </table>

        <h3 style="margin-top: 20px; font-size: 14px; color: #1a2e44;">Produits</h3>
        <table style="width: 100%; border-collapse: collapse; border-top: 1px solid #eee;">
          ${productRowsHtml}
          <tr style="border-top: 1px solid #eee;"><td style="padding: 6px 0; font-weight: bold;" colspan="2">Sous-total</td><td style="padding: 6px 0; text-align: right;">${subtotal} $</td></tr>
          <tr><td style="padding: 6px 0; color: #666;" colspan="2">Taxes (TPS/TVQ)</td><td style="padding: 6px 0; text-align: right; color: #666;">${tax} $</td></tr>
          <tr style="border-top: 2px solid #1a2e44;"><td style="padding: 8px 0; font-weight: bold; font-size: 16px;" colspan="2">Total</td><td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 16px;">${total} $ CAD</td></tr>
        </table>

        <h3 style="margin-top: 20px; font-size: 14px; color: #1a2e44;">Livraison</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 120px;">Nom</td><td style="padding: 6px 0;">${safeName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Adresse</td><td style="padding: 6px 0;">${addressHtml}</td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 11px;">TPS : ${TPS_NUMBER} | TVQ : ${TVQ_NUMBER}</p>
        <p style="color: #888; font-size: 12px;">RNBP — Notification automatique de commande</p>
      </div>
    `,
  };
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
    subject: "Vérifiez votre adresse courriel — RNBP",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bonjour ${firstName},</h2>
        <p>Merci de vous être inscrit au RNBP. Veuillez vérifier votre adresse courriel en cliquant sur le lien ci-dessous :</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background-color: #1a2e44; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Vérifier mon courriel
          </a>
        </p>
        <p>Ce lien expire dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, ignorez ce courriel.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 12px;">RNBP — Registre canadien des biens personnels</p>
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
    subject: "Réinitialisation de mot de passe — RNBP",
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
        <p style="color: #888; font-size: 12px;">RNBP — Registre canadien des biens personnels</p>
      </div>
    `,
  };
}
