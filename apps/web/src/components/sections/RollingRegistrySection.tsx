import { useLanguage } from "@/i18n/context";

export function RollingRegistrySection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--rcb-surface)]">
      <div className="section-shell py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="text-left">
            <h2 className="text-6xl font-bold leading-tight text-[var(--rcb-text)] sm:text-7xl">
              {t.rollingRegistry.headingLine1}
              <br />
              {t.rollingRegistry.headingLine2}
            </h2>
            <p className="mt-6 max-w-3xl text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
              {t.rollingRegistry.description}
            </p>
            <p className="mt-6 text-2xl font-semibold text-[var(--rcb-text-strong)]">
              {t.rollingRegistry.tagline}
            </p>
            <a
              href="#all-categories"
              className="mt-6 inline-block text-2xl font-semibold underline"
            >
              {t.rollingRegistry.viewCategoriesLink} &gt;
            </a>
          </div>

          <div className="mx-auto w-full max-w-[760px]">
            <img
              src="/assets/rcdb-registry-visual.webp"
              alt={t.rollingRegistry.imageAlt}
              width={1536}
              height={1024}
              loading="lazy"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
