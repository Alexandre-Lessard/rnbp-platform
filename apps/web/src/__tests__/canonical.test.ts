import { describe, expect, it } from "vitest";
import { canonicalUrl, normalizePath } from "@/lib/canonical";

describe("normalizePath", () => {
  it("keeps the root as is", () => {
    expect(normalizePath("/")).toBe("/");
  });

  it("drops a trailing slash", () => {
    expect(normalizePath("/register/")).toBe("/register");
  });

  it("leaves a path without a trailing slash untouched", () => {
    expect(normalizePath("/c/BID-ABCDEFGH")).toBe("/c/BID-ABCDEFGH");
  });
});

describe("canonicalUrl", () => {
  it("points the root at the brand origin with its slash", () => {
    expect(canonicalUrl("/")).toBe("https://rnbp.ca/");
  });

  it("gives the slashed and unslashed forms the same canonical", () => {
    expect(canonicalUrl("/register/")).toBe("https://rnbp.ca/register");
    expect(canonicalUrl("/register")).toBe("https://rnbp.ca/register");
  });

  it("never contains a placeholder", () => {
    expect(canonicalUrl("/shop")).not.toContain("{{");
  });
});
