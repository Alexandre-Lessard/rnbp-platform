import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/context";

export function TermsOfServicePage() {
  const { t } = useLanguage();
  const legal = t.legal!;

  return (
    <section className="section-shell py-16">
      <Helmet>
        <title>{t.pages.terms.title}</title>
        <meta name="description" content={t.pages.terms.description} />
      </Helmet>
      <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
        {legal.termsHeading}
      </h1>
      <div className="mt-10 max-w-3xl space-y-8">
        {legal.termsContent.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-[var(--rcb-text-strong)]">
              {section.title}
            </h2>
            <p className="mt-2 leading-relaxed text-[var(--rcb-text-body)]">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
