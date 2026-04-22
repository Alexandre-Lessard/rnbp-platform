import { useLanguage } from "@/i18n/context";

export function PrivacyPolicyPage() {
  const { t } = useLanguage();
  const legal = t.legal!;

  return (
    <section className="min-h-[70vh] bg-[var(--rcb-bg)]">
      <title>{t.pages.privacy.title}</title>
      <meta name="description" content={t.pages.privacy.description} />
      <div className="section-shell py-16">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
          {legal.privacyHeading}
        </h1>
        <div className="mt-10 max-w-3xl space-y-8">
          {legal.privacyContent.map((section, i) => (
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
      </div>
    </section>
  );
}
export default PrivacyPolicyPage;
