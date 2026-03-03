import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/context";

export function CategoriesSection() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="scroll-mt-24 bg-[var(--rcb-bg)]">
      <div className="section-shell py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-bold leading-tight text-[var(--rcb-text)] sm:text-7xl">
            {t.categories.heading}
          </h2>
          <p className="mt-7 text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
            {t.categories.description}
          </p>
          <p className="mt-2 text-4xl font-bold text-[var(--rcb-text-body)]">
            {t.categories.minValueLabel}
          </p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {t.categories.items.map((item) => (
            <article key={item.label} className="text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-[var(--rcb-primary)] bg-[var(--rcb-bg)]">
                <img src={item.image} alt={item.label} className="h-16 w-16 object-contain" />
              </div>
              <p className="mt-6 text-3xl text-[var(--rcb-text-light)]">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-10">
          <Button>{t.buttons.registerItem}</Button>
          <a href="#inscription" className="text-2xl font-semibold underline">
            {t.categories.viewCategoriesLink} &gt;
          </a>
        </div>
      </div>
    </section>
  );
}
