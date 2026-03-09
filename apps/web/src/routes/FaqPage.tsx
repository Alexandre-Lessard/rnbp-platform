import { type ReactNode, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlusMinus } from "@/components/icons/PlusMinus";
import { useLanguage } from "@/i18n/context";

function renderBold(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

export function FaqPage() {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenItems((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <section className="bg-[var(--rcb-bg)]">
      <Helmet>
        <title>{t.pages.faq.title}</title>
        <meta name="description" content={t.pages.faq.description} />
      </Helmet>
      <div className="section-shell py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-[var(--rcb-text)]">{t.faq.heading}</h1>
          <p className="mt-7 text-lg leading-relaxed text-[var(--rcb-text-muted)]">
            {t.faq.description}
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-6xl space-y-6">
          {t.faq.items.map((item, index) => {
            const isOpen = openItems.includes(index);

            return (
              <article key={item.question} className="rounded-2xl border border-[var(--rcb-border-muted)] border-l-4 border-l-[var(--rcb-primary)] bg-[var(--rcb-bg)] p-7">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-5 text-left"
                  aria-expanded={isOpen}
                >
                  <h2 className="text-xl font-bold text-[var(--rcb-text)] sm:text-2xl">{item.question}</h2>
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
      </div>
    </section>
  );
}
