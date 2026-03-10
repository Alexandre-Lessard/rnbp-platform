import { useState } from "react";
import { Link, useLocation } from "react-router";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/i18n/context";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { getButtonClasses } from "@/lib/button-styles";

export function Navbar() {
  const { t, locale } = useLanguage();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-[var(--rcb-header)]/95 backdrop-blur">
      <div className="section-shell flex min-h-20 items-center justify-between gap-6 py-3">
        <Link to="/" className="shrink-0">
          <img src={`/assets/logo-texte-${locale}.png`} alt={t.a11y.logoAlt} className="h-10" />
        </Link>

        <nav aria-label={t.a11y.mainNav} className="hidden items-center gap-9 text-base font-medium text-[var(--rcb-text-strong)] lg:flex">
          {t.nav.items.map((item) => {
            const isHash = item.href.startsWith("#");
            const cls = "flex items-center justify-center gap-1 min-w-[4rem] transition-colors hover:text-[var(--rcb-primary)]";
            if (isHash && isLanding) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cls}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.label}
                to={isHash ? `/${item.href}` : item.href}
                className={cls}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            to="/boutique"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-border)] hover:text-[var(--rcb-primary)]"
            aria-label={t.shop?.heading ?? "Boutique"}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--rcb-primary)] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/tableau-de-bord" className={getButtonClasses("primary", "sm", "whitespace-nowrap text-center")}>
                {t.nav.myAccount}
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[var(--rcb-text-muted)] transition-colors hover:bg-[var(--rcb-border)] hover:text-[var(--rcb-primary)]"
                aria-label={t.nav.logout}
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <Link to="/connexion" className={getButtonClasses("primary", "sm", "whitespace-nowrap text-center")}>
              {t.nav.login}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-border)] lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label={t.a11y.mobileNav}
          className="border-t border-[var(--rcb-border)] bg-[var(--rcb-header)] lg:hidden"
        >
          <div className="section-shell flex flex-col gap-1 py-4">
            {t.nav.items.map((item) => {
              const isHash = item.href.startsWith("#");
              if (isHash && isLanding) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-border)]"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={isHash ? `/${item.href}` : item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-border)]"
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-[var(--rcb-border)] pt-4">
              <div className="flex items-center px-4">
                <LanguageSwitcher />
              </div>
              <div className="mt-4 flex flex-col gap-2 px-4">
                <Link
                  to="/boutique"
                  onClick={() => setMenuOpen(false)}
                  className={getButtonClasses("outline", "sm", "w-full")}
                >
                  {t.shop?.heading ?? "Boutique"}
                  {cartCount > 0 && ` (${cartCount})`}
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/tableau-de-bord"
                      onClick={() => setMenuOpen(false)}
                      className={getButtonClasses("primary", "sm", "w-full")}
                    >
                      {t.nav.myAccount}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-primary)]"
                    >
                      {t.nav.logout}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/connexion"
                    onClick={() => setMenuOpen(false)}
                    className={getButtonClasses("primary", "sm", "w-full")}
                  >
                    {t.nav.login}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
