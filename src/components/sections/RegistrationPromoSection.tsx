import { useLanguage } from "@/i18n/context";

export function RegistrationPromoSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--rcb-bg)]">
      <div className="section-shell py-16 sm:py-20">
        <article className="mx-auto grid max-w-6xl items-stretch overflow-hidden rounded-[2.4rem] bg-[var(--rcb-bg)] lg:grid-cols-[340px_1fr]">
          <img
            src="/assets/promo-protect.png"
            alt={t.registrationPromo.imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-16">
            <h2 className="text-6xl font-bold leading-tight text-[var(--rcb-text)] sm:text-7xl">
              {t.registrationPromo.headingLine1}
              <br />
              {t.registrationPromo.headingLine2}
            </h2>
            <p className="mt-7 max-w-2xl text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
              {t.registrationPromo.description}
            </p>
            <a href="#inscription" className="mt-10 text-2xl font-semibold text-[var(--rcb-text-strong)]">
              {t.registrationPromo.linkText} &gt;
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
