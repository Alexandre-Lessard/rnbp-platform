import { ChevronDown } from "@/components/icons/ChevronDown";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/context";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="accueil" className="section-frame scroll-mt-28 border-t-0 bg-[var(--rcb-bg)]">
      <div className="section-shell grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-20">
        <div className="animate-rise">
          <p className="text-4xl font-medium leading-tight text-[var(--rcb-text)] sm:text-5xl">
            {t.hero.subtitleLine1}
          </p>
          <h1 className="mt-2 text-7xl font-bold leading-[0.95] text-[var(--rcb-primary)] sm:text-8xl">
            {t.hero.titleLine1}
          </h1>

          <p className="mt-8 border-l-2 border-[var(--rcb-primary)] pl-4 text-4xl text-[var(--rcb-text)] sm:text-[2.2rem]">
            {t.hero.tagline}
          </p>

          <p className="mt-8 max-w-xl text-2xl leading-relaxed text-[var(--rcb-text-muted)]">
            {t.hero.description}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button>{t.buttons.registerItem}</Button>
            <Button variant="outline">{t.buttons.declareStolen}</Button>
          </div>
          <p className="mt-4 text-lg font-medium text-[var(--rcb-primary)]">
            {t.hero.freeLabel}
          </p>
          <p className="mt-1 text-lg text-[var(--rcb-text-muted)]">
            {t.hero.insurancePromo}
          </p>
        </div>

        <div className="relative mx-auto flex w-full max-w-[700px] items-center justify-center">
          <img
            src="/assets/hero-shield-check.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-5 -right-5 w-[210px] opacity-90 sm:-top-10 sm:-right-10 sm:w-[420px]"
          />
          <img
            src="/assets/hero-items.png"
            alt={t.hero.imageAlt}
            className="relative z-10 w-full drop-shadow-[0_30px_40px_rgba(16,25,40,0.2)]"
          />
        </div>
      </div>

      <div className="border-t border-[var(--rcb-border-muted)] bg-[var(--rcb-surface)]">
        <div className="section-shell py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {t.hero.trustBadges.map((badge, i) => {
              const icons = [
                <svg key="db" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" /></svg>,
                <svg key="lock" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
                <svg key="shield" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
                <svg key="building" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14" /><path d="M9 9h1m-1 4h1m3-4h1m-1 4h1" /></svg>,
              ];
              return (
                <span key={badge.label} className="flex items-center gap-2 text-sm font-medium text-[var(--rcb-text-muted)]">
                  <span className="text-[var(--rcb-primary)]">{icons[i]}</span>
                  {badge.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative h-14 border-t border-[var(--rcb-border-muted)]">
        <a
          href="#cycle"
          className="absolute left-1/2 top-[-1px] flex h-[49px] w-[98px] -translate-x-1/2 items-start justify-center rounded-b-full border border-t-0 border-[var(--rcb-border-muted)] bg-[var(--rcb-bg)] text-[var(--rcb-text)] transition-colors hover:text-[var(--rcb-primary)]"
        >
          <ChevronDown className="-mt-1 h-9 w-14" />
        </a>
      </div>
    </section>
  );
}
