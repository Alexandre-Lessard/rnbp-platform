import { useState } from "react";
import { Link } from "react-router";
import { PlusMinus } from "@/components/icons/PlusMinus";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";

const PREVIEW_COUNT = 3;

export function FaqSection() {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenItems((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  const previewItems = t.faq.items.slice(0, PREVIEW_COUNT);

  return (
    <section id="faq" className="section-frame scroll-mt-24 border-t-0 border-b-0 bg-[var(--rcb-bg)]">
      <div className="section-shell py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-bold text-[var(--rcb-text)] sm:text-7xl">{t.faq.heading}</h2>
          <p className="mt-7 text-xl leading-relaxed text-[var(--rcb-text-muted)]">
            {t.faq.description}
          </p>
        </div>

        <div id="faq-list" className="mx-auto mt-14 max-w-6xl space-y-6">
          {previewItems.map((item, index) => {
            const isOpen = openItems.includes(index);

            return (
              <article key={item.question} className="rounded-2xl border border-[var(--rcb-border-muted)] border-l-4 border-l-[var(--rcb-primary)] bg-[var(--rcb-bg)] p-7">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-5 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-xl font-bold text-[var(--rcb-text)] sm:text-2xl">{item.question}</h3>
                  <span className="mt-1">
                    <PlusMinus open={isOpen} className="h-8 w-8 text-[var(--rcb-primary)]" />
                  </span>
                </button>
                {isOpen ? (
                  <div className="mt-4 max-w-5xl text-base leading-relaxed text-[var(--rcb-text-muted)] sm:text-lg">
                    {typeof item.answer === "string" ? (
                      <p>{item.answer}</p>
                    ) : (
                      <p>{item.answer.intro}</p>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link to="/faq" className={getButtonClasses("primary")}>
            {t.faq.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
