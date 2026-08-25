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
              {/* A blank line in the translation starts a new paragraph. The
                  cookie section runs long enough that one wall of text would
                  bury the part people actually need to find. */}
              {section.body.split("\n\n").map((paragraph, j) => (
                <p key={j} className="mt-2 leading-relaxed text-[var(--rcb-text-body)]">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default PrivacyPolicyPage;
