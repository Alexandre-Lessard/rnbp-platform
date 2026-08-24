import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { initPixel, track } from "@/lib/pixel";
import { hasConsent } from "@/lib/consent";

/**
 * Wires the pixel to the router. Renders nothing.
 *
 * A single-page app changes URL without reloading, so Meta never sees the
 * navigation on its own — each route change has to be reported explicitly, or
 * every visit looks like a single page view.
 */
export function PixelTracker() {
  const location = useLocation();

  useEffect(() => initPixel(), []);

  // initPixel already sent the first PageView, so the first run of this effect
  // is skipped. Without the guard the landing page counts twice, and every
  // funnel built on it is wrong from the first step.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!hasConsent("advertising")) return;
    track("PageView");
    // Only the path matters — a query string change is not a new page.
  }, [location.pathname]);

  return null;
}
