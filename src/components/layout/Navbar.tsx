import { useState } from "react";
import { ChevronDown } from "@/components/icons/ChevronDown";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/i18n/context";

export function Navbar() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--rcb-header)]/95 backdrop-blur">
      <div className="section-shell flex min-h-20 items-center justify-between gap-6 py-3">
        <a href="#accueil" className="shrink-0">
          <img src="/assets/logo-texte.png" alt={t.a11y.logoAlt} className="h-10" />
        </a>

        <nav aria-label={t.a11y.mainNav} className="hidden items-center gap-9 text-[1.1rem] font-medium text-[var(--rcb-text-strong)] lg:flex">
          {t.nav.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 transition-colors hover:text-[var(--rcb-primary)]"
            >
              {item.label}
              {item.withChevron ? <ChevronDown /> : null}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Button variant="outline" size="sm" className="w-[120px] text-center">{t.nav.partners}</Button>
          <Button variant="primary" size="sm" className="w-[120px] text-center">{t.nav.login}</Button>
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
            {t.nav.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-border)]"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 border-t border-[var(--rcb-border)] pt-4">
              <div className="flex items-center px-4">
                <LanguageSwitcher />
              </div>
              <div className="mt-4 flex flex-col gap-2 px-4">
                <Button variant="outline" size="sm" className="w-full">{t.nav.partners}</Button>
                <Button variant="primary" size="sm" className="w-full">{t.nav.login}</Button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
