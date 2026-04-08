import { useLanguage } from "@/i18n/context";

export function AboutPage() {
  const { t } = useLanguage();
  const about = t.about!;

  return (
    <section className="section-shell py-16">
      
        <title>{t.pages.about?.title ?? about.heading}</title>
        <meta name="description" content={t.pages.about?.description ?? ""} />
      
      <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
        {about.heading}
      </h1>
      <div className="mt-10 max-w-3xl space-y-6">
        {about.paragraphs.map((paragraph, i) => (
          <p key={i} className="leading-relaxed text-[var(--rcb-text-body)]">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
export default AboutPage;
