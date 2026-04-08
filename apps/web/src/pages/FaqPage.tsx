import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { useLanguage } from "@/i18n/context";

export function FaqPage() {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--rcb-bg)]">
      
        <title>{t.pages.faq.title}</title>
        <meta name="description" content={t.pages.faq.description} />
      
      <div className="section-shell py-16 sm:py-20">
        <FaqAccordion items={t.faq.items} headingLevel="h1" />
      </div>
    </section>
  );
}
export default FaqPage;
