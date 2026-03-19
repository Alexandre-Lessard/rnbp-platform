import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import App from "@/App";
import { LanguageProvider } from "@/i18n/context";
import { AuthProvider } from "@/lib/auth-context";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <HelmetProvider>
        <LanguageProvider>
          <MemoryRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </MemoryRouter>
        </LanguageProvider>
      </HelmetProvider>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
