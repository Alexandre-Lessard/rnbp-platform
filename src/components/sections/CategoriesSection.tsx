import type { CategoryItem } from "../../types/content";
import { Button } from "../ui/Button";

type CategoriesSectionProps = {
  items: CategoryItem[];
  minValueLabel: string;
};

export function CategoriesSection({ items, minValueLabel }: CategoriesSectionProps) {
  return (
    <section id="categories" className="scroll-mt-24 bg-[var(--rcb-bg)]">
      <div className="section-shell py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-bold leading-tight text-[var(--rcb-text)] sm:text-7xl">
            Protégez vos biens de valeur dès aujourd'hui
          </h2>
          <p className="mt-7 text-3xl leading-relaxed text-[var(--rcb-text-muted)]">
            Le Registre canadien des biens personnels vous permet d'enregistrer vos possessions précieuses
            pour faciliter leur identification et leur restitution en cas de vol.
          </p>
          <p className="mt-2 text-4xl font-bold text-[var(--rcb-text-body)]">{minValueLabel}</p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.label} className="text-center">
              <img src={item.image} alt={item.label} className="mx-auto h-28 w-28 object-contain" />
              <p className="mt-6 text-3xl text-[var(--rcb-text-light)]">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-10">
          <Button>Enregistrer un bien</Button>
          <a href="#inscription" className="text-2xl font-semibold underline">
            Voir catégories des biens &gt;
          </a>
        </div>
      </div>
    </section>
  );
}
