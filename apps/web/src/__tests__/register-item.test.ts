import { describe, expect, it } from "vitest";
import {
  buildCreateItemInput,
  isValidEstimatedValue,
  isValidRegistrationYear,
  sanitizeItemDraft,
  type ItemFormData,
} from "@/lib/register-item";

const emptyItem: ItemFormData = {
  name: "",
  category: "",
  brand: "",
  model: "",
  year: "",
  serialNumber: "",
  trackerId: "",
  estimatedValue: "",
  description: "",
};

describe("register-item helpers", () => {
  it("builds a valid create-item payload from form strings", () => {
    const result = buildCreateItemInput({
      name: "  Vélo cargo  ",
      category: "velo-electrique",
      brand: "  Tern ",
      model: " GSD ",
      year: "2024",
      serialNumber: " SN123 ",
      trackerId: "  AIRTAG-XYZ  ",
      estimatedValue: "4200",
      description: "  Noir mat ",
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      name: "Vélo cargo",
      category: "velo-electrique",
      brand: "Tern",
      model: "GSD",
      year: 2024,
      serialNumber: "SN123",
      trackerId: "AIRTAG-XYZ",
      estimatedValue: 4200,
      description: "Noir mat",
    });
  });

  it("sanitizes stale draft categories back to an empty selection", () => {
    const draft = sanitizeItemDraft({
      name: "Item",
      category: "ancienne-categorie-invalide",
      estimatedValue: "1500",
    }, emptyItem);

    expect(draft.name).toBe("Item");
    expect(draft.category).toBe("");
    expect(draft.estimatedValue).toBe("1500");
  });

  it("rejects decimal years and estimated values before submit", () => {
    expect(isValidRegistrationYear("2024.5")).toBe(false);
    expect(isValidEstimatedValue("1250.50")).toBe(false);
  });
});
