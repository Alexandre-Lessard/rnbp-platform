import { Link } from "react-router";
import type { CyclePoint } from "@/types/content";
import { useLanguage } from "@/i18n/context";
import { useAuth } from "@/lib/auth-context";
import { getButtonClasses } from "@/lib/button-styles";

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
          className="border-t border-[var(--rcb-border-muted)] pt-6 text-left"
        >
          <div className={`flex items-center gap-3 text-4xl font-bold ${isRight ? "justify-between" : ""}`}>
            {!isRight ? <span className="text-3xl">{item.number}</span> : null}
            <h3>{item.title}</h3>
            {isRight ? <span className="text-3xl">{item.number}</span> : null}
          </div>
          <p className="mt-4 text-3xl text-[var(--rcb-text-body)]">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export function CycleSection() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section id="cycle" className="scroll-mt-24 bg-[var(--rcb-surface)]">
      <div className="section-shell py-18 sm:py-20">
        <h2 className="text-center text-6xl font-bold text-[var(--rcb-text)] sm:text-7xl">
          {t.cycle.heading}
        </h2>

        <div className="mt-14 grid items-start gap-12 xl:grid-cols-[1fr_0.95fr_1fr]">
          <CycleColumn items={t.cycle.actions} align="left" />

          <figure className="mx-auto w-full max-w-[430px]">
            <img
              src="/assets/cycle-police.png"
              alt={t.cycle.imageAlt}
              className="h-auto w-full rounded-[2.2rem] object-cover"
            />
          </figure>

          <CycleColumn items={t.cycle.benefits} align="right" />
        </div>

        <div className="mt-14 text-center">
          <Link
            to={user ? "/declarer-vol" : "/connexion?redirect=/declarer-vol"}
            className={getButtonClasses("outline")}
          >
            {t.buttons.declareStolen}
          </Link>
        </div>
      </div>
    </section>
  );
}
