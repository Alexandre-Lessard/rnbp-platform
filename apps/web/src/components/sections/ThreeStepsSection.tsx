import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";

export function ThreeStepsSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--rcb-surface)]">
      <div className="section-shell py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-[var(--rcb-text)] sm:text-7xl">{t.threeSteps.heading}</h2>
          <p className="mt-5 text-3xl text-[var(--rcb-text-muted)]">{t.threeSteps.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-3">
          {t.threeSteps.steps.map((step) => (
            <article
              key={step.step}
              className="flex flex-col overflow-hidden rounded-[2.2rem] border border-[var(--rcb-border-muted)] bg-[var(--rcb-surface)]"
            >
              <div className="grid flex-1 grid-rows-[auto_1fr_auto_auto] px-9 pt-8 pb-7">
                <p className="text-3xl font-bold text-[var(--rcb-text-light)]">{step.step}</p>
                <h3 className="mt-5 self-start text-5xl font-bold leading-tight text-[var(--rcb-text)]">{step.title}</h3>
                <p className="mt-6 text-3xl leading-relaxed text-[var(--rcb-text-muted)]">{step.description}</p>
                <Link to="/enregistrer" className="mt-6 inline-block text-2xl font-semibold text-[var(--rcb-text-strong)]">
                  {t.threeSteps.learnMoreLink} &gt;
                </Link>
              </div>
              <img src={step.image} alt={step.title} loading="lazy" className="h-52 w-full object-cover object-bottom" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
