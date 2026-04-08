import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import LandingPage from "@/pages/LandingPage";
import { LanguageProvider } from "@/i18n/context";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

describe("LandingPage", () => {
  it("renders without crashing", () => {
    const router = createMemoryRouter([{ path: "/", element: <LandingPage /> }]);
    render(
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>,
    );
    // LandingPage renders the hero h1 (semantic check that the page mounted)
    expect(document.querySelector("h1")).toBeInTheDocument();
  });
});
