import { useState } from "react";
import type { FaqItem } from "../../types/content";

type FaqSectionProps = {
  items: FaqItem[];
};

function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-8 w-8 text-[#0c5488]">
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
  const [openItems, setOpenItems] = useState<number[]>([0, 1, 2, 3, 4]);

  const toggle = (index: number) => {
    setOpenItems((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <section id="faq" className="section-frame scroll-mt-24 border-t-0 bg-[#f6f7f9]">
      <div className="section-shell py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-bold text-slate-950 sm:text-7xl">FAQ</h2>
          <p className="mt-7 text-3xl leading-relaxed text-slate-600">
            Trouvez les réponses aux questions courantes sur l'enregistrement de vos biens.
          </p>
          <button
            type="button"
            className="mt-8 rounded-xl bg-[var(--rcb-primary)] px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
          >
            Voir FAQ
          </button>
        </div>

        <div className="mx-auto mt-14 max-w-6xl space-y-6">
          {items.map((item, index) => {
            const isOpen = openItems.includes(index);

            return (
              <article key={item.question} className="rounded-2xl border border-[#8f8f8f] bg-[#f6f7f9] p-7">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-start justify-between gap-5 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-5xl font-bold text-slate-950">{item.question}</h3>
                  <span className="mt-1">
                    <PlusMinus open={isOpen} />
                  </span>
                </button>
                {isOpen ? (
                  <p className="mt-5 max-w-5xl text-3xl leading-relaxed text-slate-600">{item.answer}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
