import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/i18n/context";
import { InsuranceFormSection } from "@/components/sections/InsuranceFormSection";

describe("InsuranceFormSection", () => {
  it("syncs a featured insurer click with the dropdown and generated message", () => {
    localStorage.setItem("locale", "fr");

    render(
      <LanguageProvider>
        <InsuranceFormSection />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Intact Assurance" }));

    const select = screen.getByLabelText("Votre assureur") as HTMLSelectElement;
    expect(select.value).toBe("intact");

    const textarea = screen.getByLabelText("Message pré-rempli") as HTMLTextAreaElement;
    expect(textarea.value).toContain("Intact Assurance");
    expect(textarea.value).toContain("RNBP");
  });
});
