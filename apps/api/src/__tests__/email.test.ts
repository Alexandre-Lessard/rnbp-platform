import { describe, it, expect } from "vitest";
import { loadConfig } from "../config.js";
import { createSignedToken, verifySignedToken } from "../utils/email.js";

// Load config from .env.test
loadConfig();

describe("createSignedToken / verifySignedToken", () => {
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  it("round-trip: create then verify returns the userId", () => {
    const token = createSignedToken(userId, "verify-email", 60_000);
    const result = verifySignedToken(token, "verify-email");
    expect(result).toBe(userId);
  });

  it("rejects expired tokens", () => {
    const token = createSignedToken(userId, "verify-email", -1);
    const result = verifySignedToken(token, "verify-email");
    expect(result).toBeNull();
  });

  it("rejects wrong purpose", () => {
    const token = createSignedToken(userId, "verify-email", 60_000);
    const result = verifySignedToken(token, "reset-password");
    expect(result).toBeNull();
  });

  it("rejects tampered token", () => {
    const token = createSignedToken(userId, "verify-email", 60_000);
    const parts = token.split(".");
    // Tamper with the signature
    parts[3] = parts[3]!.replace(/^./, "f");
    const tampered = parts.join(".");
    const result = verifySignedToken(tampered, "verify-email");
    expect(result).toBeNull();
  });

  it("rejects malformed token (wrong number of parts)", () => {
    const result = verifySignedToken("a.b.c", "verify-email");
    expect(result).toBeNull();
  });

  it("rejects token with non-numeric expiry", () => {
    const result = verifySignedToken("uuid.notanumber.nonce.sig", "verify-email");
    expect(result).toBeNull();
  });
});
