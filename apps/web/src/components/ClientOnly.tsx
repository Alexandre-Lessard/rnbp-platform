import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders children only after client-side mount. Used to prevent hydration
 * mismatches for components that depend on browser-only state (localStorage,
 * window, auth state from sessionStorage, cart state, etc.).
 *
 * Provide a `fallback` with the same dimensions as the real content to avoid
 * layout shift when the component swaps after mount.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  // Intentional: this is the canonical "mark as hydrated" pattern. The single
  // re-render after mount is the entire purpose of the component.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
