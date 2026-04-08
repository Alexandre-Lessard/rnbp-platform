import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Scrolls to the top on route change, or smooth-scrolls to a hash anchor
 * if present. Complements RR7's <ScrollRestoration /> which only handles
 * back/forward scroll position restoration.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
