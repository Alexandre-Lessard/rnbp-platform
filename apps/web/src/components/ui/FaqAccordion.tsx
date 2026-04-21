import { useState } from "react";
import { PlusMinus } from "@/components/icons/PlusMinus";
import { useLanguage } from "@/i18n/context";
import { renderBold } from "@/lib/render-bold";
import type { FaqItem } from "@/types/content";

type FaqAccordionProps = {
  items: FaqItem[];
  headingLevel: "h1" | "h2";
  heading?: string;
  description?: string;
};

export function FaqAccordion({
  items,
  headingLevel,
  heading,
  description,
}: FaqAccordionProps) {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenItems((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  const Heading = headingLevel;
  const QuestionTag = headingLevel === "h2" ? "h3" : "h2";

  const headingClass =
    headingLevel === "h2"
      ? "text-6xl font-bold text-[var(--rcb-text)] sm:text-7xl"
      : "text-3xl font-bold text-[var(--rcb-text)]";

  const descriptionClass =
    headingLevel === "h2"
      ? "mt-7 text-xl leading-relaxed text-[var(--rcb-text-muted)]"
      : "mt-7 text-lg leading-relaxed text-[var(--rcb-text-muted)]";

  return (
    <>
      <div className="mx-auto max-w-4xl text-center">
        <Heading className={headingClass}>{heading ?? t.faq.heading}</Heading>
        <p className={descriptionClass}>{description ?? t.faq.description}</p>
      </div>

      <div className="mx-auto mt-14 max-w-6xl space-y-6">
        {items.map((item, index) => {
          const isOpen = openItems.includes(index);

          return (
            <article key={item.question} className="rounded-2xl border border-[var(--rcb-border-muted)] border-l-4 border-l-[var(--rcb-primary)] bg-[var(--rcb-bg)] p-7">
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full cursor-pointer items-start justify-between gap-5 text-left"
                aria-expanded={isOpen}
              >
                <QuestionTag className="text-xl font-bold text-[var(--rcb-text)] sm:text-2xl">{item.question}</QuestionTag>
                <span className="mt-1">
                  <PlusMinus open={isOpen} className="h-8 w-8 text-[var(--rcb-primary)]" />
                </span>
              </button>
              {isOpen ? (
                <div className="mt-4 max-w-5xl text-base leading-relaxed text-[var(--rcb-text)] sm:text-lg">
                  {typeof item.answer === "string" ? (
                    <p>{item.answer}</p>
                  ) : (
                    <>
                      <p>{item.answer.intro}</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5">
                        {item.answer.bullets.map((b) => (
                          <li key={b.label}>
                            <strong>{b.label}</strong> {renderBold(b.text)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </>
  );
}
