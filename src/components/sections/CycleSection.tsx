import type { CyclePoint } from "../../types/content";

type CycleSectionProps = {
  actions: CyclePoint[];
  benefits: CyclePoint[];
};

function CycleColumn({
  items,
  align = "left",
}: {
  items: CyclePoint[];
  align?: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article
          key={`${item.number}-${item.title}-${align}`}
          className="border-t border-[#9fa3a6] pt-6 text-left"
        >
          <div className={`flex items-center gap-3 text-4xl font-bold ${isRight ? "justify-between" : ""}`}>
            {!isRight ? <span className="text-3xl">{item.number}</span> : null}
            <h3>{item.title}</h3>
            {isRight ? <span className="text-3xl">{item.number}</span> : null}
          </div>
          <p className="mt-4 text-3xl text-slate-700">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export function CycleSection({ actions, benefits }: CycleSectionProps) {
  return (
    <section id="cycle" className="section-frame scroll-mt-24 border-t-0 bg-[#f5f6f8]">
      <div className="section-shell py-18 sm:py-20">
        <h2 className="text-center text-6xl font-bold text-slate-950 sm:text-7xl">
          Cycle du Registre des biens
        </h2>

        <div className="mt-14 grid items-start gap-12 xl:grid-cols-[1fr_0.95fr_1fr]">
          <CycleColumn items={actions} align="left" />

          <figure className="mx-auto w-full max-w-[430px]">
            <img
              src="/assets/cycle-police.png"
              alt="Agent prenant note d'un vélo volé"
              className="h-auto w-full rounded-[2.2rem] object-cover"
            />
          </figure>

          <CycleColumn items={benefits} align="right" />
        </div>

        <div className="mt-14 text-center">
          <button
            type="button"
            className="rounded-xl border border-[var(--rcb-primary)] bg-white px-8 py-4 text-lg font-medium text-slate-900 transition-colors hover:bg-[var(--rcb-primary-light)]"
          >
            Déclare un bien volé
          </button>
        </div>
      </div>
    </section>
  );
}
