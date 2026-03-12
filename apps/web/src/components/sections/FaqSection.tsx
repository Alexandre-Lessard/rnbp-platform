import { Link } from "react-router";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";
import { ROUTES } from "@/routes/routes";

const PREVIEW_COUNT = 3;

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="section-frame scroll-mt-24 border-t-0 border-b-0 bg-[var(--rcb-bg)]">
      <div className="section-shell py-16 sm:py-20">
        <FaqAccordion items={t.faq.items.slice(0, PREVIEW_COUNT)} headingLevel="h2" />

        <div className="mt-10 text-center">
          <Link to={ROUTES.faq} className={getButtonClasses("primary")}>
            {t.faq.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
