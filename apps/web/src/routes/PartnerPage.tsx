import { useLanguage } from "@/i18n/context";

export function PartnerPage() {
  const { t } = useLanguage();
  const p = t.partners!;

  return (
    <section className="min-h-[70vh] bg-[var(--rcb-white)]">
      <div className="section-shell py-16">
      <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
        {p.heading}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--rcb-text-muted)]">
        {p.description}
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-[var(--rcb-text-strong)]">
        {p.whyPartner}
      </h2>
      <ul className="mt-6 max-w-3xl space-y-4">
        {p.benefits.map((benefit, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[var(--rcb-text-body)]"
          >
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--rcb-primary)] text-xs font-bold text-white">
              {i + 1}
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <div className="mt-16 rounded-2xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-8 lg:p-12">
        <h2 className="text-2xl font-semibold text-[var(--rcb-text-strong)]">
          {p.ctaHeading}
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--rcb-text-muted)]">
          {p.ctaDescription}
        </p>
        <a
          href={`mailto:${p.contactEmail}`}
          className="mt-6 inline-block rounded-xl bg-[var(--rcb-primary)] px-8 py-3 font-medium text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
        >
          {p.ctaButton}
        </a>
      </div>
      </div>
    </section>
  );
}
