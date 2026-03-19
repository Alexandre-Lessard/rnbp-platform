import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../utils/password.js";

describe("hashPassword / verifyPassword", () => {
  it("round-trip: hash then verify returns true", async () => {
    const hash = await hashPassword("MyP@ssw0rd!");
    const valid = await verifyPassword(hash, "MyP@ssw0rd!");
    expect(valid).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await hashPassword("MyP@ssw0rd!");
    const valid = await verifyPassword(hash, "WrongPassword");
    expect(valid).toBe(false);
  });

  it("produces different hashes for same input (salted)", async () => {
    const hash1 = await hashPassword("SamePassword");
    const hash2 = await hashPassword("SamePassword");
    expect(hash1).not.toBe(hash2);
  });
});
