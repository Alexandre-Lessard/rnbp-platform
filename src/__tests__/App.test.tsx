import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { LanguageProvider } from "@/i18n/context";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
