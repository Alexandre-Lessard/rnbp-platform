import { useState } from "react";
import { useLanguage } from "@/i18n/context";

export function AllCategoriesSection() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section id="all-categories" className="scroll-mt-24 bg-[var(--rcb-bg)]">
      <div className="section-shell py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-bold leading-tight text-[var(--rcb-text)] sm:text-7xl">
            {t.allCategories.heading}
          </h2>
          <p className="mt-7 text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
            {t.allCategories.description}
          </p>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[var(--rcb-primary)] bg-[var(--rcb-primary)]/10 px-8 py-3 text-lg font-semibold text-[var(--rcb-primary)] transition-colors hover:bg-[var(--rcb-primary)] hover:text-white"
          >
            {t.allCategories.toggleButton}
            <svg
              className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {t.allCategories.items.map((category) => (
              <div
                key={category}
                className="rounded-xl border border-[var(--rcb-primary)]/20 bg-[var(--rcb-primary)]/5 px-5 py-4 text-center text-lg font-medium text-[var(--rcb-text-strong)]"
              >
                {category}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
