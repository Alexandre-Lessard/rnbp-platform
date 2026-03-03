import { useLanguage } from "@/i18n/context";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[var(--rcb-header)]">
      <div className="section-shell py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <a href="#accueil" className="inline-block">
              <img src="/assets/logo-acronyme.png" alt={t.a11y.logoAlt} className="h-10" />
            </a>
            <nav aria-label={t.a11y.mainNav} className="mt-8 flex flex-wrap gap-8 text-sm font-medium text-[var(--rcb-text-strong)]">
              {t.nav.items
                .filter((item) => !item.withChevron)
                .map((item) => (
                  <a key={item.href} href={item.href}>
                    {item.label}
                  </a>
                ))}
            </nav>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[var(--rcb-text-strong)]">{t.footer.subscribeHeading}</h3>
            <form
              className="mt-5 flex flex-col gap-4 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="h-11 w-full border-b border-[var(--rcb-border-muted)] bg-transparent px-1 text-lg text-[var(--rcb-text-body)] placeholder:text-[var(--rcb-text-light)] focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-5 text-sm font-semibold text-[var(--rcb-text-strong)] transition-colors hover:bg-[var(--rcb-surface)]"
              >
                {t.footer.sendButton}
              </button>
            </form>
            <p className="mt-4 text-sm text-[var(--rcb-text-muted)]">
              {t.footer.disclaimer}
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--rcb-border)] pt-8 text-sm text-[var(--rcb-text-body)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              <span className="cursor-not-allowed opacity-50">{t.footer.privacyPolicy}</span>
              <span className="cursor-not-allowed opacity-50">{t.footer.termsOfUse}</span>
              <span className="cursor-not-allowed opacity-50">{t.footer.cookieSettings}</span>
            </div>
            <p>{t.footer.copyright.replace("{{year}}", String(year))}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
