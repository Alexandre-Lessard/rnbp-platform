import { useState } from "react";
import type { FaqItem } from "../../types/content";
import { Button } from "../ui/Button";

type FaqSectionProps = {
  items: FaqItem[];
};

function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-8 w-8 text-[var(--rcb-navy)]">
      <path
        d="M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {!open ? (
        <path
          d="M12 5v14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

export function FaqSection({ items }: FaqSectionProps) {
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
          <h2 className="text-6xl font-bold text-[var(--rcb-text)] sm:text-7xl">FAQ</h2>
          <p className="mt-7 text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
            Trouvez les réponses aux questions courantes sur l'enregistrement de vos biens.
          </p>
          <Button className="mt-8">Voir FAQ</Button>
        </div>

        <div className="mx-auto mt-14 max-w-6xl space-y-6">
          {items.map((item, index) => {
            const isOpen = openItems.includes(index);

            return (
              <article key={item.question} className="rounded-2xl border border-[var(--rcb-border-muted)] bg-[var(--rcb-bg)] p-7">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-5 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-5xl font-bold text-[var(--rcb-text)]">{item.question}</h3>
                  <span className="mt-1">
                    <PlusMinus open={isOpen} />
                  </span>
                </button>
                {isOpen ? (
                  <p className="mt-5 max-w-5xl text-3xl leading-relaxed text-[var(--rcb-text-muted)]">{item.answer}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
