import { useState } from "react";
import { PlusMinus } from "@/components/icons/PlusMinus";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";

export function FaqSection() {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenItems((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <section id="faq" className="section-frame scroll-mt-24 border-t-0 bg-[var(--rcb-bg)]">
      <div className="section-shell py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-bold text-[var(--rcb-text)] sm:text-7xl">{t.faq.heading}</h2>
          <p className="mt-7 text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
            {t.faq.description}
          </p>
          <a
            href="#faq-list"
            className={`${getButtonClasses("primary")} mt-8`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("faq-list")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t.faq.buttonText}
          </a>
        </div>

        <div id="faq-list" className="mx-auto mt-14 max-w-6xl space-y-6">
          {t.faq.items.map((item, index) => {
            const isOpen = openItems.includes(index);

            return (
              <article key={item.question} className="rounded-2xl border border-[var(--rcb-border-muted)] bg-[var(--rcb-bg)] p-7">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-5 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-xl font-bold text-[var(--rcb-text)] sm:text-2xl">{item.question}</h3>
                  <span className="mt-1">
                    <PlusMinus open={isOpen} className="h-8 w-8 text-[var(--rcb-navy)]" />
                  </span>
                </button>
                {isOpen ? (
                  <p className="mt-4 max-w-5xl text-base leading-relaxed text-[var(--rcb-text-muted)] sm:text-lg">{item.answer}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
